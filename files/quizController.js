// server/src/controllers/quizController.js
const Question = require('../models/Question');
const Topic = require('../models/Topic');
const UserProgress = require('../models/UserProgress');

// Initialize subject with grade level selection
exports.selectGradeLevel = async (req, res) => {
  try {
    const { subject, gradeLevel } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!subject || gradeLevel === undefined) {
      return res.status(400).json({ 
        message: 'Subject and grade level are required' 
      });
    }

    if (!['Math', 'English', 'Science'].includes(subject)) {
      return res.status(400).json({ 
        message: 'Invalid subject. Must be Math, English, or Science' 
      });
    }

    if (gradeLevel < 0 || gradeLevel > 12) {
      return res.status(400).json({ 
        message: 'Grade level must be between 0 (Kindergarten) and 12' 
      });
    }

    // Get or create user progress
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      userProgress = new UserProgress({ 
        userId,
        subjectProgress: [],
        topicMastery: [],
        quizHistory: [],
        learningPath: []
      });
    }

    // Initialize the subject
    userProgress.initializeSubject(subject, gradeLevel);
    
    // Generate initial learning path
    await userProgress.generateLearningPath(subject, gradeLevel);
    
    await userProgress.save();

    res.json({
      message: `Grade level ${gradeLevel} selected for ${subject}`,
      subjectProgress: userProgress.subjectProgress.find(sp => sp.subject === subject),
      learningPath: userProgress.learningPath.filter(
        lp => lp.subject === subject && lp.gradeLevel === gradeLevel
      )
    });
  } catch (error) {
    console.error('Error selecting grade level:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available grade levels for a subject
exports.getAvailableGradeLevels = async (req, res) => {
  try {
    const { subject } = req.params;

    // Get all unique grade levels that have topics for this subject
    const topics = await Topic.find({ subject }).distinct('gradeLevel');
    
    const gradeLevels = topics.sort((a, b) => a - b).map(grade => ({
      value: grade,
      label: grade === 0 ? 'Kindergarten' : `Grade ${grade}`
    }));

    res.json({ gradeLevels });
  } catch (error) {
    console.error('Error getting grade levels:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate adaptive quiz based on user's current level and weaknesses
exports.generateAdaptiveQuiz = async (req, res) => {
  try {
    const { subject, gradeLevel, quizType = 'practice', questionCount = 10 } = req.body;
    const userId = req.user.id;

    // Get user progress
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      return res.status(404).json({ 
        message: 'Please select a grade level first' 
      });
    }

    // Get the subject progress
    const subjectProgress = userProgress.subjectProgress.find(
      sp => sp.subject === subject
    );

    if (!subjectProgress) {
      return res.status(404).json({ 
        message: 'Please select a grade level for this subject first' 
      });
    }

    const actualGradeLevel = gradeLevel || subjectProgress.currentGradeLevel;

    // Get topics for this subject and grade level
    const topics = await Topic.find({ 
      subject, 
      gradeLevel: actualGradeLevel 
    });

    if (topics.length === 0) {
      return res.status(404).json({ 
        message: 'No topics found for this subject and grade level' 
      });
    }

    // Determine which topics to focus on based on mastery
    let topicWeights = [];

    for (const topic of topics) {
      const mastery = userProgress.topicMastery.find(
        tm => tm.topicId.toString() === topic._id.toString() && 
              tm.gradeLevel === actualGradeLevel
      );

      let weight = 1;

      if (!mastery || mastery.totalAttempts === 0) {
        // Never practiced - highest weight
        weight = 5;
      } else if (mastery.needsReview || mastery.masteryLevel < 40) {
        // Low mastery or needs review
        weight = 4;
      } else if (mastery.masteryLevel < 60) {
        // Medium-low mastery
        weight = 3;
      } else if (mastery.masteryLevel < 80) {
        // Medium mastery
        weight = 2;
      } else {
        // High mastery - still include for reinforcement
        weight = 1;
      }

      topicWeights.push({
        topicId: topic._id,
        weight,
        masteryLevel: mastery ? mastery.masteryLevel : 0
      });
    }

    // Select topics based on weights (higher weight = more questions)
    const totalWeight = topicWeights.reduce((sum, tw) => sum + tw.weight, 0);
    let selectedTopicIds = [];

    for (const topicWeight of topicWeights) {
      const questionsForTopic = Math.max(
        1, 
        Math.round((topicWeight.weight / totalWeight) * questionCount)
      );
      
      for (let i = 0; i < questionsForTopic; i++) {
        selectedTopicIds.push(topicWeight.topicId);
      }
    }

    // Trim to requested question count
    selectedTopicIds = selectedTopicIds.slice(0, questionCount);

    // Fetch questions for selected topics
    const questions = await Question.aggregate([
      {
        $match: {
          topicId: { $in: selectedTopicIds },
          gradeLevel: actualGradeLevel
        }
      },
      { $sample: { size: questionCount } }
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ 
        message: 'No questions available for this quiz' 
      });
    }

    // Populate topic names
    await Question.populate(questions, { path: 'topicId', select: 'name' });

    // Remove correct answers from response (will be checked on submission)
    const quizQuestions = questions.map(q => ({
      _id: q._id,
      topicId: q.topicId,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      gradeLevel: q.gradeLevel
    }));

    res.json({
      quizType,
      subject,
      gradeLevel: actualGradeLevel,
      questions: quizQuestions,
      totalQuestions: quizQuestions.length,
      metadata: {
        focusAreas: topicWeights
          .filter(tw => tw.weight >= 3)
          .map(tw => topics.find(t => t._id.toString() === tw.topicId.toString()).name)
      }
    });
  } catch (error) {
    console.error('Error generating adaptive quiz:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit quiz and update progress
exports.submitQuiz = async (req, res) => {
  try {
    const { subject, gradeLevel, quizType, answers, timeSpent } = req.body;
    const userId = req.user.id;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        message: 'Answers array is required' 
      });
    }

    // Get user progress
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      return res.status(404).json({ 
        message: 'User progress not found' 
      });
    }

    // Fetch the questions and check answers
    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ 
      _id: { $in: questionIds } 
    }).populate('topicId');

    let correctCount = 0;
    const topicResults = {};

    const detailedResults = answers.map(answer => {
      const question = questions.find(
        q => q._id.toString() === answer.questionId
      );

      if (!question) {
        return { 
          questionId: answer.questionId, 
          correct: false, 
          error: 'Question not found' 
        };
      }

      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      
      if (isCorrect) correctCount++;

      // Update topic mastery
      userProgress.updateTopicMastery(
        subject,
        gradeLevel,
        question.topicId._id,
        isCorrect
      );

      // Track topic results for quiz history
      const topicId = question.topicId._id.toString();
      if (!topicResults[topicId]) {
        topicResults[topicId] = { correct: 0, total: 0 };
      }
      topicResults[topicId].total += 1;
      if (isCorrect) topicResults[topicId].correct += 1;

      return {
        questionId: answer.questionId,
        question: question.question,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        correct: isCorrect,
        topic: question.topicId.name,
        explanation: question.explanation
      };
    });

    const score = Math.round((correctCount / answers.length) * 100);

    // Add to quiz history
    const topicsAssessed = Object.keys(topicResults).map(topicId => ({
      topicId,
      correct: topicResults[topicId].correct,
      total: topicResults[topicId].total
    }));

    userProgress.quizHistory.push({
      quizType: quizType || 'practice',
      subject,
      gradeLevel,
      score,
      questionsAnswered: answers.length,
      topicsAssessed,
      completedAt: new Date(),
      timeSpent: timeSpent || 0
    });

    // Update overall stats
    userProgress.updateStats(answers.length, correctCount);

    // Calculate and update subject mastery
    const subjectProgress = userProgress.subjectProgress.find(
      sp => sp.subject === subject
    );
    
    if (subjectProgress) {
      subjectProgress.overallMastery = userProgress.calculateSubjectMastery(
        subject, 
        gradeLevel
      );

      // Check if ready for grade promotion
      if (userProgress.checkPromotionReadiness(subject)) {
        subjectProgress.readyForPromotion = true;
        
        // Add achievement
        userProgress.achievements.push({
          type: 'promotion',
          subject,
          description: `Ready to advance to Grade ${gradeLevel + 1} in ${subject}!`,
          earnedAt: new Date()
        });
      }

      // Set next assessment date (every 2 weeks)
      if (quizType === 'assessment') {
        subjectProgress.assessmentsDue = new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000
        );
      }
    }

    // Regenerate learning path based on new mastery levels
    await userProgress.generateLearningPath(subject, gradeLevel);

    await userProgress.save();

    res.json({
      score,
      correctCount,
      totalQuestions: answers.length,
      detailedResults,
      subjectMastery: subjectProgress ? subjectProgress.overallMastery : 0,
      readyForPromotion: subjectProgress ? subjectProgress.readyForPromotion : false,
      achievements: userProgress.achievements.slice(-3), // Last 3 achievements
      updatedLearningPath: userProgress.learningPath.filter(
        lp => lp.subject === subject && lp.gradeLevel === gradeLevel && lp.recommended
      ).slice(0, 5)
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's progress dashboard
exports.getProgressDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subject } = req.query;

    let userProgress = await UserProgress.findOne({ userId })
      .populate('learningPath.topicId', 'name description');

    if (!userProgress) {
      return res.json({
        subjectProgress: [],
        learningPath: [],
        recentQuizzes: [],
        stats: {
          totalQuizzesTaken: 0,
          totalQuestionsAnswered: 0,
          totalCorrectAnswers: 0,
          currentStreak: 0,
          longestStreak: 0
        },
        achievements: []
      });
    }

    // Filter data by subject if specified
    let learningPath = userProgress.learningPath;
    let recentQuizzes = userProgress.quizHistory;

    if (subject) {
      learningPath = learningPath.filter(lp => lp.subject === subject);
      recentQuizzes = recentQuizzes.filter(qh => qh.subject === subject);
    }

    // Get only recommended learning path items (sorted by priority)
    const recommendedPath = learningPath
      .filter(lp => lp.recommended && !lp.completed)
      .slice(0, 10);

    // Get recent quiz history (last 10)
    const recentQuizHistory = recentQuizzes
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, 10);

    res.json({
      subjectProgress: userProgress.subjectProgress,
      learningPath: recommendedPath,
      recentQuizzes: recentQuizHistory,
      stats: userProgress.stats,
      achievements: userProgress.achievements.slice(-5)
    });
  } catch (error) {
    console.error('Error getting progress dashboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Promote user to next grade level
exports.promoteGradeLevel = async (req, res) => {
  try {
    const { subject } = req.body;
    const userId = req.user.id;

    let userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      return res.status(404).json({ 
        message: 'User progress not found' 
      });
    }

    const subjectProgress = userProgress.subjectProgress.find(
      sp => sp.subject === subject
    );

    if (!subjectProgress) {
      return res.status(404).json({ 
        message: 'Subject not found in user progress' 
      });
    }

    if (!subjectProgress.readyForPromotion) {
      return res.status(400).json({ 
        message: 'Not ready for promotion yet. Complete more topics with high mastery.',
        currentMastery: subjectProgress.overallMastery
      });
    }

    if (subjectProgress.currentGradeLevel >= 12) {
      return res.status(400).json({ 
        message: 'Already at highest grade level' 
      });
    }

    // Promote to next grade level
    subjectProgress.currentGradeLevel += 1;
    subjectProgress.selectedGradeLevel = subjectProgress.currentGradeLevel;
    subjectProgress.readyForPromotion = false;
    subjectProgress.overallMastery = 0; // Reset for new grade level

    // Generate new learning path for the new grade level
    await userProgress.generateLearningPath(
      subject, 
      subjectProgress.currentGradeLevel
    );

    await userProgress.save();

    res.json({
      message: `Promoted to Grade ${subjectProgress.currentGradeLevel} in ${subject}!`,
      newGradeLevel: subjectProgress.currentGradeLevel,
      subjectProgress,
      learningPath: userProgress.learningPath.filter(
        lp => lp.subject === subject && 
             lp.gradeLevel === subjectProgress.currentGradeLevel
      )
    });
  } catch (error) {
    console.error('Error promoting grade level:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get topic mastery details
exports.getTopicMastery = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subject, gradeLevel } = req.query;

    const userProgress = await UserProgress.findOne({ userId })
      .populate('topicMastery.topicId', 'name description');

    if (!userProgress) {
      return res.json({ topicMastery: [] });
    }

    let topicMastery = userProgress.topicMastery;

    if (subject) {
      topicMastery = topicMastery.filter(tm => tm.subject === subject);
    }

    if (gradeLevel !== undefined) {
      topicMastery = topicMastery.filter(
        tm => tm.gradeLevel === parseInt(gradeLevel)
      );
    }

    res.json({ topicMastery });
  } catch (error) {
    console.error('Error getting topic mastery:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = exports;
