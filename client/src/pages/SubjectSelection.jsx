// Adapted from files/SubjectSelection.jsx – uses project api (get('/api/subjects')) and routes.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../api';
import GradeLevelSelector from '../components/GradeLevelSelector';

const SUBJECT_CONFIG = {
  Math: { icon: '🔢', color: 'from-blue-500 to-blue-700', description: 'Numbers, algebra, geometry, and problem-solving' },
  English: { icon: '📚', color: 'from-green-500 to-green-700', description: 'Reading, writing, grammar, and literature' },
  Science: { icon: '🔬', color: 'from-purple-500 to-purple-700', description: 'Biology, chemistry, physics, and earth science' },
};

export default function SubjectSelection() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get('/api/subjects')
      .then((data) => setSubjects(data.subjects || []))
      .catch(() => setSubjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (selectedSubject) {
    const subject = subjects.find((s) => s.name === selectedSubject.name) || selectedSubject;
    return (
      <div>
        <button
          type="button"
          onClick={() => setSelectedSubject(null)}
          className="mb-4 text-brand-600 hover:underline flex items-center"
        >
          ← Back to subjects
        </button>
        <GradeLevelSelector
          subject={subject.name}
          subjectId={subject._id}
          onGradeSelected={() => {}}
        />
      </div>
    );
  }

  const list = subjects.length > 0 ? subjects : [
    { _id: 'math', name: 'Math' },
    { _id: 'english', name: 'English' },
    { _id: 'science', name: 'Science' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl font-bold text-slate-800 mb-2">Choose your subject</h1>
        <p className="text-slate-600">Select a subject to start your personalized learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {list.map((s) => {
          const config = SUBJECT_CONFIG[s.name] || { icon: '📖', color: 'from-slate-500 to-slate-700', description: '' };
          return (
            <button
              key={s._id}
              type="button"
              onClick={() => setSelectedSubject(s)}
              className="group bg-white rounded-2xl shadow-md hover:shadow-lg border border-slate-200 p-6 text-left transition-all"
            >
              <div className="text-4xl mb-3">{config.icon}</div>
              <h3 className="font-display font-semibold text-lg text-slate-800 mb-2">{s.name}</h3>
              <p className="text-slate-600 text-sm">{config.description}</p>
              <span className="inline-block mt-3 text-brand-600 font-medium group-hover:underline">
                Start learning →
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="font-display font-semibold text-slate-800 mb-2">How adaptive learning works</h3>
        <ul className="space-y-2 text-slate-600 text-sm">
          <li>✓ Choose your level and take an initial quiz</li>
          <li>✓ Get a personalized path focused on weaker topics</li>
          <li>✓ Track progress and take adaptive quizzes</li>
        </ul>
      </div>

      <p className="mt-6 text-center text-slate-500 text-sm">
        <Link to="/dashboard" className="text-brand-600 hover:underline">Go to dashboard</Link>
        {' · '}
        <Link to="/choose-subject" className="text-brand-600 hover:underline">Quick subject pick</Link>
      </p>
    </div>
  );
}
