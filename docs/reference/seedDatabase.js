// server/src/scripts/seedDatabase.js
const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Question = require('../models/Question');
require('dotenv').config();

// Multi-grade level seed data
const seedData = {
  Math: {
    grades: {
      0: { // Kindergarten
        topics: [
          {
            name: 'Counting to 10',
            description: 'Learn to count from 1 to 10',
            order: 1,
            questions: [
              { q: 'How many apples? 🍎🍎🍎', opts: ['2', '3', '4', '5'], ans: '3' },
              { q: 'Count the stars: ⭐⭐⭐⭐⭐', opts: ['4', '5', '6', '7'], ans: '5' },
              { q: 'How many circles? ⭕⭕', opts: ['1', '2', '3', '4'], ans: '2' }
            ]
          },
          {
            name: 'Basic Shapes',
            description: 'Identify circles, squares, and triangles',
            order: 2,
            questions: [
              { q: 'Which shape has 3 sides?', opts: ['Circle', 'Square', 'Triangle', 'Rectangle'], ans: 'Triangle' },
              { q: 'Which shape has no corners?', opts: ['Square', 'Triangle', 'Circle', 'Rectangle'], ans: 'Circle' }
            ]
          }
        ]
      },
      1: {
        topics: [
          {
            name: 'Addition within 20',
            description: 'Add numbers up to 20',
            order: 1,
            questions: [
              { q: '5 + 3 = ?', opts: ['6', '7', '8', '9'], ans: '8' },
              { q: '10 + 7 = ?', opts: ['15', '16', '17', '18'], ans: '17' },
              { q: '4 + 4 = ?', opts: ['6', '7', '8', '9'], ans: '8' }
            ]
          },
          {
            name: 'Subtraction within 20',
            description: 'Subtract numbers up to 20',
            order: 2,
            questions: [
              { q: '10 - 3 = ?', opts: ['5', '6', '7', '8'], ans: '7' },
              { q: '15 - 8 = ?', opts: ['5', '6', '7', '8'], ans: '7' }
            ]
          }
        ]
      },
      3: {
        topics: [
          {
            name: 'Multiplication Tables',
            description: 'Multiply single-digit numbers',
            order: 1,
            questions: [
              { q: '3 × 4 = ?', opts: ['10', '11', '12', '13'], ans: '12' },
              { q: '5 × 6 = ?', opts: ['28', '29', '30', '31'], ans: '30' },
              { q: '7 × 8 = ?', opts: ['54', '55', '56', '57'], ans: '56' }
            ]
          },
          {
            name: 'Division Basics',
            description: 'Divide numbers evenly',
            order: 2,
            questions: [
              { q: '12 ÷ 3 = ?', opts: ['3', '4', '5', '6'], ans: '4' },
              { q: '20 ÷ 5 = ?', opts: ['3', '4', '5', '6'], ans: '4' }
            ]
          }
        ]
      },
      5: {
        topics: [
          {
            name: 'Fractions',
            description: 'Understanding and comparing fractions',
            order: 1,
            questions: [
              { q: 'What is 1/2 + 1/4?', opts: ['1/4', '2/4', '3/4', '4/4'], ans: '3/4' },
              { q: 'Which is larger: 2/3 or 3/4?', opts: ['2/3', '3/4', 'Equal', 'Cannot compare'], ans: '3/4' }
            ]
          },
          {
            name: 'Decimals',
            description: 'Working with decimal numbers',
            order: 2,
            questions: [
              { q: '0.5 + 0.3 = ?', opts: ['0.7', '0.8', '0.9', '1.0'], ans: '0.8' },
              { q: 'What is 0.25 as a fraction?', opts: ['1/2', '1/4', '1/3', '1/5'], ans: '1/4' }
            ]
          }
        ]
      },
      8: {
        topics: [
          {
            name: 'Algebraic Expressions',
            description: 'Simplifying and solving expressions',
            order: 1,
            questions: [
              { q: 'Solve for x: 2x + 5 = 13', opts: ['2', '3', '4', '5'], ans: '4' },
              { q: 'Simplify: 3x + 2x', opts: ['5x', '6x', '5x²', '6'], ans: '5x' }
            ]
          },
          {
            name: 'Linear Equations',
            description: 'Solving linear equations',
            order: 2,
            questions: [
              { q: 'Solve: 3x - 7 = 14', opts: ['5', '6', '7', '8'], ans: '7' },
              { q: 'Solve: x/4 = 5', opts: ['15', '20', '25', '30'], ans: '20' }
            ]
          }
        ]
      },
      10: {
        topics: [
          {
            name: 'Quadratic Equations',
            description: 'Solving quadratic equations',
            order: 1,
            questions: [
              { q: 'Solve: x² - 5x + 6 = 0', opts: ['x = 1, 6', 'x = 2, 3', 'x = -2, -3', 'x = 3, 4'], ans: 'x = 2, 3' },
              { q: 'What is the vertex form of y = x² + 4x + 3?', opts: ['y = (x+2)² - 1', 'y = (x+2)² + 1', 'y = (x-2)² - 1', 'y = (x-2)² + 1'], ans: 'y = (x+2)² - 1' }
            ]
          }
        ]
      }
    }
  },
  English: {
    grades: {
      0: {
        topics: [
          {
            name: 'Letter Recognition',
            description: 'Identify uppercase and lowercase letters',
            order: 1,
            questions: [
              { q: 'Which letter comes after B?', opts: ['A', 'C', 'D', 'E'], ans: 'C' },
              { q: 'What is the first letter of "apple"?', opts: ['A', 'B', 'C', 'D'], ans: 'A' }
            ]
          }
        ]
      },
      2: {
        topics: [
          {
            name: 'Nouns and Verbs',
            description: 'Identify parts of speech',
            order: 1,
            questions: [
              { q: 'Which word is a noun? "The dog runs fast."', opts: ['The', 'dog', 'runs', 'fast'], ans: 'dog' },
              { q: 'Which word is a verb? "She jumps high."', opts: ['She', 'jumps', 'high', 'is'], ans: 'jumps' }
            ]
          },
          {
            name: 'Sentence Structure',
            description: 'Understanding basic sentences',
            order: 2,
            questions: [
              { q: 'Which is a complete sentence?', opts: ['Running fast', 'The cat sleeps', 'Very happy', 'In the house'], ans: 'The cat sleeps' }
            ]
          }
        ]
      },
      5: {
        topics: [
          {
            name: 'Main Idea',
            description: 'Finding the main idea in paragraphs',
            order: 1,
            questions: [
              { q: 'What is the main idea of a text about recycling benefits?', opts: ['Plastic is bad', 'Recycling helps the environment', 'Trash is everywhere', 'Paper comes from trees'], ans: 'Recycling helps the environment' }
            ]
          },
          {
            name: 'Context Clues',
            description: 'Using context to understand vocabulary',
            order: 2,
            questions: [
              { q: 'In "The ancient ruins were very old," what does ancient mean?', opts: ['New', 'Old', 'Broken', 'Beautiful'], ans: 'Old' }
            ]
          }
        ]
      },
      8: {
        topics: [
          {
            name: 'Literary Devices',
            description: 'Identifying metaphors, similes, and more',
            order: 1,
            questions: [
              { q: 'Which is a metaphor?', opts: ['He runs like the wind', 'Time is money', 'She is as tall as a tree', 'The water sparkled'], ans: 'Time is money' },
              { q: 'What literary device is "The wind whispered"?', opts: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], ans: 'Personification' }
            ]
          }
        ]
      }
    }
  },
  Science: {
    grades: {
      1: {
        topics: [
          {
            name: 'Living vs Non-Living',
            description: 'Distinguish between living and non-living things',
            order: 1,
            questions: [
              { q: 'Which is living?', opts: ['Rock', 'Plant', 'Water', 'Air'], ans: 'Plant' },
              { q: 'Which is non-living?', opts: ['Dog', 'Tree', 'Stone', 'Bird'], ans: 'Stone' }
            ]
          }
        ]
      },
      3: {
        topics: [
          {
            name: 'States of Matter',
            description: 'Solid, liquid, and gas',
            order: 1,
            questions: [
              { q: 'What state is water in ice?', opts: ['Solid', 'Liquid', 'Gas', 'Plasma'], ans: 'Solid' },
              { q: 'What happens to water when it boils?', opts: ['Freezes', 'Becomes gas', 'Becomes solid', 'Nothing'], ans: 'Becomes gas' }
            ]
          }
        ]
      },
      5: {
        topics: [
          {
            name: 'Photosynthesis',
            description: 'How plants make food',
            order: 1,
            questions: [
              { q: 'What do plants need for photosynthesis?', opts: ['Water only', 'Sunlight and water', 'Soil only', 'Air only'], ans: 'Sunlight and water' },
              { q: 'What gas do plants release during photosynthesis?', opts: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], ans: 'Oxygen' }
            ]
          }
        ]
      },
      8: {
        topics: [
          {
            name: 'Chemical Reactions',
            description: 'Understanding chemical changes',
            order: 1,
            questions: [
              { q: 'What is a sign of a chemical reaction?', opts: ['Color change', 'Shape change', 'Size change', 'Weight change'], ans: 'Color change' },
              { q: 'In the equation H₂ + O₂ → H₂O, what is H₂O?', opts: ['Reactant', 'Product', 'Catalyst', 'Element'], ans: 'Product' }
            ]
          }
        ]
      },
      10: {
        topics: [
          {
            name: 'Newton\'s Laws',
            description: 'Understanding motion and forces',
            order: 1,
            questions: [
              { q: 'What is Newton\'s First Law?', opts: ['Force = mass × acceleration', 'Object in motion stays in motion', 'Action-reaction', 'Gravity'], ans: 'Object in motion stays in motion' },
              { q: 'If you push a wall, the wall pushes back. This is which law?', opts: ['First', 'Second', 'Third', 'Fourth'], ans: 'Third' }
            ]
          }
        ]
      }
    }
  }
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Subject.deleteMany({});
    await Topic.deleteMany({});
    await Question.deleteMany({});
    console.log('Cleared existing data');

    // Seed subjects and topics with questions
    for (const [subjectName, subjectData] of Object.entries(seedData)) {
      // Create subject
      const subject = await Subject.create({
        name: subjectName,
        description: `${subjectName} curriculum from Kindergarten to Grade 12`,
        gradeRange: { min: 0, max: 12 }
      });
      console.log(`Created subject: ${subjectName}`);

      // Create topics and questions for each grade level
      for (const [gradeLevel, gradeData] of Object.entries(subjectData.grades)) {
        const grade = parseInt(gradeLevel);

        for (const topicData of gradeData.topics) {
          const topic = await Topic.create({
            subjectId: subject._id,
            subject: subjectName,
            gradeLevel: grade,
            name: topicData.name,
            description: topicData.description,
            order: topicData.order
          });
          console.log(`  Created topic: ${topicData.name} (Grade ${grade})`);

          // Create questions for this topic
          if (topicData.questions) {
            for (const questionData of topicData.questions) {
              await Question.create({
                topicId: topic._id,
                subject: subjectName,
                gradeLevel: grade,
                question: questionData.q,
                options: questionData.opts,
                correctAnswer: questionData.ans,
                difficulty: grade <= 2 ? 'easy' : grade <= 6 ? 'medium' : 'hard',
                explanation: `The correct answer is ${questionData.ans}.`
              });
            }
            console.log(`    Created ${topicData.questions.length} questions`);
          }
        }
      }
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSummary:');
    console.log(`- Subjects: ${await Subject.countDocuments()}`);
    console.log(`- Topics: ${await Topic.countDocuments()}`);
    console.log(`- Questions: ${await Question.countDocuments()}`);

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
