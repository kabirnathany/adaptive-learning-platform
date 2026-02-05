import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, post } from '../api';

export default function AdaptiveQuiz() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    get(`/api/quiz/adaptive/${subjectId}`)
      .then((data) => {
        setQuiz(data);
        setStartTime(Date.now());
      })
      .catch(() => setQuiz(null))
      .finally(() => setLoading(false));
  }, [subjectId]);

  if (loading || !quiz) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            <p className="text-slate-600">Loading quiz…</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-slate-600">Could not load quiz. Take an initial quiz first or try again.</p>
            <button type="button" onClick={() => navigate('/dashboard')} className="mt-4 text-brand-600 hover:underline">Back to dashboard</button>
          </div>
        )}
      </div>
    );
  }

  const questions = quiz.questions || [];
  const current = questions[index];
  const isLast = index === questions.length - 1;
  const progressPercent = questions.length ? Math.round(((index + 1) / questions.length) * 100) : 0;

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
        type: 'adaptive',
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
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <p className="text-slate-600">No questions available. Take an initial quiz first or add content in Admin.</p>
        <button type="button" onClick={() => navigate('/dashboard')} className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">Back to dashboard</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">{quiz.subjectName} · Adaptive</span>
          <span className="text-slate-500">Question {index + 1} of {questions.length}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-brand-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <p className="mb-6 text-lg font-medium leading-relaxed text-slate-800 sm:text-xl">{current.text}</p>
        <div className="space-y-3">
          {current.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => recordAnswer(i)}
              disabled={submitting}
              className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 py-3.5 px-4 text-left font-medium text-slate-800 transition hover:border-brand-400 hover:bg-brand-50 disabled:opacity-60"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      {submitting && <p className="mt-4 text-center text-slate-500">Submitting…</p>}
    </div>
  );
}
