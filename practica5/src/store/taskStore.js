import { create } from 'zustand';

export const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

  currentFilter: 'all',
  currentCategory: 'all',
  searchQuery: '',

  setTasks: (tasks) => set({ tasks }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  setFilter: (filter) => set({ currentFilter: filter }),
  setCategory: (category) => set({ currentCategory: category }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  upsertTask: (task) =>
    set((state) => {
      const idx = state.tasks.findIndex((t) => t.id === task.id);
      if (idx === -1) return { tasks: [task, ...state.tasks] };
      const next = [...state.tasks];
      next[idx] = { ...next[idx], ...task };
      return { tasks: next };
    }),

  removeTask: (taskId) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) }))
}));
