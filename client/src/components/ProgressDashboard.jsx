// Adapted from files/ProgressDashboard.jsx – uses project api get('/api/progress/dashboard') and response shape.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../api';

export default function ProgressDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    get('/api/progress/dashboard')
      .then(setData)
      .catch((err) => {
        setError(err.message || 'Failed to load dashboard');
        setData({ bySubject: [], recommendedTopics: [], recentQuizzes: [] });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        <Link to="/dashboard" className="inline-block mt-4 text-brand-600 hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const { bySubject = [], recommendedTopics = [], recentQuizzes = [] } = data || {};
  const totalQuizzes = recentQuizzes.length;
  const totalCorrect = bySubject.reduce((acc, s) => acc + (s.mastered || 0) * 2 + (s.weak || 0), 0);
  const totalTopics = bySubject.reduce((acc, s) => acc + (s.total || 0), 0);
  const accuracy = totalTopics > 0 ? Math.round((totalCorrect / (totalTopics * 2)) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">Your learning progress</h1>
      <p className="text-slate-600 mb-6">Track progress and recommended topics</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-500">Quizzes taken</div>
          <div className="text-2xl font-bold text-brand-600">{totalQuizzes}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-500">Topics practiced</div>
          <div className="text-2xl font-bold text-slate-800">{totalTopics}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-500">Mastered</div>
          <div className="text-2xl font-bold text-green-600">
            {bySubject.reduce((acc, s) => acc + (s.mastered || 0), 0)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-500">Need practice</div>
          <div className="text-2xl font-bold text-amber-600">
            {bySubject.reduce((acc, s) => acc + (s.weak || 0), 0)}
          </div>
        </div>
      </div>

      {bySubject.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display font-semibold text-lg text-slate-800 mb-4">By subject</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {bySubject.map((s) => (
              <div key={s.subjectId} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-medium text-slate-800 mb-2">{s.subjectName}</h3>
                <div className="text-sm text-slate-600 mb-2">
                  Mastered: {s.mastered ?? 0} · Need work: {s.weak ?? 0} · Total topics: {s.total ?? 0}
                </div>
                <Link
                  to={`/quiz/adaptive/${s.subjectId}`}
                  className="text-brand-600 text-sm font-medium hover:underline"
                >
                  Take adaptive quiz →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {recommendedTopics.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display font-semibold text-lg text-slate-800 mb-4">Recommended topics</h2>
          <ul className="space-y-2">
            {recommendedTopics.map((t) => (
              <li key={t.topicId}>
                <Link to={`/materials/${t.topicId}`} className="text-brand-600 hover:underline">
                  {t.topicName} (score: {t.score}%)
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {recentQuizzes.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display font-semibold text-lg text-slate-800 mb-4">Recent quizzes</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Subject</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Type</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Score</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentQuizzes.slice(0, 10).map((q) => (
                  <tr key={q.id}>
                    <td className="px-4 py-3">{q.subjectName}</td>
                    <td className="px-4 py-3">{q.type}</td>
                    <td className="px-4 py-3 font-medium">{q.scorePercent}%</td>
                    <td className="px-4 py-3 text-slate-500">{new Date(q.completedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {bySubject.length === 0 && recentQuizzes.length === 0 && (
        <div className="bg-slate-50 rounded-xl p-8 text-center">
          <p className="text-slate-600 mb-4">No progress yet. Take an initial quiz to get started.</p>
          <Link to="/choose-subject" className="inline-block bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700">
            Choose subject
          </Link>
        </div>
      )}

      <p className="mt-6">
        <Link to="/dashboard" className="text-brand-600 hover:underline">← Back to dashboard</Link>
      </p>
    </div>
  );
}
