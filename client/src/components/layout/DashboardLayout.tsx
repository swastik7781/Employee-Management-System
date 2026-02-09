import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    DollarSign,
    TrendingUp,
    Settings,
    LogOut,
    Menu,
    X,
    Building2,
    Sun,
    Moon,
    Monitor,
    Bell,
    Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { cn } from '@/lib/utils';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: Calendar, label: 'Attendance', path: '/attendance' },
    { icon: FileText, label: 'Leaves', path: '/leaves' },
    { icon: DollarSign, label: 'Payroll', path: '/payroll' },
    { icon: TrendingUp, label: 'Performance', path: '/performance' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { theme, setTheme } = useThemeStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cycleTheme = () => {
        const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    const getThemeIcon = () => {
        switch (theme) {
            case 'light':
                return <Sun className="h-4 w-4" />;
            case 'dark':
                return <Moon className="h-4 w-4" />;
            default:
                return <Monitor className="h-4 w-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar - Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 250 : 70 }}
                className="fixed left-0 top-0 h-full bg-card border-r border-border z-40 hidden md:block"
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                        {sidebarOpen ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-sm">WorkSphere Pro</h1>
                                    <p className="text-xs text-muted-foreground">Swastik Industries</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 py-4 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        'flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200',
                                        isActive
                                            ? 'bg-primary text-primary-foreground shadow-lg'
                                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    )}
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0" />
                                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-border">
                        {sidebarOpen ? (
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold mx-auto">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div
                className={cn(
                    'transition-all duration-300',
                    sidebarOpen ? 'md:ml-[250px]' : 'md:ml-[70px]'
                )}
            >
                {/* Header */}
                <header className="h-16 bg-card border-b border-border sticky top-0 z-30">
                    <div className="h-full px-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="hidden md:flex"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>

                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-10 w-64"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" onClick={cycleTheme}>
                                {getThemeIcon()}
                            </Button>

                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                                    3
                                </Badge>
                            </Button>

                            <Button variant="ghost" size="icon" onClick={handleLogout}>
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    className="fixed inset-0 z-50 md:hidden"
                >
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute left-0 top-0 h-full w-64 bg-card border-r border-border">
                        <div className="p-4">
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-sm">WorkSphere Pro</h1>
                                    <p className="text-xs text-muted-foreground">Swastik Industries</p>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                                                isActive
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                            )}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
