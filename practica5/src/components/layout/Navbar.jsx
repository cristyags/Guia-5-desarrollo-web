import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      clearUser();
      toast.success('Sesión cerrada');
      navigate('/login');
    } else {
      toast.error(result.error || 'No se pudo cerrar sesión');
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-xl font-bold text-blue-600">
              Task Manager Pro
            </Link>

            <Link
              to="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-slate-200 dark:hover:text-white"
            >
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="btn-secondary py-2">
              {theme === 'dark' ? 'Tema: Oscuro' : 'Tema: Claro'}
            </button>

            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                {user?.displayName || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-300">{user?.email}</p>
            </div>

            <button onClick={handleLogout} className="btn-secondary">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
