import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Calendar, FileText, DollarSign, TrendingUp,
    Settings, LogOut, Menu, X, Building2, Sun, Moon, Monitor, Bell,
    Search, ChevronRight, BarChart3, Zap,
    AlertCircle, CheckCircle2, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', color: 'from-violet-500 to-purple-600' },
    { icon: Users, label: 'Employees', path: '/employees', color: 'from-blue-500 to-indigo-600' },
    { icon: Calendar, label: 'Attendance', path: '/attendance', color: 'from-green-500 to-emerald-600' },
    { icon: FileText, label: 'Leaves', path: '/leaves', color: 'from-orange-500 to-amber-600' },
    { icon: DollarSign, label: 'Payroll', path: '/payroll', color: 'from-cyan-500 to-blue-600' },
    { icon: TrendingUp, label: 'Performance', path: '/performance', color: 'from-pink-500 to-rose-600' },
    { icon: BarChart3, label: 'Reports', path: '/reports', color: 'from-teal-500 to-cyan-600' },
    { icon: Settings, label: 'Settings', path: '/settings', color: 'from-slate-500 to-gray-600' },
];

// Notification types with icons
const mockNotifications = [
    { id: 1, type: 'leave', title: 'Leave Request', message: 'Rajesh Sharma applied for 3 days leave', time: '2m ago', read: false, icon: FileText, color: 'text-orange-500' },
    { id: 2, type: 'attendance', title: 'Late Arrival', message: 'Priya Patel checked in 45 min late', time: '1h ago', read: false, icon: AlertCircle, color: 'text-red-500' },
    { id: 3, type: 'performance', title: 'Review Completed', message: 'Q4 performance review for Amit Kumar done', time: '2h ago', read: true, icon: Star, color: 'text-yellow-500' },
    { id: 4, type: 'system', title: 'Payroll Processed', message: 'December payroll has been processed', time: '1d ago', read: true, icon: CheckCircle2, color: 'text-green-500' },
];

// Easter Egg: Konami Code
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Easter Egg: Developer Credits
const DEV_CREDITS = [
    { name: 'Swastik Industries', role: 'Product Owner' },
    { name: 'WorkSphere Pro v2.0', role: 'Built with ❤️ & caffeine' },
    { name: 'Stack: MERN + TypeScript', role: 'Framer Motion + Tailwind' },
];

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [logoClickCount, setLogoClickCount] = useState(0);
    const [showDevModal, setShowDevModal] = useState(false);
    const [_konamiProgress, setKonamiProgress] = useState(0);
    const [productivityMode, setProductivityMode] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { theme, setTheme } = useThemeStore();
    const konamiRef = useRef<string[]>([]);
    const notifRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Midnight dark mode easter egg
    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour >= 0 && currentHour < 6 && theme !== 'dark') {
            setTheme('dark');
            toast('🌙 Night owl mode activated automatically', { icon: '🦉', duration: 3000 });
        }
    }, []);

    // Konami Code Easter Egg
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const newProgress = [...konamiRef.current, e.key];
            if (newProgress.length > KONAMI_CODE.length) {
                newProgress.shift();
            }
            konamiRef.current = newProgress;
            setKonamiProgress(newProgress.length);

            if (JSON.stringify(newProgress.slice(-KONAMI_CODE.length)) === JSON.stringify(KONAMI_CODE)) {
                setProductivityMode(prev => !prev);
                const msg = productivityMode ? '⚡ Productivity Mode Deactivated' : '⚡ Productivity Mode Activated!';
                toast(msg, {
                    icon: '🚀',
                    duration: 3000,
                    style: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: 600 }
                });
                konamiRef.current = [];
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [productivityMode]);

    // Apply productivity mode to body
    useEffect(() => {
        if (productivityMode) {
            document.body.classList.add('productivity-mode');
        } else {
            document.body.classList.remove('productivity-mode');
        }
    }, [productivityMode]);

    // Logo click easter egg
    const handleLogoClick = useCallback(() => {
        const newCount = logoClickCount + 1;
        setLogoClickCount(newCount);
        if (newCount >= 5) {
            setShowDevModal(true);
            setLogoClickCount(0);
        }
    }, [logoClickCount]);

    // Close notif on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const cycleTheme = () => {
        const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    const getThemeIcon = () => {
        switch (theme) {
            case 'light': return <Sun className="h-4 w-4" />;
            case 'dark': return <Moon className="h-4 w-4" />;
            default: return <Monitor className="h-4 w-4" />;
        }
    };

    const unreadCount = mockNotifications.filter(n => !n.read).length;
    const currentPage = menuItems.find(item => location.pathname.startsWith(item.path));

    const sidebarVariants = {
        open: { width: 260, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
        closed: { width: 72, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* ======= SIDEBAR DESKTOP ======= */}
            <motion.aside
                variants={sidebarVariants}
                initial={false}
                animate={sidebarOpen ? 'open' : 'closed'}
                className="fixed left-0 top-0 h-full bg-card border-r border-border z-40 hidden md:flex flex-col overflow-hidden"
                style={{ boxShadow: '4px 0 24px rgba(0,0,0,0.04)' }}
            >
                {/* Logo / Header */}
                <div
                    className="h-16 flex items-center px-4 border-b border-border flex-shrink-0 cursor-pointer select-none"
                    onClick={handleLogoClick}
                >
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg glow-primary"
                    >
                        <Building2 className="w-5 h-5 text-white" />
                    </motion.div>

                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="ml-3 min-w-0"
                            >
                                <h1 className="font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    WorkSphere Pro
                                </h1>
                                <p className="text-xs text-muted-foreground truncate">Swastik Industries</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden scrollbar-hide px-2 space-y-1">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);

                        return (
                            <motion.div
                                key={item.path}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.04 }}
                            >
                                <Link
                                    to={item.path}
                                    className={cn(
                                        'flex items-center rounded-xl px-3 py-2.5 transition-all duration-200 group relative overflow-hidden',
                                        isActive
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                                    )}
                                >
                                    {/* Active indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl"
                                            style={{ zIndex: -1 }}
                                        />
                                    )}

                                    <div className={cn(
                                        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all',
                                        isActive ? 'bg-white/20' : `bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100`
                                    )}>
                                        <Icon className={cn('h-4 w-4', isActive && 'text-white')} />
                                    </div>

                                    {!isActive && (
                                        <Icon className="h-4 w-4 absolute left-3 group-hover:opacity-0 transition-opacity" />
                                    )}

                                    <AnimatePresence>
                                        {sidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -5 }}
                                                transition={{ duration: 0.15 }}
                                                className={cn('ml-3 text-sm font-medium', isActive ? 'text-white' : '')}
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {isActive && sidebarOpen && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="ml-auto"
                                        >
                                            <ChevronRight className="h-3 w-3 text-white/70" />
                                        </motion.div>
                                    )}
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-3 border-t border-border flex-shrink-0">
                    <div className={cn(
                        'flex items-center rounded-xl p-2 hover:bg-accent transition-all cursor-pointer group',
                        sidebarOpen ? 'space-x-3' : 'justify-center'
                    )}>
                        <div className="relative flex-shrink-0">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                        </div>

                        <AnimatePresence>
                            {sidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -5 }}
                                    className="flex-1 min-w-0"
                                >
                                    <p className="text-sm font-semibold truncate">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize truncate">{user?.role?.replace('_', ' ')}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.aside>

            {/* ======= MAIN CONTENT ======= */}
            <div className={cn(
                'flex-1 flex flex-col min-h-screen transition-all duration-300',
                sidebarOpen ? 'md:ml-[260px]' : 'md:ml-[72px]'
            )}>
                {/* ======= HEADER ======= */}
                <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-30 flex items-center px-4 gap-4"
                    style={{ boxShadow: '0 1px 0 hsl(var(--border)), 0 4px 20px rgba(0,0,0,0.03)' }}>

                    {/* Sidebar Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                    >
                        <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
                            <Menu className="h-4 w-4" />
                        </motion.div>
                    </motion.button>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground"
                    >
                        <AnimatePresence mode="wait">
                            {mobileMenuOpen ? (
                                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                    <X className="h-4 w-4" />
                                </motion.div>
                            ) : (
                                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                                    <Menu className="h-4 w-4" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Breadcrumb */}
                    <div className="hidden sm:flex items-center space-x-1 text-sm">
                        <span className="text-muted-foreground">WorkSphere</span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{currentPage?.label || 'Dashboard'}</span>
                    </div>

                    <div className="flex-1" />

                    {/* Search */}
                    <motion.div
                        animate={{ width: searchFocused ? 280 : 200 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="relative hidden sm:block"
                    >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder={searchFocused ? 'Search employees, leaves, payroll...' : 'Search...'}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className="w-full h-8 pl-9 pr-3 text-xs bg-muted/50 border border-border rounded-lg outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-muted-foreground/60"
                        />
                        {searchFocused && (
                            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-muted px-1 rounded border border-border">
                                ESC
                            </kbd>
                        )}
                    </motion.div>

                    {/* Theme Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={cycleTheme}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={theme}
                                initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            >
                                {getThemeIcon()}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>

                    {/* Notifications */}
                    <div ref={notifRef} className="relative">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setNotifOpen(!notifOpen)}
                            className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                        >
                            <motion.div
                                animate={notifOpen ? {} : { rotate: [0, 15, -15, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
                            >
                                <Bell className="h-4 w-4" />
                            </motion.div>
                            {unreadCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center badge-glow"
                                >
                                    {unreadCount}
                                </motion.span>
                            )}
                        </motion.button>

                        {/* Notification Dropdown */}
                        <AnimatePresence>
                            {notifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                                    className="absolute right-0 top-10 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
                                    style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px hsl(var(--border))' }}
                                >
                                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                                        <h3 className="font-semibold text-sm">Notifications</h3>
                                        <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Mark all read</span>
                                    </div>
                                    <div className="divide-y divide-border max-h-80 overflow-y-auto scrollbar-thin">
                                        {mockNotifications.map((notif, i) => {
                                            const Icon = notif.icon;
                                            return (
                                                <motion.div
                                                    key={notif.id}
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className={cn(
                                                        'flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors',
                                                        !notif.read && 'bg-primary/3'
                                                    )}
                                                >
                                                    <div className={cn('w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 mt-0.5', notif.color)}>
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs font-semibold">{notif.title}</p>
                                                            {!notif.read && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                                                        <p className="text-[10px] text-muted-foreground/60 mt-1">{notif.time}</p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                    <div className="px-4 py-2.5 border-t border-border text-center">
                                        <span className="text-xs text-primary font-medium cursor-pointer hover:underline">View all notifications</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Logout */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
                    >
                        <LogOut className="h-4 w-4" />
                    </motion.button>
                </header>

                {/* ======= PAGE CONTENT ======= */}
                <main className="flex-1 p-6 overflow-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Footer quote easter egg */}
                <footer className="px-6 py-3 border-t border-border text-center">
                    <p className="text-[10px] text-muted-foreground/40 select-none" title="🎯 Built with passion for excellence">
                        © 2026 Swastik Industries · WorkSphere Pro v2.0 · <span className="italic">"People are your greatest asset"</span>
                    </p>
                </footer>
            </div>

            {/* ======= MOBILE MENU ======= */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                            className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 md:hidden flex flex-col"
                        >
                            <div className="h-16 flex items-center px-4 border-b border-border">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                                    <Building2 className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-sm gradient-text">WorkSphere Pro</h1>
                                    <p className="text-xs text-muted-foreground">Swastik Industries</p>
                                </div>
                            </div>

                            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname.startsWith(item.path);
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                'flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all',
                                                isActive
                                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                                                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                            )}
                                        >
                                            <Icon className="h-4 w-4 flex-shrink-0" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-3 border-t border-border">
                                <div className="flex items-center gap-3 p-2">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ======= DEVELOPER CREDITS MODAL ======= */}
            <AnimatePresence>
                {showDevModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                            onClick={() => setShowDevModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 20 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="fixed inset-0 flex items-center justify-center z-[101] p-4"
                        >
                            <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
                                <motion.div
                                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                                >
                                    <Zap className="w-8 h-8 text-white" />
                                </motion.div>
                                <h2 className="text-xl font-bold gradient-text mb-1">Easter Egg Found! 🎉</h2>
                                <p className="text-xs text-muted-foreground mb-6">You clicked the logo 5 times!</p>
                                <div className="space-y-2 mb-6">
                                    {DEV_CREDITS.map((credit, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-accent/50 rounded-xl px-4 py-2"
                                        >
                                            <p className="text-sm font-semibold">{credit.name}</p>
                                            <p className="text-xs text-muted-foreground">{credit.role}</p>
                                        </motion.div>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground/50 italic mb-4">
                                    Try the Konami code for another surprise ↑↑↓↓←→←→BA
                                </p>
                                <Button onClick={() => setShowDevModal(false)} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600">
                                    Awesome! ✨
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
