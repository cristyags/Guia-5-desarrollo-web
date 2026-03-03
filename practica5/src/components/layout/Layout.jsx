import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="py-6">
        <Outlet />
      </main>
    </div>
  );
}
