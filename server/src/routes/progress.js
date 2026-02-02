import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { QuizResult } from '../models/QuizResult.js';
import { UserMastery } from '../models/UserMastery.js';
import { Topic } from '../models/Topic.js';
import { Subject } from '../models/Subject.js';

const router = Router();

// Dashboard: summary + recommended topics + recent quizzes
router.get('/dashboard', requireAuth, async (req, res, next) => {
  try {
    const [recentQuizzes, masteries, subjects] = await Promise.all([
      QuizResult.find({ userId: req.userId }).sort({ completedAt: -1 }).limit(10).populate('subjectId', 'name').lean(),
      UserMastery.find({ userId: req.userId }).populate('topicId').lean(),
      Subject.find().select('name _id').lean(),
    ]);

    const bySubject = {};
    for (const m of masteries) {
      if (!m.topicId) continue;
      const sid = m.topicId.subjectId?.toString();
      if (!sid) continue;
      if (!bySubject[sid]) bySubject[sid] = { mastered: 0, weak: 0, total: 0 };
      bySubject[sid].total += 1;
      if (m.score >= 80) bySubject[sid].mastered += 1;
      else if (m.score < 70) bySubject[sid].weak += 1;
    }

    const recommended = masteries
      .filter((m) => m.topicId && m.score < 70)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5)
      .map((m) => ({
        topicId: m.topicId._id,
        topicName: m.topicId.name,
        subjectId: m.topicId.subjectId,
        score: m.score,
      }));

    res.json({
      recentQuizzes: recentQuizzes.map((q) => ({
        id: q._id,
        subjectName: q.subjectId?.name,
        subjectId: q.subjectId?._id,
        type: q.type,
        scorePercent: q.scorePercent,
        completedAt: q.completedAt,
      })),
      bySubject: subjects.map((s) => ({
        subjectId: s._id,
        subjectName: s.name,
        ...(bySubject[s._id.toString()] || { mastered: 0, weak: 0, total: 0 }),
      })),
      recommendedTopics: recommended,
    });
  } catch (e) {
    next(e);
  }
});

// Full progress: mastery per topic for a subject
router.get('/subject/:subjectId', requireAuth, async (req, res, next) => {
  try {
    const masteries = await UserMastery.find({ userId: req.userId })
      .populate({ path: 'topicId', match: { subjectId: req.params.subjectId } })
      .lean();
    const filtered = masteries.filter((m) => m.topicId);
    res.json({
      masteries: filtered.map((m) => ({
        topicId: m.topicId._id,
        topicName: m.topicId.name,
        gradeLevel: m.topicId.gradeLevel,
        score: m.score,
        attempts: m.attempts,
        lastAttemptAt: m.lastAttemptAt,
      })),
    });
  } catch (e) {
    next(e);
  }
});

// Quiz history for user
router.get('/quizzes', requireAuth, async (req, res, next) => {
  try {
    const list = await QuizResult.find({ userId: req.userId })
      .sort({ completedAt: -1 })
      .limit(50)
      .populate('subjectId', 'name')
      .select('subjectId type scorePercent completedAt')
      .lean();
    res.json({ quizzes: list });
  } catch (e) {
    next(e);
  }
});

export { router as progressRouter };
