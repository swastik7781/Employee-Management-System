import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    employeeId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
    department?: string;
    designation?: string;
    phone?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string, refreshToken?: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
    setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            login: (user, token, refreshToken) => {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
                set({ user, token, refreshToken: refreshToken || null, isAuthenticated: true });
            },
            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('refreshToken');
                set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
            },
            updateUser: (updatedUser) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updatedUser } : null,
                })),
            setToken: (token) => {
                localStorage.setItem('token', token);
                set({ token });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
