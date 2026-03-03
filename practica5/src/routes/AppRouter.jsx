import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import TaskDetails from '../pages/dashboard/TaskDetails';
import NotFound from '../pages/NotFound';

export default function AppRouter() {
  const initAuthListener = useAuthStore((state) => state.initAuthListener);
  const user = useAuthStore((state) => state.user);
  const theme = useUIStore((state) => state.theme);

  // Iniciar escucha de sesión (Firebase)
  useEffect(() => {
    initAuthListener();
  }, [initAuthListener]);

  // Aplicar clase "dark" al <html> cuando el tema sea oscuro
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rutas públicas */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Rutas protegidas (Layout + rutas anidadas) */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks/:taskId" element={<TaskDetails />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
