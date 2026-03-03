import TaskCard from './TaskCard';

export default function TaskList({ tasks }) {
  if (!tasks.length) {
    return (
      <div className="card">
        <p className="text-gray-600 dark:text-slate-300">
          No hay tareas con los filtros actuales.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
