import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
        Learn at your own pace
      </h1>
      <p className="text-xl text-slate-600 mb-8">
        Take quizzes in Math, English, and Science across every grade level. We adapt to your
        strengths and weaknesses and recommend what to study next.
      </p>
      {user ? (
        <Link
          to="/dashboard"
          className="inline-block bg-brand-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-brand-700"
        >
          Go to Dashboard
        </Link>
      ) : (
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/signup"
            className="inline-block bg-brand-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-brand-700"
          >
            Create account
          </Link>
          <Link
            to="/login"
            className="inline-block border-2 border-brand-600 text-brand-600 px-8 py-3 rounded-xl font-medium hover:bg-brand-50"
          >
            Log in
          </Link>
        </div>
      )}
      <section className="mt-24 grid md:grid-cols-3 gap-8 text-left">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-2">Choose a subject</h3>
          <p className="text-slate-600">
            Math, English, or Science — with content for every grade from K to 12.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-2">Take the initial quiz</h3>
          <p className="text-slate-600">
            We assess your level and identify weak areas to build your personalized path.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-2">Adaptive learning</h3>
          <p className="text-slate-600">
            Quizzes and materials focus on topics you need most. Track progress over time.
          </p>
        </div>
      </section>
    </div>
  );
}
