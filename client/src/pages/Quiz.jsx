import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, post } from '../api';

export default function Quiz() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    get(`/api/quiz/initial/${subjectId}`)
      .then((data) => {
        setQuiz(data);
        setStartTime(Date.now());
      })
      .catch(() => setQuiz(null))
      .finally(() => setLoading(false));
  }, [subjectId]);

  if (loading || !quiz) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 flex justify-center">
        {loading ? (
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-500 border-t-transparent" />
        ) : (
          <p className="text-slate-500">Could not load quiz.</p>
        )}
      </div>
    );
  }

  const questions = quiz.questions || [];
  const current = questions[index];
  const isLast = index === questions.length - 1;

  function recordAnswer(selectedIndex) {
    const timeSpentMs = startTime ? Date.now() - startTime : 0;
    setAnswers((prev) => [
      ...prev,
      { questionId: current.id, selectedIndex, timeSpentMs },
    ]);
    setStartTime(Date.now());
    if (isLast) {
      submitQuiz([
        ...answers,
        { questionId: current.id, selectedIndex, timeSpentMs },
      ]);
    } else {
      setIndex((i) => i + 1);
    }
  }

  async function submitQuiz(finalAnswers) {
    setSubmitting(true);
    try {
      await post('/api/quiz/submit', {
        subjectId: quiz.subjectId,
        type: 'initial',
        answers: finalAnswers,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      alert(err.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-slate-500">No questions available for this subject. Add questions in Admin.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-brand-600 hover:underline"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between text-sm text-slate-500 mb-4">
        <span>{quiz.subjectName} – Initial quiz</span>
        <span>
          Question {index + 1} of {questions.length}
        </span>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <p className="font-medium text-lg mb-6">{current.text}</p>
        <div className="space-y-3">
          {current.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => recordAnswer(i)}
              disabled={submitting}
              className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:border-brand-400 hover:bg-brand-50 disabled:opacity-50"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      {submitting && (
        <p className="mt-4 text-slate-500 text-sm">Submitting…</p>
      )}
    </div>
  );
}
