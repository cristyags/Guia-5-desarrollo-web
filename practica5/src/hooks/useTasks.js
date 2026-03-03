import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { subscribeToTasks } from '../services/taskService';

export const useTasks = () => {
  const user = useAuthStore((state) => state.user);
  const setTasks = useTaskStore((state) => state.setTasks);
  const setLoading = useTaskStore((state) => state.setLoading);
  const setError = useTaskStore((state) => state.setError);

  useEffect(() => {
    // Si no hay usuario, limpiar tareas y no suscribir
    if (!user?.uid) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToTasks(user.uid, (tasks) => {
      setTasks(tasks);
      setLoading(false);
      setError(null);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user?.uid, setTasks, setLoading, setError]);
};
