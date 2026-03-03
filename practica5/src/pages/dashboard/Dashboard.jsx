import { useMemo, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { useTasks } from '../../hooks/useTasks';

import TaskFilters from '../../components/tasks/TaskFilters';
import TaskList from '../../components/tasks/TaskList';
import TaskForm from '../../components/tasks/TaskForm';
import TaskStats from '../../components/tasks/TaskStats';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { tasks, currentFilter, currentCategory, searchQuery, loading } = useTaskStore();
  const [showForm, setShowForm] = useState(false);

  // Hook que se suscribe a las tareas en tiempo real (Firestore)
  useTasks();

  const filteredTasks = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();

    return tasks.filter((task) => {
      // filtro estado
      if (currentFilter === 'completed' && !task.completed) return false;
      if (currentFilter === 'pending' && task.completed) return false;

      // filtro categoría
      if (currentCategory !== 'all' && task.category !== currentCategory) return false;

      // búsqueda
      if (q) {
        const haystack = `${task.title || ''} ${task.description || ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [tasks, currentFilter, currentCategory, searchQuery]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Bienvenido, {user?.displayName || 'Usuario'}
          </h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">
            Tienes {tasks.filter((t) => !t.completed).length} tareas pendientes
          </p>
        </div>

        <button onClick={() => setShowForm(true)} className="btn-primary">
          Nueva tarea
        </button>
      </div>

      <TaskStats />
      <TaskFilters />
      <TaskList tasks={filteredTasks} />

      {/* Modal simple para TaskForm */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <TaskForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
