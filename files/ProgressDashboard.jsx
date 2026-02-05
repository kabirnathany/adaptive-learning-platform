// client/src/components/ProgressDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProgressDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, [selectedSubject]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const params = selectedSubject ? { subject: selectedSubject } : {};
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || ''}/api/quiz/progress`,
        { params, withCredentials: true }
      );
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handlePromote = async (subject) => {
    if (!window.confirm(`Are you ready to advance to the next grade level in ${subject}?`)) {
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || ''}/api/quiz/promote`,
        { subject },
        { withCredentials: true }
      );

      alert(response.data.message);
      fetchDashboard(); // Refresh dashboard
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to promote grade level');
    }
  };

  const startQuiz = (subject, gradeLevel) => {
    navigate('/quiz', { state: { subject, gradeLevel, quizType: 'practice' } });
  };

  const startAssessment = (subject, gradeLevel) => {
    navigate('/quiz', { state: { subject, gradeLevel, quizType: 'assessment' } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const { subjectProgress, learningPath, recentQuizzes, stats, achievements } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Learning Dashboard</h1>
        <p className="text-gray-600">Track your progress and continue your personalized learning journey</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Quizzes</div>
          <div className="text-3xl font-bold text-blue-600">{stats.totalQuizzesTaken}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Questions Answered</div>
          <div className="text-3xl font-bold text-green-600">{stats.totalQuestionsAnswered}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Accuracy</div>
          <div className="text-3xl font-bold text-purple-600">
            {stats.totalQuestionsAnswered > 0
              ? Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100)
              : 0}%
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Current Streak</div>
          <div className="text-3xl font-bold text-orange-600">
            🔥 {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>

      {/* Subject Filter */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setSelectedSubject(null)}
          className={`px-4 py-2 rounded-lg ${
            !selectedSubject
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Subjects
        </button>
        {['Math', 'English', 'Science'].map((subject) => (
          <button
            key={subject}
            onClick={() => setSelectedSubject(subject)}
            className={`px-4 py-2 rounded-lg ${
              selectedSubject === subject
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Subject Progress Cards */}
      {subjectProgress.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Subject Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjectProgress
              .filter(sp => !selectedSubject || sp.subject === selectedSubject)
              .map((sp) => (
                <div key={sp.subject} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{sp.subject}</h3>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-1">Current Level</div>
                    <div className="text-2xl font-semibold text-blue-600">
                      {sp.currentGradeLevel === 0 ? 'Kindergarten' : `Grade ${sp.currentGradeLevel}`}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Overall Mastery</span>
                      <span>{sp.overallMastery}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${sp.overallMastery}%` }}
                      ></div>
                    </div>
                  </div>

                  {sp.readyForPromotion && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-400 rounded-lg">
                      <div className="flex items-center text-green-700 text-sm font-semibold mb-2">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Ready for Promotion!
                      </div>
                      <button
                        onClick={() => handlePromote(sp.subject)}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                      >
                        Advance to Grade {sp.currentGradeLevel + 1}
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => startQuiz(sp.subject, sp.currentGradeLevel)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                    >
                      Practice
                    </button>
                    <button
                      onClick={() => startAssessment(sp.subject, sp.currentGradeLevel)}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
                    >
                      Assessment
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Learning Path */}
      {learningPath.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommended Learning Path</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-3">
              {learningPath.slice(0, 5).map((item, index) => (
                <div
                  key={item._id}
                  className={`flex items-center p-4 rounded-lg border-2 ${
                    item.priority === 'high'
                      ? 'border-red-300 bg-red-50'
                      : item.priority === 'medium'
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-blue-300 bg-blue-50'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      {item.topicId?.name || 'Unknown Topic'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.subject} - Grade {item.gradeLevel}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.priority === 'high'
                          ? 'bg-red-200 text-red-800'
                          : item.priority === 'medium'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-blue-200 text-blue-800'
                      }`}
                    >
                      {item.priority} priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Quizzes */}
      {recentQuizzes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Quizzes</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentQuizzes.slice(0, 5).map((quiz, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quiz.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quiz.gradeLevel === 0 ? 'K' : quiz.gradeLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="capitalize">{quiz.quizType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full font-semibold ${
                          quiz.score >= 80
                            ? 'bg-green-100 text-green-800'
                            : quiz.score >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {quiz.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(quiz.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg p-6 text-white">
                <div className="text-4xl mb-2">🏆</div>
                <div className="font-bold text-lg mb-1">{achievement.subject}</div>
                <div className="text-sm opacity-90">{achievement.description}</div>
                <div className="text-xs opacity-75 mt-2">
                  {new Date(achievement.earnedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {subjectProgress.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Start Your Learning Journey!
          </h3>
          <p className="text-gray-600 mb-6">
            Select a subject and grade level to begin your personalized learning path.
          </p>
          <button
            onClick={() => navigate('/subjects')}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose a Subject
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;
