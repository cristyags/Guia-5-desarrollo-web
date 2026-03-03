import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-6">
      <div className="card max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2">404</h1>
        <p className="text-gray-600 dark:text-slate-300 mb-6">Página no encontrada</p>
        <Link to="/dashboard" className="btn-primary inline-block">
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
