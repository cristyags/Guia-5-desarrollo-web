import { useMemo } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { isOverdue } from '../../utils/dateHelpers';

export default function TaskStats() {
  const tasks = useTaskStore((state) => state.tasks);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.completed)).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, pending, overdue, percent };
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="card p-4">
        <p className="text-sm text-gray-500 dark:text-slate-300">Total</p>
        <p className="text-2xl font-bold">{stats.total}</p>
      </div>
      <div className="card p-4">
        <p className="text-sm text-gray-500 dark:text-slate-300">Completadas</p>
        <p className="text-2xl font-bold">{stats.completed}</p>
      </div>
      <div className="card p-4">
        <p className="text-sm text-gray-500 dark:text-slate-300">Pendientes</p>
        <p className="text-2xl font-bold">{stats.pending}</p>
      </div>
      <div className="card p-4">
        <p className="text-sm text-gray-500 dark:text-slate-300">Vencidas</p>
        <p className="text-2xl font-bold">{stats.overdue}</p>
      </div>
      <div className="card p-4">
        <p className="text-sm text-gray-500 dark:text-slate-300">% completitud</p>
        <p className="text-2xl font-bold">{stats.percent}%</p>
      </div>
    </div>
  );
}
