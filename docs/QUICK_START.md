# 🚀 QUICK START GUIDE - Adaptive Learning Platform Enhancement

## 📦 What's Included

This package contains reference files to extend the learning platform with grade-level selection, personalized learning paths, and progress tracking. The files in the project root `/files` folder can be used as reference.

---

## 📋 File List

### Backend Reference (in `/files`)
- **UserProgress.js** – Model for detailed progress tracking
- **quizController.js** – Controller for adaptive quiz and progress
- **quiz-routes.js** – Routes for grade selection, quiz generate/submit, progress
- **seedDatabase.js** – Multi-grade seed data (different schema; see IMPLEMENTATION_GUIDE)
- **app-config-updates.js** – Reference for app configuration

### Frontend (integrated into project)
- **GradeLevelSelector.jsx** – `client/src/components/GradeLevelSelector.jsx`
- **ProgressDashboard.jsx** – `client/src/components/ProgressDashboard.jsx`
- **SubjectSelection.jsx** – `client/src/pages/SubjectSelection.jsx`

### Documentation
- **IMPLEMENTATION_GUIDE.md** – Full implementation guide
- **QUICK_START.md** – This file

---

## ⚡ Current Project Setup

### Backend
```bash
cd server
npm run seed      # Standard seed (subjects, topics, sample questions)
npm run seed:extended  # Optional: extended seed with more questions (if added)
npm run dev
```

### Frontend
```bash
cd client
npm run dev
```

### Routes
- `/` – Landing
- `/signup`, `/login` – Auth
- `/choose-subject` – Pick subject for initial quiz
- `/dashboard` – Progress and recommendations
- `/subjects` – Subject selection (enhanced UI)
- `/quiz/initial/:subjectId` – Initial placement quiz
- `/quiz/adaptive/:subjectId` – Adaptive quiz
- `/progress-dashboard` – Full progress dashboard (if using ProgressDashboard component)

---

## 🎯 What Each File Does

See **IMPLEMENTATION_GUIDE.md** for detailed descriptions of the reference backend (UserProgress, quizController, quiz-routes) and how to integrate the full adaptive flow with grade selection and promotion.

---

Happy coding! 🎉
