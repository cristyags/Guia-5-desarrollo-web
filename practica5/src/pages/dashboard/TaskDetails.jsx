import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getTaskById, updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import { formatDateTime, getDueDateLabel, isOverdue } from '../../utils/dateHelpers';

import LoadingSpinner from '../../components/common/LoadingSpinner';
import TaskForm from '../../components/tasks/TaskForm';

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const loadTask = async () => {
    setLoading(true);
    const result = await getTaskById(taskId);

    if (result.success) {
      setTask(result.task);
    } else {
      navigate('/dashboard');
    }

    setLoading(false);
  };

  const handleToggleComplete = async () => {
    const result = await updateTask(taskId, { completed: !task.completed });

    if (result.success) {
      setTask({ ...task, completed: !task.completed });
      toast.success(task.completed ? 'Marcada como pendiente' : 'Marcada como completada');
    } else {
      toast.error('No se pudo actualizar');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;

    const result = await deleteTask(taskId);

    if (result.success) {
      toast.success('Tarea eliminada');
      navigate('/dashboard');
    } else {
      toast.error('No se pudo eliminar');
    }
  };

  if (loading) return <LoadingSpinner />;

  // Si editing es true, mostrar formulario de edición
  if (editing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <TaskForm
          taskToEdit={task}
          onClose={() => {
            setEditing(false);
            loadTask();
          }}
        />
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === task.category) || CATEGORIES.at(-1);
  const priority = PRIORITIES.find((p) => p.id === task.priority) || PRIORITIES[1];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          Volver al Dashboard
        </Link>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {task.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.badge}`}>
                {category.label}
              </span>

              <span className={`px-3 py-1 rounded-full text-sm font-medium ${priority.badge}`}>
                {priority.label}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.completed
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-100'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-100'
                }`}
              >
                {task.completed ? 'Completada' : 'Pendiente'}
              </span>

              {task.dueDate ? (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isOverdue(task.dueDate, task.completed)
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100'
                  }`}
                >
                  Vence: {getDueDateLabel(task.dueDate)}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setEditing(true)} className="btn-secondary">
              Editar
            </button>
            <button onClick={handleDelete} className="btn-danger">
              Eliminar
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-2">
            Descripción
          </h2>
          <p className="text-gray-600 dark:text-slate-300 whitespace-pre-wrap">
            {task.description || 'Sin descripción'}
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 pt-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-4">
            Información adicional
          </h2>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-300">Creada</dt>
              <dd className="text-gray-900 dark:text-white">{formatDateTime(task.createdAt)}</dd>
            </div>

            {task.dueDate ? (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-300">
                  Fecha de vencimiento
                </dt>
                <dd className="text-gray-900 dark:text-white">{formatDateTime(task.dueDate)}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 pt-6 mt-6 flex justify-end">
          <button onClick={handleToggleComplete} className="btn-primary">
            {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          </button>
        </div>
      </div>
    </div>
  );
}
