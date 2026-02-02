import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-display font-semibold text-xl text-brand-600">
            Adaptive Learning
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-brand-600">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-slate-600 hover:text-brand-600">
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="text-slate-600 hover:text-red-600"
                >
                  Log out
                </button>
                <span className="text-slate-500 text-sm">{user.name}</span>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-brand-600">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
        Adaptive Learning Platform — Math, English, Science K-12
      </footer>
    </div>
  );
}
