// server/src/models/UserProgress.js
const mongoose = require('mongoose');

const topicMasterySchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  subject: {
    type: String,
    enum: ['Math', 'English', 'Science'],
    required: true
  },
  gradeLevel: {
    type: Number,
    min: 0,
    max: 12,
    required: true
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  masteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastPracticed: {
    type: Date,
    default: Date.now
  },
  consecutiveCorrect: {
    type: Number,
    default: 0
  },
  needsReview: {
    type: Boolean,
    default: false
  }
});

const subjectProgressSchema = new mongoose.Schema({
  subject: {
    type: String,
    enum: ['Math', 'English', 'Science'],
    required: true
  },
  currentGradeLevel: {
    type: Number,
    min: 0,
    max: 12,
    required: true
  },
  selectedGradeLevel: {
    type: Number,
    min: 0,
    max: 12,
    required: true
  },
  overallMastery: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  assessmentsDue: {
    type: Date,
    default: null
  },
  readyForPromotion: {
    type: Boolean,
    default: false
  }
});

const quizHistorySchema = new mongoose.Schema({
  quizType: {
    type: String,
    enum: ['placement', 'practice', 'assessment', 'review'],
    required: true
  },
  subject: {
    type: String,
    enum: ['Math', 'English', 'Science'],
    required: true
  },
  gradeLevel: {
    type: Number,
    min: 0,
    max: 12,
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  questionsAnswered: {
    type: Number,
    required: true
  },
  topicsAssessed: [{
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    },
    correct: Number,
    total: Number
  }],
  completedAt: {
    type: Date,
    default: Date.now
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  }
});

const learningPathItemSchema = new mongoose.Schema({
  subject: {
    type: String,
    enum: ['Math', 'English', 'Science'],
    required: true
  },
  gradeLevel: {
    type: Number,
    min: 0,
    max: 12,
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  recommended: {
    type: Boolean,
    default: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  subjectProgress: [subjectProgressSchema],
  topicMastery: [topicMasterySchema],
  quizHistory: [quizHistorySchema],
  learningPath: [learningPathItemSchema],
  achievements: [{
    type: {
      type: String,
      enum: ['streak', 'mastery', 'promotion', 'completion']
    },
    subject: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  stats: {
    totalQuizzesTaken: {
      type: Number,
      default: 0
    },
    totalQuestionsAnswered: {
      type: Number,
      default: 0
    },
    totalCorrectAnswers: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastActivityDate: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Method to initialize subject progress when user selects a grade level
userProgressSchema.methods.initializeSubject = function(subject, gradeLevel) {
  const existingSubject = this.subjectProgress.find(sp => sp.subject === subject);
  
  if (!existingSubject) {
    this.subjectProgress.push({
      subject,
      currentGradeLevel: gradeLevel,
      selectedGradeLevel: gradeLevel,
      overallMastery: 0,
      assessmentsDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      readyForPromotion: false
    });
  } else {
    existingSubject.selectedGradeLevel = gradeLevel;
    existingSubject.currentGradeLevel = gradeLevel;
  }
};

// Method to update topic mastery after quiz
userProgressSchema.methods.updateTopicMastery = function(subject, gradeLevel, topicId, isCorrect) {
  let topicMastery = this.topicMastery.find(
    tm => tm.topicId.toString() === topicId.toString() && 
          tm.subject === subject && 
          tm.gradeLevel === gradeLevel
  );

  if (!topicMastery) {
    topicMastery = {
      topicId,
      subject,
      gradeLevel,
      correctAnswers: 0,
      totalAttempts: 0,
      masteryLevel: 0,
      consecutiveCorrect: 0,
      needsReview: false,
      lastPracticed: new Date()
    };
    this.topicMastery.push(topicMastery);
    topicMastery = this.topicMastery[this.topicMastery.length - 1];
  }

  topicMastery.totalAttempts += 1;
  topicMastery.lastPracticed = new Date();

  if (isCorrect) {
    topicMastery.correctAnswers += 1;
    topicMastery.consecutiveCorrect += 1;
  } else {
    topicMastery.consecutiveCorrect = 0;
    topicMastery.needsReview = true;
  }

  // Calculate mastery level (0-100)
  const accuracy = topicMastery.correctAnswers / topicMastery.totalAttempts;
  const recencyBonus = topicMastery.consecutiveCorrect >= 3 ? 10 : 0;
  topicMastery.masteryLevel = Math.min(100, Math.round(accuracy * 90 + recencyBonus));

  // Mark as not needing review if mastery is high
  if (topicMastery.masteryLevel >= 80 && topicMastery.consecutiveCorrect >= 3) {
    topicMastery.needsReview = false;
  }
};

// Method to calculate overall subject mastery
userProgressSchema.methods.calculateSubjectMastery = function(subject, gradeLevel) {
  const relevantTopics = this.topicMastery.filter(
    tm => tm.subject === subject && tm.gradeLevel === gradeLevel
  );

  if (relevantTopics.length === 0) return 0;

  const totalMastery = relevantTopics.reduce((sum, tm) => sum + tm.masteryLevel, 0);
  return Math.round(totalMastery / relevantTopics.length);
};

// Method to check if ready for grade promotion
userProgressSchema.methods.checkPromotionReadiness = function(subject) {
  const subjectProgress = this.subjectProgress.find(sp => sp.subject === subject);
  if (!subjectProgress) return false;

  const currentGradeTopics = this.topicMastery.filter(
    tm => tm.subject === subject && tm.gradeLevel === subjectProgress.currentGradeLevel
  );

  if (currentGradeTopics.length === 0) return false;

  // Need at least 80% mastery on 80% of topics to be ready for promotion
  const masteredTopics = currentGradeTopics.filter(tm => tm.masteryLevel >= 80);
  const promotionThreshold = Math.ceil(currentGradeTopics.length * 0.8);

  return masteredTopics.length >= promotionThreshold;
};

// Method to generate personalized learning path
userProgressSchema.methods.generateLearningPath = async function(subject, gradeLevel) {
  const Topic = mongoose.model('Topic');
  
  // Get all topics for this subject and grade level
  const allTopics = await Topic.find({ 
    subject, 
    gradeLevel 
  }).sort({ order: 1 });

  // Clear existing learning path for this subject/grade
  this.learningPath = this.learningPath.filter(
    lp => !(lp.subject === subject && lp.gradeLevel === gradeLevel)
  );

  for (const topic of allTopics) {
    const mastery = this.topicMastery.find(
      tm => tm.topicId.toString() === topic._id.toString() && 
            tm.subject === subject && 
            tm.gradeLevel === gradeLevel
    );

    let priority = 'medium';
    let recommended = true;

    if (!mastery || mastery.totalAttempts === 0) {
      // Never practiced - high priority
      priority = 'high';
      recommended = true;
    } else if (mastery.needsReview || mastery.masteryLevel < 60) {
      // Needs review or low mastery - high priority
      priority = 'high';
      recommended = true;
    } else if (mastery.masteryLevel < 80) {
      // Medium mastery - medium priority
      priority = 'medium';
      recommended = true;
    } else {
      // High mastery - low priority, optional practice
      priority = 'low';
      recommended = false;
    }

    this.learningPath.push({
      subject,
      gradeLevel,
      topicId: topic._id,
      priority,
      recommended,
      completed: mastery ? mastery.masteryLevel >= 80 : false,
      assignedAt: new Date()
    });
  }

  // Sort learning path: high priority first, then by topic order
  this.learningPath.sort((a, b) => {
    if (a.subject !== subject || a.gradeLevel !== gradeLevel) return 0;
    if (b.subject !== subject || b.gradeLevel !== gradeLevel) return 0;
    
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

// Method to update stats
userProgressSchema.methods.updateStats = function(questionsAnswered, correctAnswers) {
  this.stats.totalQuestionsAnswered += questionsAnswered;
  this.stats.totalCorrectAnswers += correctAnswers;
  this.stats.totalQuizzesTaken += 1;

  // Update streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (this.stats.lastActivityDate) {
    const lastActivity = new Date(this.stats.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);
    
    const dayDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 0) {
      // Same day, don't change streak
    } else if (dayDiff === 1) {
      // Consecutive day
      this.stats.currentStreak += 1;
      if (this.stats.currentStreak > this.stats.longestStreak) {
        this.stats.longestStreak = this.stats.currentStreak;
      }
    } else {
      // Streak broken
      this.stats.currentStreak = 1;
    }
  } else {
    this.stats.currentStreak = 1;
  }

  this.stats.lastActivityDate = new Date();
};

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
