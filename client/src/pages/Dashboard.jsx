import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { get } from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const stateMessage = location.state?.message;

  useEffect(() => {
    get('/api/progress/dashboard')
      .then(setData)
      .catch(() => setData({ recentQuizzes: [], bySubject: [], recommendedTopics: [] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const { recentQuizzes = [], bySubject = [], recommendedTopics = [] } = data || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {stateMessage && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          {stateMessage}
        </div>
      )}
      <h1 className="font-display text-3xl font-bold text-slate-800 mb-2">Your learning dashboard</h1>
      <p className="text-slate-600 mb-8">Track progress and choose what to study next.</p>

      <section className="mb-10">
        <h2 className="font-display font-semibold text-lg text-slate-800 mb-4">Subjects</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bySubject.length > 0 ? (
            bySubject.map((s) => (
              <div
                key={s.subjectId}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-brand-200"
              >
                <h3 className="font-display font-semibold text-slate-800 mb-2">{s.subjectName}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {!s.initialQuizCompleted ? (
                    <Link
                      to={`/quiz/initial/${s.subjectId}`}
                      className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                    >
                      Start initial quiz
                    </Link>
                  ) : (
                    <Link
                      to={`/quiz/adaptive/${s.subjectId}`}
                      className="inline-flex items-center rounded-lg bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-200"
                    >
                      Take adaptive quiz
                    </Link>
                  )}
                </div>
                <p className="text-slate-500 text-sm">
                  Mastered: {s.mastered} · Need practice: {s.weak} · Topics: {s.total}
                </p>
              </div>
            ))
          ) : (
            <Link
              to="/choose-subject"
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-brand-400 hover:bg-brand-50"
            >
              <span className="font-display font-semibold text-slate-700">Choose a subject</span>
              <span className="mt-1 text-sm text-slate-500">Start with an initial quiz</span>
            </Link>
          )}
        </div>
      </section>

      {recommendedTopics.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display font-semibold text-lg text-slate-800 mb-4">Recommended topics</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {recommendedTopics.map((t) => (
              <Link
                key={t.topicId}
                to={`/materials/${t.topicId}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-brand-300 hover:shadow"
              >
                <span className="font-medium text-slate-800">{t.topicName}</span>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-medium text-amber-800">
                  {t.score}%
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display font-semibold text-lg text-slate-800 mb-4">Recent quizzes</h2>
        {recentQuizzes.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-slate-500">
            No quizzes yet. Start by taking an initial quiz for a subject above.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {recentQuizzes.map((q) => (
                <li key={q.id} className="flex items-center justify-between px-4 py-3">
                  <span className="font-medium text-slate-800">
                    {q.subjectName} · {q.type}
                  </span>
                  <span className="text-slate-500">
                    {q.scorePercent}% · {new Date(q.completedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
