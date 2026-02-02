import 'dotenv/config';
import mongoose from 'mongoose';
import { Subject } from '../models/Subject.js';
import { Topic } from '../models/Topic.js';
import { Question } from '../models/Question.js';
import { LearningMaterial } from '../models/LearningMaterial.js';

const GRADE_LEVELS = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const SUBJECTS = [
  { name: 'Math', description: 'Mathematics from K-12' },
  { name: 'English', description: 'English Language Arts K-12' },
  { name: 'Science', description: 'Science K-12' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Subject.deleteMany({});
  await Topic.deleteMany({});
  await Question.deleteMany({});
  await LearningMaterial.deleteMany({});

  for (const s of SUBJECTS) {
    const subject = await Subject.create({
      ...s,
      gradeLevels: [...GRADE_LEVELS],
    });
    let order = 0;
    for (const grade of GRADE_LEVELS) {
      const topicName =
        s.name === 'Math'
          ? `Grade ${grade} Math - Numbers & Operations`
          : s.name === 'English'
          ? `Grade ${grade} English - Reading & Writing`
          : `Grade ${grade} Science - Life & Earth`;
      const topic = await Topic.create({
        subjectId: subject._id,
        gradeLevel: grade,
        name: topicName,
        description: `Core ${s.name} concepts for grade ${grade}.`,
        order: order++,
      });
      const qCount = 3;
      for (let i = 0; i < qCount; i++) {
        await Question.create({
          topicId: topic._id,
          text: `Sample ${s.name} question for grade ${grade} (#${i + 1}): What is the correct answer?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: i % 4,
          explanation: 'This is the explanation for the correct answer.',
          difficulty: ['easy', 'medium', 'hard'][i % 3],
        });
      }
      await LearningMaterial.create({
        topicId: topic._id,
        type: 'text',
        title: `Study guide - ${topicName}`,
        content: `Review material for ${topicName}. Practice these concepts to improve.`,
        order: 0,
      });
    }
  }

  console.log('Seed complete: subjects, topics, sample questions, and materials created.');
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
