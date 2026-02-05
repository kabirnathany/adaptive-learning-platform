// server/src/routes/quiz.js
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect } = require('../middleware/auth'); // Assuming you have auth middleware

// All routes require authentication
router.use(protect);

// Grade level selection
router.post('/select-grade', quizController.selectGradeLevel);
router.get('/grade-levels/:subject', quizController.getAvailableGradeLevels);

// Adaptive quiz generation and submission
router.post('/generate', quizController.generateAdaptiveQuiz);
router.post('/submit', quizController.submitQuiz);

// Progress tracking
router.get('/progress', quizController.getProgressDashboard);
router.get('/topic-mastery', quizController.getTopicMastery);

// Grade promotion
router.post('/promote', quizController.promoteGradeLevel);

module.exports = router;
