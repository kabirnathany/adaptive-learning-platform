import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Subject } from '../models/Subject.js';
import { Topic } from '../models/Topic.js';
import { Question } from '../models/Question.js';
import { QuizResult } from '../models/QuizResult.js';
import { UserMastery } from '../models/UserMastery.js';
import mongoose from 'mongoose';

const router = Router();

// Get questions for initial quiz: one subject, all grade levels mixed (e.g. 5 per grade or total cap)
router.get('/initial/:subjectId', requireAuth, async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.subjectId).lean();
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    const topics = await Topic.find({ subjectId: subject._id }).select('_id gradeLevel').lean();
    const topicIds = topics.map((t) => t._id);
    const perTopic = Math.max(1, Math.floor(20 / Math.max(1, topicIds.length)));
    const questions = await Question.aggregate([
      { $match: { topicId: { $in: topicIds } } },
      { $sample: { size: Math.min(30, topics.length * perTopic) } },
      { $project: { text: 1, options: 1, topicId: 1, difficulty: 1 } },
    ]);
    res.json({
      subjectId: subject._id,
      subjectName: subject.name,
      questions: questions.map((q) => ({
        id: q._id,
        text: q.text,
        options: q.options,
        topicId: q.topicId,
        difficulty: q.difficulty,
      })),
    });
  } catch (e) {
    next(e);
  }
});

// Submit initial or adaptive quiz and compute mastery + next recommendations
router.post('/submit', requireAuth, async (req, res, next) => {
  try {
    const { subjectId, type, answers } = req.body;
    if (!subjectId || !type || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'subjectId, type, and answers array required' });
    }
    const subject = await Subject.findById(subjectId).lean();
    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    const questionIds = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } })
      .select('_id correctIndex topicId')
      .lean();
    const qMap = Object.fromEntries(questions.map((q) => [q._id.toString(), q]));

    const scored = answers.map((a) => {
      const q = qMap[a.questionId];
      const correct = q && a.selectedIndex === q.correctIndex;
      return {
        questionId: a.questionId,
        selectedIndex: a.selectedIndex,
        correct,
        timeSpentMs: Number(a.timeSpentMs) || 0,
      };
    });

    const correctCount = scored.filter((r) => r.correct).length;
    const scorePercent = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;

    await QuizResult.create({
      userId: req.userId,
      subjectId,
      type: type === 'adaptive' ? 'adaptive' : 'initial',
      answers: scored,
      scorePercent,
    });

    // Update mastery per topic
    const topicCorrect = {};
    const topicTotal = {};
    for (const a of scored) {
      const q = qMap[a.questionId];
      if (!q) continue;
      const tid = q.topicId.toString();
      topicTotal[tid] = (topicTotal[tid] || 0) + 1;
      if (a.correct) topicCorrect[tid] = (topicCorrect[tid] || 0) + 1;
    }

    for (const [topicId, total] of Object.entries(topicTotal)) {
      const correct = topicCorrect[topicId] || 0;
      const pct = Math.round((correct / total) * 100);
      const existing = await UserMastery.findOne({ userId: req.userId, topicId: new mongoose.Types.ObjectId(topicId) });
      if (existing) {
        const newScore = Math.round(existing.score * 0.6 + pct * 0.4);
        existing.score = Math.min(100, Math.max(0, newScore));
        existing.attempts += 1;
        existing.lastAttemptAt = new Date();
        await existing.save();
      } else {
        await UserMastery.create({
          userId: req.userId,
          topicId,
          score: pct,
          attempts: 1,
          lastAttemptAt: new Date(),
        });
      }
    }

    const masteries = await UserMastery.find({ userId: req.userId })
      .populate('topicId', 'name gradeLevel subjectId')
      .lean();
    const weakTopics = masteries
      .filter((m) => m.topicId && m.topicId.subjectId?.toString() === subjectId.toString() && m.score < 70)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);

    res.json({
      scorePercent,
      correctCount,
      total: questions.length,
      weakTopicIds: weakTopics.map((m) => m.topicId._id),
      message: 'Quiz saved. Learning path will focus on weaker topics.',
    });
  } catch (e) {
    next(e);
  }
});

// Get adaptive quiz: questions from weak topics (low mastery)
router.get('/adaptive/:subjectId', requireAuth, async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.subjectId).lean();
    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    const masteries = await UserMastery.find({ userId: req.userId })
      .populate('topicId')
      .lean();
    const subjectMasteries = masteries.filter(
      (m) => m.topicId && m.topicId.subjectId?.toString() === subject._id.toString()
    );
    const weakFirst = [...subjectMasteries].sort((a, b) => a.score - b.score);
    const topicIds = weakFirst.length
      ? weakFirst.map((m) => m.topicId._id)
      : (await Topic.find({ subjectId: subject._id }).select('_id').lean()).map((t) => t._id);

    const perTopic = Math.max(2, Math.floor(15 / Math.max(1, topicIds.length)));
    const questions = await Question.aggregate([
      { $match: { topicId: { $in: topicIds } } },
      { $sample: { size: Math.min(20, topicIds.length * perTopic) } },
      { $project: { text: 1, options: 1, topicId: 1, difficulty: 1 } },
    ]);

    res.json({
      subjectId: subject._id,
      subjectName: subject.name,
      questions: questions.map((q) => ({
        id: q._id,
        text: q.text,
        options: q.options,
        topicId: q.topicId,
        difficulty: q.difficulty,
      })),
    });
  } catch (e) {
    next(e);
  }
});

export { router as quizRouter };
