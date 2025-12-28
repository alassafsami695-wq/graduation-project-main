import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthWallet {
    id: number;
    user_id: number;
    balance: string;
    created_at: string;
    updated_at: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    type: 'super_admin' | 'teacher' | 'user';
    wallet?: AuthWallet;
    photo?: string;
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    token: string | null;
    setAuth: (user: AuthUser, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            token: null,
            setAuth: (user, token) => set({ user, isAuthenticated: true, token }),
            logout: () => {
                set({ user: null, isAuthenticated: false, token: null });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
