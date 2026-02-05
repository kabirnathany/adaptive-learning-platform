// client/src/pages/SubjectSelection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GradeLevelSelector from '../components/GradeLevelSelector';

const SubjectSelection = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const navigate = useNavigate();

  const subjects = [
    {
      name: 'Math',
      icon: '🔢',
      description: 'Numbers, algebra, geometry, and problem-solving',
      color: 'from-blue-500 to-blue-700'
    },
    {
      name: 'English',
      icon: '📚',
      description: 'Reading, writing, grammar, and literature',
      color: 'from-green-500 to-green-700'
    },
    {
      name: 'Science',
      icon: '🔬',
      description: 'Biology, chemistry, physics, and earth science',
      color: 'from-purple-500 to-purple-700'
    }
  ];

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
  };

  const handleBack = () => {
    setSelectedSubject(null);
  };

  if (selectedSubject) {
    return (
      <div>
        <div className="max-w-4xl mx-auto p-6">
          <button
            onClick={handleBack}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Subjects
          </button>
        </div>
        <GradeLevelSelector subject={selectedSubject} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Choose Your Subject
        </h1>
        <p className="text-xl text-gray-600">
          Select a subject to start your personalized learning journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {subjects.map((subject) => (
          <button
            key={subject.name}
            onClick={() => handleSubjectSelect(subject.name)}
            className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="p-8 text-center relative z-10">
              <div className="text-7xl mb-4">{subject.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {subject.name}
              </h3>
              <p className="text-gray-600 mb-6">
                {subject.description}
              </p>
              <div className={`inline-flex items-center text-white bg-gradient-to-r ${subject.color} px-6 py-3 rounded-lg font-semibold group-hover:scale-110 transition-transform duration-300`}>
                Start Learning
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 text-4xl mr-4">💡</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              How Our Adaptive Learning Works
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Choose Your Level:</strong> Start at any grade level that matches your current knowledge</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Personalized Path:</strong> Get a custom learning path focused on your weak areas</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Track Progress:</strong> See your mastery level increase as you practice</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Advance When Ready:</strong> System recommends promotion when you master 80% of topics</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Regular Assessments:</strong> Periodic checks ensure you're ready for harder material</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;
