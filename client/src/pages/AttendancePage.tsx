import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, MapPin, Calendar, UserCheck, UserX, Timer,
    TrendingUp, CheckCircle2, AlertTriangle, ChevronLeft,
    ChevronRight, Download, Filter, BarChart2, Thermometer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// ====== Animated Clock ======
function LiveClock() {
    const [time, setTime] = useState(new Date());
    useState(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    });

    return (
        <div className="text-center">
            <div className="text-4xl font-bold font-mono tabular-nums tracking-tight">
                {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
                {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
        </div>
    );
}

// ====== Attendance Heatmap ======
const AttendanceHeatmap = ({ data }: { data: Record<string, string> }) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const statusColor: Record<string, string> = {
        present: 'bg-green-400 dark:bg-green-500',
        absent: 'bg-red-300 dark:bg-red-800/60',
        late: 'bg-orange-300 dark:bg-orange-700/60',
        leave: 'bg-blue-300 dark:bg-blue-700/60',
        weekend: 'bg-muted',
        future: 'bg-muted/40',
    };

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div>
            <div className="grid grid-cols-7 gap-1 mb-1">
                {days.map(d => <div key={d} className="text-center text-[10px] text-muted-foreground font-medium">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(year, month, day);
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const isFuture = date > today;
                    const status = isFuture ? 'future' : isWeekend ? 'weekend' : (data[dateStr] || 'present');

                    return (
                        <motion.div
                            key={day}
                            whileHover={{ scale: 1.2 }}
                            className={cn(
                                'aspect-square rounded-sm flex items-center justify-center text-[10px] font-medium cursor-pointer transition-colors',
                                statusColor[status] || statusColor.present,
                                day === today.getDate() && 'ring-2 ring-primary ring-offset-1'
                            )}
                            title={`${dateStr}: ${status}`}
                        >
                            {day}
                        </motion.div>
                    );
                })}
            </div>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
                {[
                    { key: 'present', label: 'Present' },
                    { key: 'absent', label: 'Absent' },
                    { key: 'late', label: 'Late' },
                    { key: 'leave', label: 'Leave' },
                ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-sm ${statusColor[key]}`} />
                        <span className="text-[10px] text-muted-foreground">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function AttendancePage() {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear] = useState(new Date().getFullYear());

    // Today's attendance status
    const { data: todayAttendance, isLoading: loadingToday } = useQuery({
        queryKey: ['attendance-today'],
        queryFn: async () => {
            try {
                const r = await api.get('/attendance/today');
                return r.data.data;
            } catch { return null; }
        },
    });

    // Attendance stats
    const { data: attendanceStats } = useQuery({
        queryKey: ['attendance-stats'],
        queryFn: async () => {
            try {
                const r = await api.get('/attendance/stats');
                return r.data.data;
            } catch {
                return { present: 87, absent: 5, onLeave: 8, late: 12, total: 100 };
            }
        },
    });

    const checkInMutation = useMutation({
        mutationFn: async () => {
            const position = await new Promise<GeolocationPosition>((resolve, reject) =>
                navigator.geolocation?.getCurrentPosition(resolve, reject, { timeout: 5000 })
            ).catch(() => null);

            return api.post('/attendance/checkin', {
                location: position ? {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                } : undefined,
            });
        },
        onSuccess: () => {
            toast.success('✅ Checked in successfully!');
            queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
        },
        onError: () => toast.error('Check-in failed. Please try again.'),
    });

    const checkOutMutation = useMutation({
        mutationFn: () => api.post('/attendance/checkout'),
        onSuccess: () => {
            toast.success('👋 Checked out successfully!');
            queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
        },
        onError: () => toast.error('Check-out failed. Please try again.'),
    });

    const isCheckedIn = !!todayAttendance?.checkIn && !todayAttendance?.checkOut;
    const stats = attendanceStats || { present: 87, absent: 5, onLeave: 8, late: 12, total: 100 };

    // Mock heatmap data
    const heatmapData: Record<string, string> = {};
    const today = new Date();
    for (let i = 1; i < today.getDate(); i++) {
        const d = new Date(today.getFullYear(), today.getMonth(), i);
        if (d.getDay() === 0 || d.getDay() === 6) continue;
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const r = Math.random();
        heatmapData[dateStr] = r > 0.9 ? 'absent' : r > 0.75 ? 'late' : r > 0.65 ? 'leave' : 'present';
    }

    const recentRecords = [
        { date: 'Today', checkIn: '09:02 AM', checkOut: isCheckedIn ? '—' : '06:05 PM', hours: isCheckedIn ? 'In Progress' : '9h 03m', status: isCheckedIn ? 'active' : 'present' },
        { date: 'Feb 18', checkIn: '08:58 AM', checkOut: '06:15 PM', hours: '9h 17m', status: 'present' },
        { date: 'Feb 17', checkIn: '09:45 AM', checkOut: '06:30 PM', hours: '8h 45m', status: 'late' },
        { date: 'Feb 16', checkIn: '—', checkOut: '—', hours: '—', status: 'leave' },
        { date: 'Feb 15', checkIn: '09:01 AM', checkOut: '05:58 PM', hours: '8h 57m', status: 'present' },
    ];

    const statusStyles: Record<string, string> = {
        present: 'bg-green-100 text-green-700 dark:bg-green-900/30',
        late: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30',
        absent: 'bg-red-100 text-red-700 dark:bg-red-900/30',
        leave: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30',
        active: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 animate-pulse',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Clock className="h-6 w-6 text-green-500" />
                    Attendance
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Track check-ins, working hours, and attendance patterns</p>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Present Today', value: stats.present, icon: UserCheck, gradient: 'bg-gradient-to-br from-green-500 to-emerald-600', suffix: '' },
                    { label: 'Absent', value: stats.absent, icon: UserX, gradient: 'bg-gradient-to-br from-red-500 to-rose-600', suffix: '' },
                    { label: 'On Leave', value: stats.onLeave, icon: Calendar, gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600', suffix: '' },
                    { label: 'Late Arrivals', value: stats.late, icon: AlertTriangle, gradient: 'bg-gradient-to-br from-orange-500 to-amber-600', suffix: '' },
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <Card className="hover:shadow-md transition-shadow overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-9 h-9 rounded-xl ${stat.gradient} flex items-center justify-center shadow-sm`}>
                                        <stat.icon className="h-4 w-4 text-white" />
                                    </div>
                                    <span className={`text-2xl font-bold`}>{stat.value}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stat.value / stats.total) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                                        className={`h-full rounded-full ${stat.gradient}`}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">{Math.round((stat.value / stats.total) * 100)}% of workforce</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Check In/Out Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="h-full overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-600" />
                        <CardContent className="p-6 flex flex-col items-center justify-center h-full gap-6">
                            <LiveClock />

                            {/* Status Indicator */}
                            <div className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                                isCheckedIn
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-muted text-muted-foreground'
                            )}>
                                <div className={cn('w-2 h-2 rounded-full', isCheckedIn ? 'bg-green-500 animate-pulse' : 'bg-gray-400')} />
                                {loadingToday ? 'Loading...' : isCheckedIn ? `Checked in at ${todayAttendance?.checkIn ? new Date(todayAttendance.checkIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}` : 'Not checked in yet'}
                            </div>

                            {/* Action Buttons */}
                            {!isCheckedIn ? (
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                                    <Button
                                        onClick={() => checkInMutation.mutate()}
                                        disabled={checkInMutation.isPending}
                                        className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg text-white font-semibold"
                                    >
                                        <CheckCircle2 className="h-5 w-5 mr-2" />
                                        {checkInMutation.isPending ? 'Checking in...' : 'Check In'}
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                                    <Button
                                        onClick={() => checkOutMutation.mutate()}
                                        disabled={checkOutMutation.isPending}
                                        variant="outline"
                                        className="w-full h-12 border-2 border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-semibold"
                                    >
                                        <Timer className="h-5 w-5 mr-2" />
                                        {checkOutMutation.isPending ? 'Checking out...' : 'Check Out'}
                                    </Button>
                                </motion.div>
                            )}

                            {/* GPS Note */}
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>GPS location will be captured</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Attendance Heatmap */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Monthly Calendar</CardTitle>
                                    <CardDescription>
                                        {new Date(selectedYear, selectedMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setSelectedMonth(m => m - 1 < 0 ? 11 : m - 1)}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground">
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => setSelectedMonth(m => (m + 1) % 12)}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground">
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <AttendanceHeatmap data={heatmapData} />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Records */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Attendance Records</CardTitle>
                                <CardDescription>Recent check-in/out history</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="text-xs gap-1.5">
                                <Download className="h-3.5 w-3.5" /> Export
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-3">Date</th>
                                        <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-3">Check In</th>
                                        <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-3">Check Out</th>
                                        <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-3">Hours</th>
                                        <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentRecords.map((record, i) => (
                                        <motion.tr
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.45 + i * 0.05 }}
                                            className="border-b border-border/50 hover:bg-accent/30 transition-colors"
                                        >
                                            <td className="py-3 px-3 text-sm font-medium">{record.date}</td>
                                            <td className="py-3 px-3 text-sm text-muted-foreground">{record.checkIn}</td>
                                            <td className="py-3 px-3 text-sm text-muted-foreground">{record.checkOut}</td>
                                            <td className="py-3 px-3 text-sm font-medium">{record.hours}</td>
                                            <td className="py-3 px-3">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusStyles[record.status]}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
