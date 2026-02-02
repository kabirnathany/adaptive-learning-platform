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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display text-2xl font-semibold mb-2">Choose a subject for your initial quiz</h1>
      <p className="text-slate-600 mb-8">
        We'll assess your level across all grade levels (K–12) in this subject and build your
        personalized learning path.
      </p>
      <div className="grid gap-4">
        {subjects.length === 0 ? (
          <p className="text-slate-500 py-4">
            No subjects loaded. Run the server seed script or add subjects in Admin.
          </p>
        ) : (
          subjects.map((s) => (
            <Link
              key={s._id}
              to={`/quiz/initial/${s._id}`}
              className="block p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-brand-400 hover:shadow-md transition"
            >
              <h2 className="font-display font-semibold text-lg">{s.name}</h2>
              {s.description && (
                <p className="text-slate-600 text-sm mt-1">{s.description}</p>
              )}
              {s.gradeLevels?.length > 0 && (
                <p className="text-slate-500 text-xs mt-2">
                  Grades: {s.gradeLevels.join(', ')}
                </p>
              )}
            </Link>
          ))
        )}
      </div>
      <p className="mt-6 text-slate-500 text-sm">
        <Link to="/dashboard" className="text-brand-600 hover:underline">
          Skip to dashboard
        </Link>
      </p>
    </div>
  );
}
