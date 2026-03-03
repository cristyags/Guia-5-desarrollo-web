import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import { getDueDateLabel, isOverdue } from '../../utils/dateHelpers';
import { deleteTask, updateTask } from '../../services/taskService';

export default function TaskCard({ task }) {
  const category = CATEGORIES.find((c) => c.id === task.category) || CATEGORIES.at(-1);
  const priority = PRIORITIES.find((p) => p.id === task.priority) || PRIORITIES[1];

  const overdue = isOverdue(task.dueDate, task.completed);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await updateTask(task.id, { completed: !task.completed });
    if (result.success) {
      toast.success(task.completed ? 'Marcada como pendiente' : 'Marcada como completada');
    } else {
      toast.error('Error al actualizar');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;

    const result = await deleteTask(task.id);
    if (result.success) toast.success('Tarea eliminada');
    else toast.error('Error al eliminar');
  };

  return (
    <Link
      to={`/tasks/${task.id}`}
      className={`card hover:shadow-lg transition-shadow border ${
        overdue ? 'border-red-300 dark:border-red-700' : 'border-transparent'
      } ${task.completed ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {task.title}
          </h3>

          {task.description ? (
            <p className="text-sm text-gray-600 dark:text-slate-300 mt-1 max-h-10 overflow-hidden">
              {task.description}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${category.badge}`}>
              {category.label}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${priority.badge}`}>
              {priority.label}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.completed
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-100'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-100'
              }`}
            >
              {task.completed ? 'Completada' : 'Pendiente'}
            </span>

            {task.dueDate ? (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  overdue
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100'
                }`}
              >
                Vence: {getDueDateLabel(task.dueDate)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={handleToggle} className="btn-secondary text-sm py-2 px-3">
            {task.completed ? 'Pendiente' : 'Completar'}
          </button>
          <button onClick={handleDelete} className="btn-danger text-sm py-2 px-3">
            Eliminar
          </button>
        </div>
      </div>
    </Link>
  );
}
