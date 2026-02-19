import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { useThemeStore } from './stores/themeStore';
import './index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

// Theme wrapper to apply class to HTML element
function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore();

    React.useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add(prefersDark ? 'dark' : 'light');
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider>
                    <App />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                borderRadius: '12px',
                                padding: '12px 16px',
                                fontSize: '14px',
                                fontFamily: 'Inter, sans-serif',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                            },
                            success: {
                                duration: 3000,
                                style: {
                                    background: '#f0fdf4',
                                    color: '#166534',
                                    border: '1px solid #bbf7d0',
                                },
                                iconTheme: { primary: '#16a34a', secondary: '#fff' },
                            },
                            error: {
                                duration: 4000,
                                style: {
                                    background: '#fef2f2',
                                    color: '#991b1b',
                                    border: '1px solid #fecaca',
                                },
                                iconTheme: { primary: '#dc2626', secondary: '#fff' },
                            },
                        }}
                    />
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
