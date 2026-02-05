import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../api';

export default function SubjectSelect() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get('/api/subjects')
      .then((data) => setSubjects(data.subjects || []))
      .catch(() => setSubjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-slate-800 sm:text-3xl">Choose a subject</h1>
      <p className="mt-2 text-slate-600">
        We'll assess your level (K–12) and build your personalized learning path.
      </p>
      <div className="mt-8 grid gap-4">
        {subjects.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 py-6 text-center text-slate-500">
            No subjects loaded. Run the server seed script or add subjects in Admin.
          </p>
        ) : (
          subjects.map((s) => (
            <Link
              key={s._id}
              to={`/quiz/initial/${s._id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-300 hover:shadow-md"
            >
              <h2 className="font-display font-semibold text-lg text-slate-800">{s.name}</h2>
              {s.description && <p className="mt-1 text-slate-600 text-sm">{s.description}</p>}
              {s.gradeLevels?.length > 0 && (
                <p className="mt-2 text-xs text-slate-500">Grades: {s.gradeLevels.join(', ')}</p>
              )}
            </Link>
          ))
        )}
      </div>
      <p className="mt-8 text-sm text-slate-500">
        <Link to="/dashboard" className="text-brand-600 hover:underline">Skip to dashboard</Link>
      </p>
    </div>
  );
}
