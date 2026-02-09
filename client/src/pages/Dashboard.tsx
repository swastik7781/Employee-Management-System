import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, TrendingUp, DollarSign, Calendar, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h3 className="text-3xl font-bold mt-2">{value}</h3>
                        {trend && (
                            <Badge variant="outline" className="mt-2">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {trend}
                            </Badge>
                        )}
                    </div>
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                        <Icon className="h-7 w-7 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

export default function Dashboard() {
    const { data: stats } = useQuery({
        queryKey: ['employee-stats'],
        queryFn: async () => {
            const response = await api.get('/employees/stats');
            return response.data.data;
        },
    });

    const statsCards = [
        {
            title: 'Total Employees',
            value: stats?.total?.[0]?.count || 0,
            icon: Users,
            trend: '+12% from last month',
            color: 'from-indigo-600 to-purple-600',
        },
        {
            title: 'Present Today',
            value: '87',
            icon: UserCheck,
            trend: '95% attendance',
            color: 'from-green-600 to-emerald-600',
        },
        {
            title: 'On Leave',
            value: '8',
            icon: UserX,
            trend: '5 pending approvals',
            color: 'from-orange-600 to-red-600',
        },
        {
            title: 'Monthly Payroll',
            value: formatCurrency(12500000),
            icon: DollarSign,
            trend: '+5% from last month',
            color: 'from-blue-600 to-cyan-600',
        },
    ];

    const recentActivities = [
        { id: 1, user: 'Rajesh Sharma', action: 'Applied for leave', time: '2 hours ago', type: 'leave' },
        { id: 2, user: 'Priya Patel', action: 'Checked in', time: '3 hours ago', type: 'attendance' },
        { id: 3, user: 'Amit Kumar', action: 'Submitted timesheet', time: '5 hours ago', type: 'timesheet' },
        { id: 4, user: 'Sneha Gupta', action: 'Performance review completed', time: '1 day ago', type: 'performance' },
    ];

    const upcomingEvents = [
        { id: 1, title: 'Team Meeting', date: 'Today, 3:00 PM', type: 'meeting' },
        { id: 2, title: 'Payroll Processing', date: 'Tomorrow, 10:00 AM', type: 'payroll' },
        { id: 3, title: 'Training Session', date: 'Dec 15, 2024', type: 'training' },
        { id: 4, title: 'Performance Reviews', date: 'Dec 20, 2024', type: 'review' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts and Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Department Distribution */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Department Distribution</CardTitle>
                        <CardDescription>Employee count by department</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats?.byDepartment?.map((dept: any, index: number) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                                            {dept.name?.[0] || 'D'}
                                        </div>
                                        <div>
                                            <p className="font-medium">{dept.name || 'Department'}</p>
                                            <p className="text-sm text-muted-foreground">{dept.count} employees</p>
                                        </div>
                                    </div>
                                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                                            style={{ width: `${(dept.count / (stats?.total?.[0]?.count || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                        <CardDescription>Latest updates from your team</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                        {activity.user[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{activity.user}</p>
                                        <p className="text-xs text-muted-foreground">{activity.action}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Events */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5" />
                        <span>Upcoming Events</span>
                    </CardTitle>
                    <CardDescription>Important dates and deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {upcomingEvents.map((event) => (
                            <div
                                key={event.id}
                                className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <Badge variant="outline">{event.type}</Badge>
                                </div>
                                <h4 className="font-medium mb-1">{event.title}</h4>
                                <p className="text-sm text-muted-foreground">{event.date}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
