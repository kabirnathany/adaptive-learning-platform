import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Subject } from '../models/Subject.js';
import { Topic } from '../models/Topic.js';
import { LearningMaterial } from '../models/LearningMaterial.js';

const router = Router();

// List subjects (and grade levels) - public for landing; details after auth
router.get('/', async (req, res, next) => {
  try {
    const subjects = await Subject.find().select('name gradeLevels description').lean();
    res.json({ subjects });
  } catch (e) {
    next(e);
  }
});

// Topics for a subject (optionally by grade)
router.get('/:subjectId/topics', requireAuth, async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { gradeLevel } = req.query;
    const filter = { subjectId };
    if (gradeLevel) filter.gradeLevel = gradeLevel;
    const topics = await Topic.find(filter).sort('order gradeLevel').lean();
    res.json({ topics });
  } catch (e) {
    next(e);
  }
});

// Learning materials for a topic
router.get('/topics/:topicId/materials', requireAuth, async (req, res, next) => {
  try {
    const [topic, materials] = await Promise.all([
      Topic.findById(req.params.topicId).select('name description').lean(),
      LearningMaterial.find({ topicId: req.params.topicId })
        .sort('order')
        .select('title type content url order')
        .lean(),
    ]);
    res.json({ topicName: topic?.name, topicDescription: topic?.description, materials });
  } catch (e) {
    next(e);
  }
});

export { router as subjectsRouter };
