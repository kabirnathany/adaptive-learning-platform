# Reference implementation (from `files/`)

These files are **reference only**. They use CommonJS and a different schema (e.g. Topic with numeric `gradeLevel`, Question with `question`/`correctAnswer`). The main app uses ES modules and `req.userId` in auth.

- **UserProgress.js** – Alternate progress model (subjectProgress, topicMastery, learningPath). Not used in the main server; progress uses `UserMastery` + `QuizResult`.
- **quizController.js** – Controllers for select-grade, grade-levels, generate, submit, progress, promote. Adapt to ES modules and existing models if extending the API.
- **quiz-routes.js** – Route definitions for the above; uses `protect` (map to `requireAuth`) and `req.user.id` (map to `req.userId`).
- **seedDatabase.js** – Multi-grade seed data; schema differs from current Subject/Topic/Question. Use as content source for an extended seed script.
- **app-config-updates.js** – Example app mounting of quiz routes and CORS.

To integrate: convert to ES modules, align with `server/src/models` and `server/src/middleware/auth.js` (`req.userId`), then add routes in `server/src/index.js`.
