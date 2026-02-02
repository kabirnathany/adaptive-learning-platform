import { useState, useEffect } from 'react';
import { get, post } from '../api';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('stats');

  useEffect(() => {
    get('/api/admin/stats').then(setStats).catch(() => setStats({}));
    get('/api/admin/subjects').then((d) => setSubjects(d.subjects || [])).catch(() => setSubjects([]));
    get('/api/admin/users').then((d) => setUsers(d.users || [])).catch(() => setUsers([]));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold mb-6">Admin</h1>
      <div className="flex gap-2 mb-6">
        {['stats', 'users', 'subjects'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg ${tab === t ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'stats' && stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 bg-white border rounded-xl">
            <p className="text-slate-500 text-sm">Users</p>
            <p className="text-2xl font-semibold">{stats.userCount ?? 0}</p>
          </div>
          <div className="p-4 bg-white border rounded-xl">
            <p className="text-slate-500 text-sm">Quizzes taken</p>
            <p className="text-2xl font-semibold">{stats.quizCount ?? 0}</p>
          </div>
          <div className="p-4 bg-white border rounded-xl">
            <p className="text-slate-500 text-sm">Questions</p>
            <p className="text-2xl font-semibold">{stats.questionCount ?? 0}</p>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3">Email</th>
                <th className="p-3">Name</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'subjects' && (
        <div>
          <p className="text-slate-600 text-sm mb-4">
            Subjects and content are managed via the API or seed script. Run:{' '}
            <code className="bg-slate-100 px-1 rounded">npm run seed</code> in the server folder to create
            Math, English, Science with sample topics and questions.
          </p>
          <ul className="space-y-2">
            {subjects.map((s) => (
              <li key={s._id} className="flex items-center gap-2">
                <span className="font-medium">{s.name}</span>
                <span className="text-slate-500 text-sm">
                  Grades: {s.gradeLevels?.join(', ') || '—'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
