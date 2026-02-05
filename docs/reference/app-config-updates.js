// server/src/app.js - UPDATES NEEDED
// Add this to your existing app.js file

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ... existing middleware ...

// Import your route files
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz'); // Make sure this is updated with new routes

// ... other imports ...

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes); // This should include all the new quiz routes

// ... rest of your app configuration ...

module.exports = app;
