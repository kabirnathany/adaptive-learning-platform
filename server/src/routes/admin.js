import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { Subject } from '../models/Subject.js';
import { Topic } from '../models/Topic.js';
import { Question } from '../models/Question.js';
import { LearningMaterial } from '../models/LearningMaterial.js';
import { QuizResult } from '../models/QuizResult.js';
import { User } from '../models/User.js';

const router = Router();
router.use(requireAuth, requireAdmin);

// List users (no passwords)
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().select('_id email name role createdAt').lean();
    res.json({ users });
  } catch (e) {
    next(e);
  }
});

// Platform stats
router.get('/stats', async (req, res, next) => {
  try {
    const [userCount, quizCount, questionCount] = await Promise.all([
      User.countDocuments(),
      QuizResult.countDocuments(),
      Question.countDocuments(),
    ]);
    res.json({ userCount, quizCount, questionCount });
  } catch (e) {
    next(e);
  }
});

// List subjects
router.get('/subjects', async (req, res, next) => {
  try {
    const subjects = await Subject.find().lean();
    res.json({ subjects });
  } catch (e) {
    next(e);
  }
});

// Create subject
router.post(
  '/subjects',
  [body('name').isIn(['Math', 'English', 'Science']), body('gradeLevels').isArray(), body('gradeLevels.*').isString()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
      const subject = await Subject.create(req.body);
      res.status(201).json({ subject });
    } catch (e) {
      next(e);
    }
  }
);

// List topics for subject
router.get('/subjects/:subjectId/topics', async (req, res, next) => {
  try {
    const topics = await Topic.find({ subjectId: req.params.subjectId }).lean();
    res.json({ topics });
  } catch (e) {
    next(e);
  }
});

// Create topic
router.post(
  '/topics',
  [
    body('subjectId').isMongoId(),
    body('gradeLevel').isIn(['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
    body('name').trim().notEmpty(),
    body('description').optional().trim(),
    body('order').optional().isInt(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
      const topic = await Topic.create(req.body);
      res.status(201).json({ topic });
    } catch (e) {
      next(e);
    }
  }
);

// Create question
router.post(
  '/questions',
  [
    body('topicId').isMongoId(),
    body('text').trim().notEmpty(),
    body('options').isArray({ min: 2 }),
    body('options.*').trim().notEmpty(),
    body('correctIndex').isInt({ min: 0 }),
    body('explanation').optional().trim(),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
      const { topicId, text, options, correctIndex, explanation, difficulty } = req.body;
      if (correctIndex >= options.length) return res.status(400).json({ error: 'correctIndex out of range' });
      const question = await Question.create({
        topicId,
        text,
        options,
        correctIndex,
        explanation: explanation || '',
        difficulty: difficulty || 'medium',
      });
      res.status(201).json({ question });
    } catch (e) {
      next(e);
    }
  }
);

// Create learning material
router.post(
  '/materials',
  [
    body('topicId').isMongoId(),
    body('type').isIn(['text', 'video', 'link']),
    body('title').trim().notEmpty(),
    body('content').optional().trim(),
    body('url').optional().trim(),
    body('order').optional().isInt(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
      const material = await LearningMaterial.create(req.body);
      res.status(201).json({ material });
    } catch (e) {
      next(e);
    }
  }
);

// Update topic
router.patch('/topics/:id', async (req, res, next) => {
  try {
    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    res.json({ topic });
  } catch (e) {
    next(e);
  }
});

// Update question
router.patch('/questions/:id', async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json({ question });
  } catch (e) {
    next(e);
  }
});

export { router as adminRouter };
