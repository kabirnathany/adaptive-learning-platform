import 'dotenv/config';
import mongoose from 'mongoose';
import { Subject } from '../models/Subject.js';
import { Topic } from '../models/Topic.js';
import { Question } from '../models/Question.js';
import { LearningMaterial } from '../models/LearningMaterial.js';
import { GRADE_LEVELS, MATH_TOPICS, ENGLISH_TOPICS, SCIENCE_TOPICS } from './seedData.js';

const SUBJECTS = [
  { name: 'Math', description: 'Mathematics from K-12', data: MATH_TOPICS },
  { name: 'English', description: 'English Language Arts K-12', data: ENGLISH_TOPICS },
  { name: 'Science', description: 'Science K-12', data: SCIENCE_TOPICS },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Subject.deleteMany({});
  await Topic.deleteMany({});
  await Question.deleteMany({});
  await LearningMaterial.deleteMany({});

  for (const s of SUBJECTS) {
    const subject = await Subject.create({
      name: s.name,
      description: s.description,
      gradeLevels: [...GRADE_LEVELS],
    });
    let order = 0;
    for (const grade of GRADE_LEVELS) {
      const topicData = s.data[grade];
      const topicName = topicData?.topicName ?? `${s.name} Grade ${grade}`;
      const topicDescription = topicData?.topicDescription ?? `Core ${s.name} concepts for grade ${grade}.`;
      const topic = await Topic.create({
        subjectId: subject._id,
        gradeLevel: grade,
        name: topicName,
        description: topicDescription,
        order: order++,
      });
      if (topicData?.questions?.length) {
        for (const q of topicData.questions) {
          await Question.create({
            topicId: topic._id,
            text: q.text,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation ?? '',
            difficulty: q.difficulty ?? 'medium',
          });
        }
      } else {
        await Question.create({
          topicId: topic._id,
          text: `Sample ${s.name} question for grade ${grade}: What is the correct answer?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: 0,
          explanation: 'Review the topic to understand the correct answer.',
          difficulty: 'medium',
        });
      }
      if (topicData?.material) {
        await LearningMaterial.create({
          topicId: topic._id,
          type: 'text',
          title: topicData.material.title,
          content: topicData.material.content,
          order: 0,
        });
      } else {
        await LearningMaterial.create({
          topicId: topic._id,
          type: 'text',
          title: `Study guide - ${topicName}`,
          content: `Review material for ${topicName}. Practice these concepts to improve.`,
          order: 0,
        });
      }
    }
  }

  console.log('Seed complete: subjects, topics, real questions, and learning materials created.');
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
