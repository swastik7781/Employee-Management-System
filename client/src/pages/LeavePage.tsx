import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Plus, Calendar, Clock, CheckCircle2, XCircle,
    AlertCircle, Filter, Download, X, ChevronDown, Umbrella,
    Thermometer, Coffee, Briefcase, ArrowRight, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// ====== Leave Type Config ======
const leaveTypes = [
    { id: 'annual', label: 'Annual Leave', icon: Umbrella, color: 'from-blue-500 to-indigo-600', max: 21 },
    { id: 'sick', label: 'Sick Leave', icon: Thermometer, color: 'from-red-500 to-rose-600', max: 12 },
    { id: 'casual', label: 'Casual Leave', icon: Coffee, color: 'from-amber-500 to-orange-600', max: 9 },
    { id: 'comp-off', label: 'Comp Off', icon: Briefcase, color: 'from-green-500 to-emerald-600', max: 6 },
];

// ====== Leave Balance Card ======
const LeaveBalanceCard = ({ type, used, total, delay }: { type: typeof leaveTypes[0]; used: number; total: number; delay: number }) => {
    const remaining = total - used;
    const percent = (used / total) * 100;
    const Icon = type.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -2 }}
        >
            <Card className="overflow-hidden hover:shadow-md transition-all">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-sm`}>
                            <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold">{remaining}</span>
                            <span className="text-xs text-muted-foreground">/{total}</span>
                        </div>
                    </div>
                    <p className="text-xs font-medium mb-2">{type.label}</p>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1.2, delay: delay + 0.2 }}
                            className={`h-full rounded-full bg-gradient-to-r ${type.color}`}
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5">{used} used · {remaining} remaining</p>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// ====== Apply Leave Modal ======
const ApplyLeaveModal = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
    const [form, setForm] = useState({
        leaveType: 'annual', fromDate: '', toDate: '', reason: '', isHalfDay: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const days = form.fromDate && form.toDate
        ? Math.max(0, Math.ceil((new Date(form.toDate).getTime() - new Date(form.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
        : 0;

    const handleSubmit = async () => {
        if (!form.fromDate || !form.toDate || !form.reason) {
            toast.error('Please fill all required fields');
            return;
        }
        setIsSubmitting(true);
        try {
            await api.post('/leaves/apply', form);
            toast.success('Leave application submitted! 📋');
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to submit leave');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-white">Apply for Leave</h2>
                        <p className="text-xs text-white/70">Submit your leave request</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                    {/* Leave Type */}
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Leave Type *</label>
                        <div className="grid grid-cols-2 gap-2">
                            {leaveTypes.map(lt => (
                                <button
                                    key={lt.id}
                                    onClick={() => setForm(f => ({ ...f, leaveType: lt.id }))}
                                    className={cn(
                                        'flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all text-xs font-medium',
                                        form.leaveType === lt.id
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-border hover:border-primary/30'
                                    )}
                                >
                                    <lt.icon className="h-4 w-4 flex-shrink-0" />
                                    {lt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">From Date *</label>
                            <input type="date" value={form.fromDate} onChange={e => setForm(f => ({ ...f, fromDate: e.target.value }))}
                                className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">To Date *</label>
                            <input type="date" value={form.toDate} min={form.fromDate} onChange={e => setForm(f => ({ ...f, toDate: e.target.value }))}
                                className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                        </div>
                    </div>

                    {/* Days preview */}
                    {days > 0 && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2 py-3 bg-primary/5 rounded-xl border border-primary/20">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">{days} day{days > 1 ? 's' : ''} leave requested</span>
                        </motion.div>
                    )}

                    {/* Half Day Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <div
                            onClick={() => setForm(f => ({ ...f, isHalfDay: !f.isHalfDay }))}
                            className={cn(
                                'w-10 h-5 rounded-full relative transition-colors',
                                form.isHalfDay ? 'bg-primary' : 'bg-muted'
                            )}
                        >
                            <div className={cn(
                                'absolute w-4 h-4 bg-white rounded-full shadow-sm top-0.5 transition-all',
                                form.isHalfDay ? 'left-5' : 'left-0.5'
                            )} />
                        </div>
                        <span className="text-sm font-medium">Half Day</span>
                    </label>

                    {/* Reason */}
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Reason *</label>
                        <textarea
                            value={form.reason}
                            onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                            placeholder="Please provide a reason for your leave request..."
                            rows={3}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">{form.reason.length}/500 characters</p>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-violet-500 to-purple-600 text-white min-w-[120px]"
                    >
                        {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : '📋 Submit Request'}
                    </Button>
                </div>
            </motion.div>
        </>
    );
};

export default function LeavePage() {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const { data: leaves, isLoading } = useQuery({
        queryKey: ['leaves', filter],
        queryFn: async () => {
            try {
                const params = new URLSearchParams();
                if (filter !== 'all') params.append('status', filter);
                const r = await api.get(`/leaves?${params}`);
                return r.data.data;
            } catch {
                return [];
            }
        },
    });

    const approveMutation = useMutation({
        mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) =>
            api.put(`/leaves/${id}/${action}`),
        onSuccess: (_, { action }) => {
            toast.success(`Leave ${action}d successfully`);
            queryClient.invalidateQueries({ queryKey: ['leaves'] });
        },
        onError: () => toast.error('Action failed'),
    });

    const mockLeaves = [
        { _id: '1', employee: { name: 'Rajesh Sharma', dept: 'Engineering' }, leaveType: 'annual', fromDate: '2026-02-20', toDate: '2026-02-22', days: 3, reason: 'Family vacation', status: 'pending' },
        { _id: '2', employee: { name: 'Priya Patel', dept: 'HR' }, leaveType: 'sick', fromDate: '2026-02-15', toDate: '2026-02-16', days: 2, reason: 'Medical appointment', status: 'approved' },
        { _id: '3', employee: { name: 'Amit Kumar', dept: 'Sales' }, leaveType: 'casual', fromDate: '2026-02-18', toDate: '2026-02-18', days: 1, reason: 'Personal work', status: 'rejected' },
        { _id: '4', employee: { name: 'Sneha Gupta', dept: 'Finance' }, leaveType: 'comp-off', fromDate: '2026-03-01', toDate: '2026-03-02', days: 2, reason: 'Compensatory off for weekend work', status: 'pending' },
    ];

    const displayLeaves = (leaves?.length ? leaves : mockLeaves).filter((l: any) => filter === 'all' || l.status === filter);

    const leaveBalances = [
        { type: leaveTypes[0], used: 6, total: 21 },
        { type: leaveTypes[1], used: 3, total: 12 },
        { type: leaveTypes[2], used: 5, total: 9 },
        { type: leaveTypes[3], used: 1, total: 6 },
    ];

    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
        pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30', icon: AlertCircle },
        approved: { label: 'Approved', className: 'bg-green-100 text-green-700 dark:bg-green-900/30', icon: CheckCircle2 },
        rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 dark:bg-red-900/30', icon: XCircle },
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="h-6 w-6 text-violet-500" />
                        Leave Management
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Apply for leaves and manage leave requests</p>
                </div>
                <Button
                    onClick={() => setShowApplyModal(true)}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg gap-1.5 text-xs"
                >
                    <Plus className="h-3.5 w-3.5" /> Apply Leave
                </Button>
            </motion.div>

            {/* Leave Balances */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {leaveBalances.map((lb, i) => (
                    <LeaveBalanceCard key={lb.type.id} {...lb} delay={i * 0.08} />
                ))}
            </div>

            {/* Summary Alert */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">2 pending leave requests</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">Review and approve/reject pending requests below</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto text-xs border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => setFilter('pending')}>
                        Review <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                </div>
            </motion.div>

            {/* Leave Requests */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <CardTitle className="text-base">Leave Requests</CardTitle>
                                <CardDescription>Manage all leave applications</CardDescription>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={cn(
                                            'text-xs px-3 py-1.5 rounded-lg border transition-all font-medium capitalize',
                                            filter === f
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                        )}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <AnimatePresence>
                                {displayLeaves.map((leave: any, i: number) => {
                                    const sc = statusConfig[leave.status] || statusConfig.pending;
                                    const StatusIcon = sc.icon;
                                    const lt = leaveTypes.find(t => t.id === leave.leaveType) || leaveTypes[0];

                                    return (
                                        <motion.div
                                            key={leave._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: i * 0.06 }}
                                            className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all group"
                                        >
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${lt.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                                <lt.icon className="h-5 w-5 text-white" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-sm font-semibold">{leave.employee?.name || 'Employee'}</p>
                                                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                        {leave.employee?.dept || ''}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {lt.label} · {leave.fromDate} to {leave.toDate} · <span className="font-semibold">{leave.days} day{leave.days > 1 ? 's' : ''}</span>
                                                </p>
                                                <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">{leave.reason}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className={cn('flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full', sc.className)}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {sc.label}
                                                </span>
                                                {leave.status === 'pending' && (
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button size="sm" className="h-7 text-xs bg-green-500 hover:bg-green-600 text-white px-3"
                                                            onClick={() => approveMutation.mutate({ id: leave._id, action: 'approve' })}>
                                                            ✓
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="h-7 text-xs border-red-300 text-red-600 hover:bg-red-50 px-3"
                                                            onClick={() => approveMutation.mutate({ id: leave._id, action: 'reject' })}>
                                                            ✗
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {displayLeaves.length === 0 && (
                                <div className="text-center py-12">
                                    <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground">No {filter !== 'all' ? filter : ''} leave requests found</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Apply Modal */}
            <AnimatePresence>
                {showApplyModal && (
                    <ApplyLeaveModal
                        onClose={() => setShowApplyModal(false)}
                        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['leaves'] })}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
