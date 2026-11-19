import { create } from 'zustand';
import { UserProfile } from '../types/user';
import { MOCK_USER } from '../mock/mockData';

interface UserState {
  user: UserProfile;
  isSidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup' | 'forgot';

  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setAuthModal: (open: boolean, mode?: 'signin' | 'signup' | 'forgot') => void;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: MOCK_USER,
  isSidebarCollapsed: false,
  theme: 'light',
  isAuthModalOpen: false,
  authModalMode: 'signin',

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setTheme: (theme) => set({ theme }),

  updateProfile: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),

  setAuthModal: (isAuthModalOpen, mode) =>
    set({
      isAuthModalOpen,
      authModalMode: mode || 'signin',
    }),

  deductCredits: (amount) => {
    const { user } = get();
    if (user.credits.balance < amount) return false;
    set({
      user: {
        ...user,
        credits: {
          ...user.credits,
          balance: user.credits.balance - amount,
          totalUsed: user.credits.totalUsed + amount,
        },
      },
    });
    return true;
  },

  addCredits: (amount) => {
    const { user } = get();
    set({
      user: {
        ...user,
        credits: {
          ...user.credits,
          balance: user.credits.balance + amount,
          totalEarned: user.credits.totalEarned + amount,
        },
      },
    });
  },
}));
