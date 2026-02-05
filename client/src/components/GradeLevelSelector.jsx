// Adapted from files/GradeLevelSelector.jsx – uses project api and navigation (no select-grade endpoint).
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GRADE_LEVELS = [
  { value: 'K', label: 'Kindergarten' },
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
  { value: '6', label: 'Grade 6' },
  { value: '7', label: 'Grade 7' },
  { value: '8', label: 'Grade 8' },
  { value: '9', label: 'Grade 9' },
  { value: '10', label: 'Grade 10' },
  { value: '11', label: 'Grade 11' },
  { value: '12', label: 'Grade 12' },
];

export default function GradeLevelSelector({ subject, subjectId, onGradeSelected }) {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const navigate = useNavigate();

  const handleSelectGrade = (gradeLevel) => {
    setSelectedGrade(gradeLevel);
    if (onGradeSelected) onGradeSelected(gradeLevel);
  };

  const handleGoToDashboard = () => navigate('/dashboard');
  const handleStartQuiz = () => {
    if (subjectId) navigate(`/quiz/initial/${subjectId}`);
    else navigate('/choose-subject');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">
          Select your {subject} level
        </h2>
        <p className="text-slate-600 mb-6">
          Choose the grade level that matches your current skill level. You can take the initial quiz to see your level.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {GRADE_LEVELS.map((grade) => (
            <button
              key={grade.value}
              type="button"
              onClick={() => handleSelectGrade(grade.value)}
              className={`p-4 rounded-lg border-2 transition-all font-medium text-center ${
                selectedGrade === grade.value
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
              }`}
            >
              {grade.label}
            </button>
          ))}
        </div>

        {selectedGrade !== null && (
          <div className="mt-6 p-4 bg-brand-50 border border-brand-200 rounded-lg">
            <p className="font-medium text-brand-800 mb-3">Grade level selected. Next:</p>
            <div className="flex gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleStartQuiz}
                className="bg-brand-600 text-white py-2 px-4 rounded-lg hover:bg-brand-700"
              >
                Take initial quiz
              </button>
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="bg-slate-200 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-300"
              >
                Go to dashboard
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
          <strong>Tip:</strong> Start with your current grade. The initial quiz will help tailor your learning path.
        </div>
      </div>
    </div>
  );
}
