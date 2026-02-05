import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { get } from '../api';

export default function Materials() {
  const { topicId } = useParams();
  const [data, setData] = useState({ topicName: '', topicDescription: '', materials: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get(`/api/subjects/topics/${topicId}/materials`)
      .then((res) => setData({
        topicName: res.topicName ?? 'Learning materials',
        topicDescription: res.topicDescription ?? '',
        materials: res.materials ?? [],
      }))
      .catch(() => setData({ topicName: '', topicDescription: '', materials: [] }))
      .finally(() => setLoading(false));
  }, [topicId]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const { topicName, topicDescription, materials } = data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        to="/dashboard"
        className="mb-6 inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        ← Back to dashboard
      </Link>

      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-800 sm:text-3xl">
          {topicName || 'Learning materials'}
        </h1>
        {topicDescription && (
          <p className="mt-2 text-slate-600">{topicDescription}</p>
        )}
      </header>

      {materials.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          No materials for this topic yet.
        </div>
      ) : (
        <ul className="space-y-6">
          {materials.map((m) => (
            <li
              key={m._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="font-display text-lg font-semibold text-slate-800">
                {m.title}
              </h2>
              {m.type && (
                <span className="mt-1 inline-block text-xs font-medium uppercase tracking-wide text-slate-400">
                  {m.type}
                </span>
              )}
              {m.content && (
                <div className="prose prose-slate mt-4 max-w-none text-slate-700">
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                </div>
              )}
              {m.url && (
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center rounded-lg bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-200"
                >
                  Open link →
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
