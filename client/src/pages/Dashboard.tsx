import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import {
    Users, UserCheck, UserX, DollarSign, TrendingUp, TrendingDown,
    Calendar, Clock, Award, Brain, AlertTriangle, BarChart2, Activity,
    Zap, Target, Users2, ChevronUp, ChevronDown, RefreshCw, ArrowRight,
    Flame, CheckCircle2, XCircle, Coffee
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

// ============ Animated Counter ============
function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }: {
    value: number; prefix?: string; suffix?: string; decimals?: number;
}) {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);

    useEffect(() => {
        const controls = animate(motionValue, value, {
            duration: 1.5,
            ease: 'easeOut',
        });
        motionValue.on('change', (v) => {
            if (nodeRef.current) {
                nodeRef.current.textContent = prefix + v.toFixed(decimals) + suffix;
            }
        });
        return controls.stop;
    }, [value]);

    return <span ref={nodeRef} className="counter">{prefix}0{suffix}</span>;
}

// ============ Stat Card ============
const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, gradient, subtitle, delay = 0 }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 card-hover">
            {/* Background Decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 ${gradient} translate-x-8 -translate-y-8`} />
            <div className={`absolute bottom-0 left-0 w-20 h-20 rounded-full opacity-5 ${gradient} -translate-x-4 translate-y-4`} />

            <CardContent className="p-5 relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                    </div>
                    {trend !== undefined && (
                        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0
                            ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                            : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                            }`}>
                            {trend >= 0 ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-foreground">
                        {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
                    </h3>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

// ============ AI Insight Card ============
const AIInsight = ({ title, value, description, icon: Icon, color, severity }: any) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-start gap-3 p-3 rounded-xl border ${severity === 'high' ? 'border-red-200 bg-red-50/50 dark:border-red-800/30 dark:bg-red-900/10'
            : severity === 'medium' ? 'border-orange-200 bg-orange-50/50 dark:border-orange-800/30 dark:bg-orange-900/10'
                : 'border-green-200 bg-green-50/50 dark:border-green-800/30 dark:bg-green-900/10'
            }`}
    >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
                <p className="text-xs font-semibold">{title}</p>
                <span className={`text-lg font-bold ${severity === 'high' ? 'text-red-500' : severity === 'medium' ? 'text-orange-500' : 'text-green-500'}`}>
                    {value}
                </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
    </motion.div>
);

// ============ Mini Progress Bar ============
const ProgressBar = ({ value, max, color }: { value: number; max: number; color: string }) => {
    const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className={`h-full rounded-full ${color}`}
            />
        </div>
    );
};

// ============ Activity Item ============
const ActivityItem = ({ activity, delay }: { activity: any; delay: number }) => {
    const colors: Record<string, string> = {
        leave: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30',
        attendance: 'bg-green-100 text-green-600 dark:bg-green-900/30',
        payroll: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
        performance: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
        system: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="flex items-start gap-3 py-2.5 group"
        >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${colors[activity.type] || colors.system}`}>
                {activity.user?.[0] || 'S'}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{activity.user}</p>
                <p className="text-xs text-muted-foreground">{activity.action}</p>
            </div>
            <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">{activity.time}</span>
        </motion.div>
    );
};

export default function Dashboard() {
    const { user } = useAuthStore();
    const [refreshKey, setRefreshKey] = useState(0);
    const currentHour = new Date().getHours();

    const greeting = currentHour < 12 ? '☀️ Good morning' : currentHour < 17 ? '👋 Good afternoon' : '🌙 Good evening';

    const { data: dashboardStats, isLoading: dashboardLoading } = useQuery({
        queryKey: ['dashboard-stats', refreshKey],
        queryFn: async () => {
            try {
                const response = await api.get('/reports/dashboard');
                return response.data.data;
            } catch {
                return null;
            }
        },
    });

    const totalEmployees = dashboardStats?.summary?.totalEmployees || 95;
    const presentToday = dashboardStats?.summary?.presentToday || Math.floor(totalEmployees * 0.91);
    const onLeaveToday = dashboardStats?.summary?.onLeaveToday || Math.floor(totalEmployees * 0.06);

    const statsCards = [
        {
            title: 'Total Employees',
            value: totalEmployees,
            icon: Users,
            trend: dashboardStats?.summary?.newHires || 12,
            gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
            color: 'text-violet-600',
            subtitle: 'Across all departments',
            delay: 0,
        },
        {
            title: 'Present Today',
            value: presentToday,
            icon: UserCheck,
            trend: 3,
            gradient: 'bg-gradient-to-br from-emerald-500 to-green-600',
            color: 'text-emerald-600',
            subtitle: `${totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0}% attendance rate`,
            delay: 0.08,
        },
        {
            title: 'On Leave',
            value: onLeaveToday,
            icon: UserX,
            trend: -2,
            gradient: 'bg-gradient-to-br from-orange-500 to-amber-600',
            color: 'text-orange-600',
            subtitle: 'Approved leaves today',
            delay: 0.16,
        },
        {
            title: 'Monthly Payroll',
            value: formatCurrency(12500000), // Pending payroll integration
            icon: DollarSign,
            trend: 5,
            gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600',
            color: 'text-blue-600',
            subtitle: 'Feb 2026',
            delay: 0.24,
        },
    ];

    const departments = dashboardStats?.departmentDistribution || [
        { name: 'Engineering', count: 32 },
        { name: 'Sales & Marketing', count: 24 },
        { name: 'Operations', count: 18 },
        { name: 'Human Resources', count: 12 },
        { name: 'Finance', count: 9 },
    ];

    const recentActivities = [
        { id: 1, user: 'Rajesh Sharma', action: 'Applied for Annual Leave (3 days)', time: '2m ago', type: 'leave' },
        { id: 2, user: 'Priya Patel', action: 'Checked in at 9:02 AM', time: '1h ago', type: 'attendance' },
        { id: 3, user: 'Amit Kumar', action: 'Submitted December timesheet', time: '2h ago', type: 'payroll' },
        { id: 4, user: 'Sneha Gupta', action: 'Completed Q4 performance review', time: '3h ago', type: 'performance' },
        { id: 5, user: 'System', action: 'February payroll scheduled for processing', time: '1d ago', type: 'system' },
    ];

    const aiInsights = [
        {
            title: 'High Attrition Risk',
            value: '3',
            description: 'Employees showing early burnout indicators',
            icon: AlertTriangle,
            color: 'bg-red-500',
            severity: 'high',
        },
        {
            title: 'Late Arrival Pattern',
            value: '7',
            description: 'Employees with >15 late arrivals this month',
            icon: Clock,
            color: 'bg-orange-500',
            severity: 'medium',
        },
        {
            title: 'Top Performers',
            value: '12',
            description: 'Eligible for promotion consideration',
            icon: Award,
            color: 'bg-green-500',
            severity: 'low',
        },
    ];

    const upcomingEvents = [
        { id: 1, title: 'Team Review Meeting', date: 'Today, 3:00 PM', type: 'meeting', icon: Users2 },
        { id: 2, title: 'Feb Payroll Processing', date: 'Feb 28, 2026', type: 'payroll', icon: DollarSign },
        { id: 3, title: 'Performance Reviews', date: 'Mar 1 – 15', type: 'review', icon: Award },
        { id: 4, title: 'New Employee Onboarding', date: 'Mar 3, 2026', type: 'training', icon: Users },
    ];

    const eventColors: Record<string, string> = {
        meeting: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30',
        payroll: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
        review: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30',
        training: 'bg-green-100 text-green-600 dark:bg-green-900/30',
    };

    return (
        <div className="space-y-6">
            {/* ====== HEADER ====== */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-start justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold">
                        {greeting}, {user?.firstName}! 👋
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Here's your workforce intelligence for{' '}
                        <span className="font-medium text-foreground">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRefreshKey(k => k + 1)}
                    className="hidden sm:flex items-center gap-2 text-xs"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                </Button>
            </motion.div>

            {/* ====== STATS GRID ====== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statsCards.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            {/* ====== AI INTELLIGENCE BANNER ====== */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="border-0 overflow-hidden" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)' }}>
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Brain className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">AI Workforce Intelligence</h3>
                                    <p className="text-xs text-white/70">3 predictive insights require your attention</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                                {aiInsights.map((insight, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        className="text-center bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2"
                                    >
                                        <p className="text-xl font-bold text-white">{insight.value}</p>
                                        <p className="text-[10px] text-white/70 whitespace-nowrap">{insight.title}</p>
                                    </motion.div>
                                ))}
                                <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs">
                                    View Insights <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* ====== MAIN CONTENT GRID ====== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Department Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="lg:col-span-2"
                >
                    <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Department Overview</CardTitle>
                                    <CardDescription>Employee distribution by department</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                                    View All <ArrowRight className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {dashboardLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="skeleton w-8 h-8 rounded-lg" />
                                        <div className="flex-1">
                                            <div className="skeleton h-3 w-24 rounded mb-2" />
                                            <div className="skeleton h-1.5 w-full rounded-full" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                departments.map((dept: any, index: number) => {
                                    const gradients = [
                                        'bg-gradient-to-r from-violet-500 to-purple-600',
                                        'bg-gradient-to-r from-blue-500 to-indigo-600',
                                        'bg-gradient-to-r from-green-500 to-emerald-600',
                                        'bg-gradient-to-r from-orange-500 to-amber-600',
                                        'bg-gradient-to-r from-pink-500 to-rose-600',
                                    ];
                                    const barColors = [
                                        'bg-gradient-to-r from-violet-400 to-purple-500',
                                        'bg-gradient-to-r from-blue-400 to-indigo-500',
                                        'bg-gradient-to-r from-green-400 to-emerald-500',
                                        'bg-gradient-to-r from-orange-400 to-amber-500',
                                        'bg-gradient-to-r from-pink-400 to-rose-500',
                                    ];

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.08 }}
                                            className="flex items-center gap-3 group"
                                        >
                                            <div className={`w-8 h-8 rounded-lg ${gradients[index % gradients.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                                                {(dept.name || 'D')[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <p className="text-sm font-medium truncate">{dept.name || 'Department'}</p>
                                                    <span className="text-xs font-semibold text-muted-foreground ml-2">
                                                        {dept.count} <span className="font-normal text-muted-foreground/60">emp</span>
                                                    </span>
                                                </div>
                                                <ProgressBar
                                                    value={dept.count}
                                                    max={totalEmployees}
                                                    color={barColors[index % barColors.length]}
                                                />
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Activities */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Live Activity</CardTitle>
                                <div className="flex items-center gap-1.5">
                                    <div className="relative">
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                                    </div>
                                    <span className="text-[10px] text-green-600 font-medium">Live</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="divide-y divide-border/50">
                            {recentActivities.map((activity, i) => (
                                <ActivityItem key={activity.id} activity={activity} delay={0.45 + i * 0.08} />
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* ====== SECOND ROW ====== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* AI Insights */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Brain className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">AI Insights</CardTitle>
                                    <CardDescription>Predictive analytics</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {aiInsights.map((insight, i) => (
                                <AIInsight key={i} {...insight} />
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* KPI Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                >
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Key Performance</CardTitle>
                            <CardDescription>February 2026 metrics</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { label: 'Attendance Rate', value: 91, target: 95, color: 'from-green-400 to-emerald-500', icon: UserCheck },
                                { label: 'Leave Utilization', value: 68, target: 80, color: 'from-blue-400 to-indigo-500', icon: Calendar },
                                { label: 'Performance Score', value: 82, target: 85, color: 'from-violet-400 to-purple-500', icon: TrendingUp },
                                { label: 'Payroll Accuracy', value: 99, target: 100, color: 'from-orange-400 to-amber-500', icon: DollarSign },
                            ].map((kpi, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + i * 0.08 }}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <kpi.icon className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-xs font-medium">{kpi.label}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm font-bold">{kpi.value}%</span>
                                            <span className="text-[10px] text-muted-foreground">/{kpi.target}%</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(kpi.value / kpi.target) * 100}%` }}
                                            transition={{ duration: 1.2, delay: 0.7 + i * 0.1, ease: 'easeOut' }}
                                            className={`h-full rounded-full bg-gradient-to-r ${kpi.color}`}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Upcoming Events */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Upcoming Events</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {upcomingEvents.map((event, i) => {
                                const Icon = event.icon;
                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.65 + i * 0.08 }}
                                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer group"
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${eventColors[event.type]}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold truncate">{event.title}</p>
                                            <p className="text-[11px] text-muted-foreground">{event.date}</p>
                                        </div>
                                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* ====== QUICK STATS ROW ====== */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
            >
                <Card className="shadow-sm">
                    <CardContent className="p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-x divide-border">
                            {[
                                { label: 'Avg. Tenure', value: '3.2 yrs', icon: Clock, color: 'text-blue-500' },
                                { label: 'Open Positions', value: '8', icon: Target, color: 'text-violet-500' },
                                { label: 'Training Hrs/mo', value: '24h', icon: Zap, color: 'text-amber-500' },
                                { label: 'Employee NPS', value: '+47', icon: Award, color: 'text-green-500' },
                            ].map((item, i) => (
                                <div key={i} className={`text-center ${i > 0 ? 'pl-4' : ''}`}>
                                    <div className="flex justify-center mb-2">
                                        <item.icon className={`h-5 w-5 ${item.color}`} />
                                    </div>
                                    <p className="text-xl font-bold">{item.value}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
