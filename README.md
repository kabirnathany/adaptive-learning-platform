# Adaptive Learning Platform

A web app where students sign up, choose a subject (Math, English, or Science across K–12), take an initial quiz, and get an adaptive learning path. The platform tracks strengths and weaknesses and adapts content and occasional quizzes to focus on areas needing improvement.

## Features

- **User roles**: Student (take quizzes, view progress, adaptive content) and Admin (manage questions, view progress, add learning material).
- **Subjects**: Math, English, Science with grade levels K–12.
- **Initial quiz**: Choose a subject → take a placement quiz → results drive your learning path.
- **Adaptive quizzes**: Focus on weak topics; results update mastery and recommendations.
- **Progress**: Dashboard with stats, recommended topics, and recent quizzes.
- **Learning materials**: Text, links, or video references per topic.

## Security (Production-Ready)

- **Passwords**: Hashed with bcrypt (12 rounds); never stored or logged in plain text.
- **Sessions**: JWT access token (short-lived) + refresh token in **httpOnly, SameSite, Secure** cookies so JavaScript cannot read tokens (XSS cannot steal them).
- **HTTPS**: In production set `COOKIE_SECURE=true` and serve over HTTPS only.
- **Rate limiting**: Auth endpoints limited to reduce brute-force and abuse.
- **Headers**: Helmet sets secure headers (XSS, clickjacking, etc.).
- **CORS**: Restricted to your frontend origin.
- **Validation**: All signup/login and admin inputs validated and sanitized.
- **No secrets in frontend**: Only the API URL; no API keys or passwords in client code.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose).
- **Auth**: JWT in httpOnly cookies, bcrypt for passwords.

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET (e.g. openssl rand -hex 32)
npm install
npm run seed    # Creates Math, English, Science + sample topics/questions
npm run dev     # http://localhost:5000
```

### 2. Frontend

```bash
cd client
cp .env.example .env
# Optional: set VITE_API_URL=http://localhost:5000 if not using Vite proxy
npm install
npm run dev     # http://localhost:5173
```

### 3. Create an admin user

After signing up normally, set your user to admin in MongoDB:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

Or add a one-off script in `server/src/scripts/make-admin.js` that sets `role: 'admin'` for a given email (run once, then remove or restrict).

## Deployment

- **Frontend**: Build with `npm run build` in `client`; deploy the `dist/` folder to Vercel, Netlify, or any static host. Set `VITE_API_URL` to your API URL.
- **Backend**: Deploy to Railway, Render, Heroku, or a VPS. Set `NODE_ENV=production`, `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL` (your frontend origin), `COOKIE_SECURE=true`, and optionally `TRUST_PROXY=1` if behind a reverse proxy.
- **Database**: Use MongoDB Atlas (or another hosted MongoDB) and set `MONGODB_URI` in the backend.

## Scripts

| Command        | Where   | Description              |
|----------------|---------|--------------------------|
| `npm run dev`  | server  | Start API with watch     |
| `npm run seed` | server  | Seed subjects/topics/Qs  |
| `npm run dev`  | client  | Start Vite dev server    |
| `npm run build`| client  | Production build         |

## License

MIT.
