// client/src/components/AdaptiveQuiz.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdaptiveQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { subject, gradeLevel, quizType = 'practice' } = location.state || {};
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!subject || gradeLevel === undefined) {
      navigate('/dashboard');
      return;
    }
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    try {
      setLoading(true);
      setStartTime(Date.now());
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || ''}/api/quiz/generate`,
        { subject, gradeLevel, quizType, questionCount: 10 },
        { withCredentials: true }
      );
      
      setQuiz(response.data);
      setAnswers(new Array(response.data.questions.length).fill(null));
      setLoading(false);
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError(err.response?.data?.message || 'Failed to generate quiz');
      setLoading(false);
    }
  };

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      alert('Please select an answer before continuing');
      return;
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionId: quiz.questions[currentQuestionIndex]._id,
      selectedAnswer
    };
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]?.selectedAnswer || null);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      setSubmitting(true);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || ''}/api/quiz/submit`,
        {
          subject,
          gradeLevel,
          quizType,
          answers: finalAnswers,
          timeSpent
        },
        { withCredentials: true }
      );

      setResults(response.data);
      setSubmitting(false);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError(err.response?.data?.message || 'Failed to submit quiz');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your personalized quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (results) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {results.score >= 80 ? '🎉' : results.score >= 60 ? '👍' : '💪'}
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
            <p className="text-gray-600">
              {subject} - Grade {gradeLevel} - {quizType}
            </p>
          </div>

          {/* Score Display */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white mb-8">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{results.score}%</div>
              <div className="text-xl">
                {results.correctCount} out of {results.totalQuestions} correct
              </div>
            </div>
          </div>

          {/* Mastery Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Subject Mastery</span>
              <span className="text-gray-600">{results.subjectMastery}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${results.subjectMastery}%` }}
              ></div>
            </div>
          </div>

          {/* Promotion Status */}
          {results.readyForPromotion && (
            <div className="mb-8 p-6 bg-green-50 border-2 border-green-400 rounded-lg">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold text-green-800">Ready for Promotion!</h3>
                  <p className="text-green-700">
                    You've mastered enough topics to advance to the next grade level!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Updated Learning Path */}
          {results.updatedLearningPath && results.updatedLearningPath.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Next Steps</h3>
              <div className="space-y-2">
                {results.updatedLearningPath.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-800">{item.topicId?.name || 'Topic'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Achievements */}
          {results.achievements && results.achievements.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Achievements Earned</h3>
              <div className="space-y-2">
                {results.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-yellow-50 border border-yellow-300 rounded-lg"
                  >
                    <span className="text-3xl mr-3">🏆</span>
                    <div>
                      <div className="font-semibold text-gray-800">{achievement.description}</div>
                      <div className="text-sm text-gray-600">{achievement.subject}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Results */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Question Breakdown</h3>
            <div className="space-y-4">
              {results.detailedResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    result.correct
                      ? 'border-green-300 bg-green-50'
                      : 'border-red-300 bg-red-50'
                  }`}
                >
                  <div className="flex items-start mb-2">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                      result.correct ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {result.correct ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 mb-1">
                        {result.question}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Topic: {result.topic}
                      </div>
                      {!result.correct && (
                        <div className="text-sm">
                          <div className="text-red-700">
                            Your answer: {result.selectedAnswer}
                          </div>
                          <div className="text-green-700">
                            Correct answer: {result.correctAnswer}
                          </div>
                        </div>
                      )}
                      {result.explanation && (
                        <div className="mt-2 text-sm text-gray-700 bg-white p-3 rounded border">
                          <span className="font-semibold">Explanation: </span>
                          {result.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Quiz Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{subject} Quiz</h2>
              <p className="text-gray-600">
                Grade {gradeLevel} - {quizType}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Question</div>
              <div className="text-2xl font-bold text-blue-600">
                {currentQuestionIndex + 1} / {quiz.questions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Focus Areas Info */}
          {quiz.metadata?.focusAreas && quiz.metadata.focusAreas.length > 0 && currentQuestionIndex === 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-semibold text-blue-800 mb-1">
                📚 This quiz focuses on:
              </div>
              <div className="text-sm text-blue-700">
                {quiz.metadata.focusAreas.join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="mb-2 text-sm text-gray-600">
            Topic: {currentQuestion.topicId?.name || 'Unknown'}
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === option
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswer === option
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-400'
                    }`}
                  >
                    {selectedAnswer === option && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {currentQuestionIndex > 0 && (
            <button
              onClick={handlePreviousQuestion}
              disabled={submitting}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              ← Previous
            </button>
          )}
          <button
            onClick={handleNextQuestion}
            disabled={submitting || selectedAnswer === null}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </span>
            ) : currentQuestionIndex === quiz.questions.length - 1 ? (
              'Submit Quiz'
            ) : (
              'Next →'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveQuiz;
