import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <h1 className="font-display text-2xl font-semibold mb-6">Your learning dashboard</h1>

      <section className="mb-8">
        <h2 className="font-display font-semibold text-lg mb-3">Choose a subject to start or continue</h2>
        <div className="flex flex-wrap gap-3">
          {bySubject.length > 0 ? (
            bySubject.map((s) => (
              <Link
                key={s.subjectId}
                to={`/quiz/initial/${s.subjectId}`}
                className="px-4 py-2 bg-brand-100 text-brand-700 rounded-lg hover:bg-brand-200"
              >
                {s.subjectName} – Start initial quiz
              </Link>
            ))
          ) : (
            <Link
              to="/choose-subject"
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
            >
              Choose subject for initial quiz
            </Link>
          )}
        </div>
        <p className="mt-2 text-slate-600 text-sm">
          Or take an <strong>adaptive quiz</strong> to focus on weak areas:{' '}
          {bySubject.map((s) => (
            <Link
              key={s.subjectId}
              to={`/quiz/adaptive/${s.subjectId}`}
              className="text-brand-600 hover:underline mr-2"
            >
              {s.subjectName}
            </Link>
          ))}
        </p>
      </section>

      {recommendedTopics.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display font-semibold text-lg mb-3">Recommended topics to work on</h2>
          <ul className="space-y-2">
            {recommendedTopics.map((t) => (
              <li key={t.topicId}>
                <Link
                  to={`/materials/${t.topicId}`}
                  className="text-brand-600 hover:underline"
                >
                  {t.topicName} (score: {t.score}%)
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {bySubject.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display font-semibold text-lg mb-3">Progress by subject</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {bySubject.map((s) => (
              <div
                key={s.subjectId}
                className="p-4 bg-white border border-slate-200 rounded-xl"
              >
                <h3 className="font-medium">{s.subjectName}</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Mastered: {s.mastered} · Weak: {s.weak} · Total topics: {s.total}
                </p>
                <Link
                  to={`/quiz/adaptive/${s.subjectId}`}
                  className="text-brand-600 text-sm hover:underline mt-2 inline-block"
                >
                  Take adaptive quiz
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display font-semibold text-lg mb-3">Recent quizzes</h2>
        {recentQuizzes.length === 0 ? (
          <p className="text-slate-500">No quizzes yet. Start by choosing a subject above.</p>
        ) : (
          <ul className="space-y-2">
            {recentQuizzes.map((q) => (
              <li key={q.id} className="flex items-center justify-between py-2 border-b border-slate-100">
                <span>
                  {q.subjectName} – {q.type} quiz
                </span>
                <span className="text-slate-600">
                  {q.scorePercent}% · {new Date(q.completedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
