import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

let unsubscribeAuth = null;

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),
  clearUser: () => set({ user: null, loading: false }),

  initAuthListener: () => {
    if (unsubscribeAuth) return;

    set({ loading: true });

    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        set({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          },
          loading: false
        });
      } else {
        set({ user: null, loading: false });
      }
    });
  }
}));
