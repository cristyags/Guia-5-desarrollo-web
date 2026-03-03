import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useAuthStore } from '../../store/authStore';
import { createTask, updateTask } from '../../services/taskService';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';

export default function TaskForm({ onClose, taskToEdit = null }) {
  const user = useAuthStore((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultValues = useMemo(() => {
    if (!taskToEdit) {
      return {
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        dueDate: ''
      };
    }

    return {
      title: taskToEdit.title || '',
      description: taskToEdit.description || '',
      category: taskToEdit.category || 'other',
      priority: taskToEdit.priority || 'medium',
      dueDate: taskToEdit.dueDate
        ? new Date(taskToEdit.dueDate).toISOString().slice(0, 10)
        : ''
    };
  }, [taskToEdit]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    const taskData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null
    };

    const result = taskToEdit
      ? await updateTask(taskToEdit.id, taskData)
      : await createTask(user.uid, taskData);

    if (result.success) {
      toast.success(taskToEdit ? 'Tarea actualizada' : 'Tarea creada');
      onClose();
    } else {
      setError('Error al guardar la tarea');
      toast.error('Error al guardar la tarea');
    }

    setLoading(false);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          {taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-slate-300">
          Cerrar
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
            Título *
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Ej: Completar informe mensual"
            {...register('title', {
              required: 'El título es obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' }
            })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
            Descripción
          </label>
          <textarea
            className="input-field"
            rows="3"
            placeholder="Descripción detallada de la tarea..."
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
              Categoría *
            </label>
            <select className="input-field" {...register('category', { required: true })}>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
              Prioridad *
            </label>
            <select className="input-field" {...register('priority', { required: true })}>
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
              Fecha de vencimiento
            </label>
            <input type="date" className="input-field" {...register('dueDate')} />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Guardando...' : taskToEdit ? 'Actualizar' : 'Crear Tarea'}
          </button>
        </div>
      </form>
    </div>
  );
}
