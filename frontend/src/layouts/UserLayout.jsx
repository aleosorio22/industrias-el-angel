import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-cream-dark">
      <nav className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-display text-text font-semibold">
                Panel de Usuario
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark hover:bg-accent/50 rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}