import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign, Download, FileText, ChevronDown, Search,
    TrendingUp, Users, Calendar, RefreshCw, Plus, Eye,
    Printer, Filter, CreditCard, ArrowUpRight, Building2,
    BarChart2, Banknote, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// Payslip Component
const PayslipModal = ({ record, onClose }: { record: any; onClose: () => void }) => {
    const handlePrint = () => window.print();

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Building2 className="h-5 w-5 text-white/80" />
                                <span className="text-white/80 text-sm font-medium">Swastik Industries Pvt. Ltd.</span>
                            </div>
                            <h2 className="text-xl font-bold text-white">Salary Payslip</h2>
                            <p className="text-xs text-white/70">
                                {new Date(record.payPeriod?.startDate || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-white">{formatCurrency(record.netSalary || record.grossSalary)}</p>
                            <p className="text-xs text-white/70">Net Pay</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto">
                    <div className="p-6 space-y-5">
                        {/* Employee Info */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-xl">
                            <div>
                                <p className="text-xs text-muted-foreground">Employee</p>
                                <p className="text-sm font-semibold">{record.employeeName || 'Rajesh Sharma'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Employee ID</p>
                                <p className="text-sm font-semibold">{record.employeeId || 'EMP001'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Designation</p>
                                <p className="text-sm font-semibold">{record.designation || 'Senior Engineer'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Department</p>
                                <p className="text-sm font-semibold">{record.department || 'Engineering'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Working Days</p>
                                <p className="text-sm font-semibold">{record.attendance?.workingDays || 22}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Days Present</p>
                                <p className="text-sm font-semibold">{record.attendance?.daysPresent || 21}</p>
                            </div>
                        </div>

                        {/* Earnings & Deductions */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Earnings */}
                            <div>
                                <h4 className="text-sm font-bold text-green-600 dark:text-green-400 mb-3 flex items-center gap-1.5">
                                    <TrendingUp className="h-3.5 w-3.5" /> Earnings
                                </h4>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Basic Salary', value: record.earnings?.basic || 45000 },
                                        { label: 'HRA', value: record.earnings?.hra || 15000 },
                                        { label: 'Transport', value: record.earnings?.transport || 3000 },
                                        { label: 'Special Allowance', value: record.earnings?.special || 7000 },
                                    ].map(e => (
                                        <div key={e.label} className="flex items-center justify-between text-sm py-1 border-b border-border/50">
                                            <span className="text-muted-foreground text-xs">{e.label}</span>
                                            <span className="font-medium text-xs">{formatCurrency(e.value)}</span>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-between py-1.5 mt-1">
                                        <span className="text-sm font-bold text-green-600">Total Earnings</span>
                                        <span className="text-sm font-bold text-green-600">{formatCurrency(record.grossSalary || 70000)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Deductions */}
                            <div>
                                <h4 className="text-sm font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-1.5">
                                    <TrendingUp className="h-3.5 w-3.5 rotate-180" /> Deductions
                                </h4>
                                <div className="space-y-2">
                                    {[
                                        { label: 'PF (12%)', value: record.deductions?.pf || 5400 },
                                        { label: 'Income Tax (TDS)', value: record.deductions?.tax || 6000 },
                                        { label: 'ESI', value: record.deductions?.esi || 1750 },
                                        { label: 'Loss of Pay', value: record.deductions?.lop || 0 },
                                    ].map(d => (
                                        <div key={d.label} className="flex items-center justify-between text-sm py-1 border-b border-border/50">
                                            <span className="text-muted-foreground text-xs">{d.label}</span>
                                            <span className="font-medium text-xs text-red-500">-{formatCurrency(d.value)}</span>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-between py-1.5 mt-1">
                                        <span className="text-sm font-bold text-red-600">Total Deductions</span>
                                        <span className="text-sm font-bold text-red-600">-{formatCurrency(record.deductions?.total || 13150)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Net Pay */}
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white flex items-center justify-between">
                            <div>
                                <p className="text-sm text-white/80">Net Salary Payable</p>
                                <p className="text-xs text-white/60">After all deductions</p>
                            </div>
                            <p className="text-3xl font-bold">{formatCurrency(record.netSalary || 56850)}</p>
                        </div>

                        <p className="text-center text-[10px] text-muted-foreground/50 italic">
                            This is a computer-generated payslip and does not require a signature.
                        </p>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
                    <Button onClick={handlePrint} className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white gap-1.5">
                        <Printer className="h-4 w-4" /> Print Payslip
                    </Button>
                </div>
            </motion.div>
        </>
    );
};

export default function PayrollPage() {
    const queryClient = useQueryClient();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear] = useState(new Date().getFullYear());
    const [selectedPayslip, setSelectedPayslip] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const { data: payrollData, isLoading } = useQuery({
        queryKey: ['payroll', selectedMonth, selectedYear],
        queryFn: async () => {
            try {
                const r = await api.get(`/payroll?month=${selectedMonth}&year=${selectedYear}`);
                return r.data.data;
            } catch { return null; }
        },
    });

    const processPayroll = async () => {
        setIsProcessing(true);
        try {
            await api.post('/payroll/process', { month: selectedMonth, year: selectedYear });
            toast.success('💰 Payroll processed successfully!');
            queryClient.invalidateQueries({ queryKey: ['payroll'] });
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Payroll processing failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const mockPayrollRecords = [
        { _id: '1', employeeName: 'Rajesh Sharma', employeeId: 'EMP001', designation: 'Senior Engineer', department: 'Engineering', grossSalary: 95000, netSalary: 81850, status: 'paid' },
        { _id: '2', employeeName: 'Priya Patel', employeeId: 'EMP002', designation: 'HR Manager', department: 'Human Resources', grossSalary: 75000, netSalary: 64200, status: 'processing' },
        { _id: '3', employeeName: 'Amit Kumar', employeeId: 'EMP003', designation: 'Sales Executive', department: 'Sales', grossSalary: 55000, netSalary: 47355, status: 'paid' },
        { _id: '4', employeeName: 'Sneha Gupta', employeeId: 'EMP004', designation: 'Financial Analyst', department: 'Finance', grossSalary: 80000, netSalary: 68800, status: 'pending' },
        { _id: '5', employeeName: 'Dev Singh', employeeId: 'EMP005', designation: 'Team Lead', department: 'Engineering', grossSalary: 110000, netSalary: 94050, status: 'paid' },
    ];

    const records = payrollData?.length ? payrollData : mockPayrollRecords;
    const totalGross = records.reduce((s: number, r: any) => s + (r.grossSalary || 0), 0);
    const totalNet = records.reduce((s: number, r: any) => s + (r.netSalary || 0), 0);
    const totalDeductions = totalGross - totalNet;
    const paidCount = records.filter((r: any) => r.status === 'paid').length;

    const statusBadge: Record<string, { label: string; className: string; icon: any }> = {
        paid: { label: 'Paid', className: 'bg-green-100 text-green-700 dark:bg-green-900/30', icon: CheckCircle2 },
        processing: { label: 'Processing', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30', icon: RefreshCw },
        pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30', icon: Clock },
        failed: { label: 'Failed', className: 'bg-red-100 text-red-700 dark:bg-red-900/30', icon: AlertCircle },
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-blue-500" />
                        Payroll
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Process salaries, manage payslips and deductions</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs gap-1.5">
                        <Download className="h-3.5 w-3.5" /> Export Report
                    </Button>
                    <Button
                        onClick={processPayroll}
                        disabled={isProcessing}
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg gap-1.5 text-xs"
                    >
                        {isProcessing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Banknote className="h-3.5 w-3.5" />}
                        {isProcessing ? 'Processing...' : 'Run Payroll'}
                    </Button>
                </div>
            </motion.div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Gross', value: formatCurrency(totalGross), icon: Banknote, gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600', sub: `${records.length} employees` },
                    { label: 'Total Net Pay', value: formatCurrency(totalNet), icon: CreditCard, gradient: 'bg-gradient-to-br from-green-500 to-emerald-600', sub: 'After all deductions' },
                    { label: 'Total Deductions', value: formatCurrency(totalDeductions), icon: TrendingUp, gradient: 'bg-gradient-to-br from-red-500 to-rose-600', sub: 'Tax + PF + ESI' },
                    { label: 'Paid Out', value: `${paidCount}/${records.length}`, icon: CheckCircle2, gradient: 'bg-gradient-to-br from-violet-500 to-purple-600', sub: 'Employees paid' },
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <Card className="hover:shadow-md transition-shadow overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-9 h-9 rounded-xl ${stat.gradient} flex items-center justify-center shadow-sm`}>
                                        <stat.icon className="h-4 w-4 text-white" />
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                                <p className="text-lg font-bold">{stat.value}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Month Selector */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm font-medium">Payroll Period:</span>
                            <div className="flex items-center gap-1 flex-wrap">
                                {months.map((month, i) => (
                                    <button
                                        key={month}
                                        onClick={() => setSelectedMonth(i + 1)}
                                        className={cn(
                                            'text-xs px-3 py-1.5 rounded-lg border transition-all font-medium',
                                            selectedMonth === i + 1
                                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                        )}
                                    >
                                        {month}
                                    </button>
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground ml-auto">{selectedYear}</span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Payroll Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">
                                    Payroll — {months[selectedMonth - 1]} {selectedYear}
                                </CardTitle>
                                <CardDescription>{records.length} employees · {formatCurrency(totalNet)} total net pay</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        {['Employee', 'Department', 'Gross Salary', 'Deductions', 'Net Pay', 'Status', 'Action'].map(h => (
                                            <th key={h} className="text-left text-xs font-semibold text-muted-foreground py-3 px-3 whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((record: any, i: number) => {
                                        const sb = statusBadge[record.status] || statusBadge.pending;
                                        const StatusIcon = sb.icon;
                                        return (
                                            <motion.tr
                                                key={record._id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 + i * 0.05 }}
                                                className="border-b border-border/50 hover:bg-accent/30 transition-colors group"
                                            >
                                                <td className="py-3.5 px-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                            {record.employeeName?.[0] || 'E'}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">{record.employeeName}</p>
                                                            <p className="text-[10px] text-muted-foreground">{record.employeeId} · {record.designation}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-3">
                                                    <span className="text-xs text-muted-foreground">{record.department}</span>
                                                </td>
                                                <td className="py-3.5 px-3">
                                                    <span className="text-sm font-medium">{formatCurrency(record.grossSalary)}</span>
                                                </td>
                                                <td className="py-3.5 px-3">
                                                    <span className="text-sm text-red-500">-{formatCurrency(record.grossSalary - record.netSalary)}</span>
                                                </td>
                                                <td className="py-3.5 px-3">
                                                    <span className="text-sm font-bold text-green-600">{formatCurrency(record.netSalary)}</span>
                                                </td>
                                                <td className="py-3.5 px-3">
                                                    <span className={cn('flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full w-fit', sb.className)}>
                                                        <StatusIcon className={cn('h-3 w-3', record.status === 'processing' && 'animate-spin')} />
                                                        {sb.label}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-3">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                                                        onClick={() => setSelectedPayslip(record)}
                                                    >
                                                        <Eye className="h-3.5 w-3.5" /> Payslip
                                                    </Button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Payslip Modal */}
            <AnimatePresence>
                {selectedPayslip && (
                    <PayslipModal record={selectedPayslip} onClose={() => setSelectedPayslip(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}
