// client/src/components/GradeLevelSelector.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GradeLevelSelector = ({ subject, onGradeSelected }) => {
  const [gradeLevels, setGradeLevels] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGradeLevels();
  }, [subject]);

  const fetchGradeLevels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || ''}/api/quiz/grade-levels/${subject}`,
        { withCredentials: true }
      );
      setGradeLevels(response.data.gradeLevels);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching grade levels:', err);
      setError('Failed to load grade levels');
      setLoading(false);
    }
  };

  const handleSelectGrade = async (gradeLevel) => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || ''}/api/quiz/select-grade`,
        { subject, gradeLevel },
        { withCredentials: true }
      );

      setSelectedGrade(gradeLevel);
      
      if (onGradeSelected) {
        onGradeSelected(gradeLevel, response.data);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error selecting grade level:', err);
      setError(err.response?.data?.message || 'Failed to select grade level');
      setLoading(false);
    }
  };

  if (loading && gradeLevels.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Select Your {subject} Level
        </h2>
        <p className="text-gray-600 mb-8">
          Choose the grade level that matches your current skill level. You can always
          adjust this later or advance to higher levels as you master topics.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {gradeLevels.map((grade) => (
            <button
              key={grade.value}
              onClick={() => handleSelectGrade(grade.value)}
              disabled={loading}
              className={`
                p-6 rounded-lg border-2 transition-all duration-200
                ${selectedGrade === grade.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                font-semibold text-center
              `}
            >
              {grade.label}
            </button>
          ))}
        </div>

        {selectedGrade !== null && (
          <div className="mt-8 p-6 bg-green-50 border border-green-400 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-green-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-green-800">
                  Grade Level Selected!
                </h3>
                <p className="text-green-700 text-sm">
                  Your personalized learning path for {subject} has been created.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">
            💡 Tip: Not sure which level to choose?
          </h4>
          <p className="text-blue-700 text-sm">
            Start with your current school grade, or one level below if you want to
            review fundamentals. The system will adapt to your performance and recommend
            when you're ready to advance!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GradeLevelSelector;
