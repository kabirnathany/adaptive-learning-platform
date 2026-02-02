import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { get } from '../api';

export default function Materials() {
  const { topicId } = useParams();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get(`/api/subjects/topics/${topicId}/materials`)
      .then((data) => setMaterials(data.materials || []))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  }, [topicId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/dashboard" className="text-brand-600 hover:underline text-sm mb-4 inline-block">
        ← Back to dashboard
      </Link>
      <h1 className="font-display text-xl font-semibold mb-6">Learning materials</h1>
      {materials.length === 0 ? (
        <p className="text-slate-500">No materials for this topic yet.</p>
      ) : (
        <ul className="space-y-4">
          {materials.map((m) => (
            <li key={m._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="font-medium">{m.title}</h2>
              <p className="text-slate-600 text-sm mt-1">{m.type}</p>
              {m.content && <p className="mt-2 text-slate-700">{m.content}</p>}
              {m.url && (
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 hover:underline text-sm mt-2 inline-block"
                >
                  Open link
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
