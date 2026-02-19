import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Filter, Download, Upload, Users, ChevronDown,
    MoreHorizontal, Mail, Phone, MapPin, Briefcase, X, Eye,
    Edit, Trash2, CheckCircle2, AlertCircle, UserCheck, User,
    Building2, Calendar, Grid3x3, List, SlidersHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { getInitials, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// ========== Types ==========
interface Employee {
    _id: string;
    employeeNumber: string;
    personalInfo: { firstName: string; lastName: string; gender: string; photo?: string; dateOfBirth: string };
    contactInfo: { email: string; phone: string };
    professionalInfo: { designation: string; department: { name: string }; employmentStatus: string; employeeType: string; joiningDate: string; workMode: string };
    isActive: boolean;
}

// ========== Status Badge ==========
const StatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { label: string; className: string }> = {
        active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' },
        inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400' },
        terminated: { label: 'Terminated', className: 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400' },
        'on-leave': { label: 'On Leave', className: 'bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400' },
        resigned: { label: 'Resigned', className: 'bg-yellow-100 text-yellow-600 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400' },
    };
    const c = config[status] || config.inactive;
    return (
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${c.className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {c.label}
        </span>
    );
};

// ========== Employee Card ==========
const EmployeeCard = ({ employee, onView, onEdit, onDelete, delay }: { employee: Employee; onView: () => void; onEdit: () => void; onDelete: () => void; delay: number }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const typeBadge: Record<string, string> = {
        'full-time': 'bg-blue-50 text-blue-600 dark:bg-blue-900/20',
        'part-time': 'bg-amber-50 text-amber-600 dark:bg-amber-900/20',
        'contract': 'bg-purple-50 text-purple-600 dark:bg-purple-900/20',
        'intern': 'bg-pink-50 text-pink-600 dark:bg-pink-900/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay }}
            layout
            whileHover={{ y: -3 }}
        >
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-border/60 overflow-hidden">
                {/* Top gradient strip */}
                <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
                <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                                    {getInitials(employee.personalInfo.firstName, employee.personalInfo.lastName)}
                                </div>
                                <div className={cn(
                                    'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card',
                                    employee.professionalInfo.employmentStatus === 'active' ? 'bg-green-500' :
                                        employee.professionalInfo.employmentStatus === 'on-leave' ? 'bg-orange-500' : 'bg-gray-400'
                                )} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-sm leading-tight">
                                    {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                                </h3>
                                <p className="text-xs text-muted-foreground">{employee.professionalInfo.designation}</p>
                                <p className="text-[10px] text-muted-foreground/60 mt-0.5">#{employee.employeeNumber}</p>
                            </div>
                        </div>

                        {/* Menu */}
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                            <AnimatePresence>
                                {menuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="absolute right-0 top-8 w-40 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden"
                                        >
                                            <button onClick={() => { onView(); setMenuOpen(false); }}
                                                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-accent transition-colors">
                                                <Eye className="h-3.5 w-3.5 text-blue-500" /> View Profile
                                            </button>
                                            <button onClick={() => { onEdit(); setMenuOpen(false); }}
                                                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-accent transition-colors">
                                                <Edit className="h-3.5 w-3.5 text-violet-500" /> Edit
                                            </button>
                                            <div className="border-t border-border" />
                                            <button onClick={() => { onDelete(); setMenuOpen(false); }}
                                                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors">
                                                <Trash2 className="h-3.5 w-3.5" /> Deactivate
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{employee.professionalInfo.department?.name || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{employee.contactInfo.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{employee.contactInfo.phone}</span>
                        </div>
                    </div>

                    {/* Footer badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={employee.professionalInfo.employmentStatus} />
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${typeBadge[employee.professionalInfo.employeeType] || 'bg-gray-100 text-gray-600'}`}>
                            {employee.professionalInfo.employeeType}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                            {employee.professionalInfo.workMode}
                        </span>
                    </div>

                    {/* Action button */}
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-3 text-xs h-7 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={onView}
                    >
                        <Eye className="h-3 w-3 mr-1.5" /> View Full Profile
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// ========== Add Employee Modal ==========
const AddEmployeeModal = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        designation: '', department: '', employeeType: 'full-time',
        joiningDate: new Date().toISOString().split('T')[0],
        workMode: 'office', currentSalary: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await api.post('/employees', {
                userData: { email: form.email, firstName: form.firstName, lastName: form.lastName, employeeId: `EMP${Date.now()}` },
                employeeData: {
                    personalInfo: { firstName: form.firstName, lastName: form.lastName, gender: 'male', dateOfBirth: '1990-01-01', nationality: 'Indian' },
                    contactInfo: { email: form.email, phone: form.phone, currentAddress: { street: 'N/A', city: 'N/A', state: 'N/A', country: 'India', zipCode: '000000' }, permanentAddress: { street: 'N/A', city: 'N/A', state: 'N/A', country: 'India', zipCode: '000000' } },
                    professionalInfo: { designation: form.designation, employeeType: form.employeeType, joiningDate: form.joiningDate, workLocation: 'Mumbai HQ', workMode: form.workMode },
                    salaryInfo: { currentSalary: Number(form.currentSalary) || 50000 },
                },
            });
            toast.success('Employee added successfully! 🎉');
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to add employee');
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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white">Add New Employee</h2>
                            <p className="text-xs text-white/70">Step {step} of 2 · Fill in employee details</p>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    {/* Progress */}
                    <div className="flex gap-2 mt-3">
                        {[1, 2].map(s => (
                            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-white' : 'bg-white/30'}`} />
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">First Name *</label>
                                        <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                                            placeholder="First name" className="input-premium w-full h-9 px-3 text-sm rounded-lg border border-input bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Last Name *</label>
                                        <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                                            placeholder="Last name" className="input-premium w-full h-9 px-3 text-sm rounded-lg border border-input bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Work Email *</label>
                                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        placeholder="email@company.com" className="input-premium w-full h-9 px-3 text-sm rounded-lg border border-input bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone Number</label>
                                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        placeholder="+91-9876543210" className="input-premium w-full h-9 px-3 text-sm rounded-lg border border-input bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Designation *</label>
                                    <input value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                                        placeholder="e.g. Senior Software Engineer" className="input-premium w-full h-9 px-3 text-sm rounded-lg border border-input bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Employee Type</label>
                                        <select value={form.employeeType} onChange={e => setForm(f => ({ ...f, employeeType: e.target.value }))}
                                            className="input-premium w-full h-9 px-3 text-sm rounded-lg border border-input bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                                            <option value="full-time">Full Time</option>
                                            <option value="part-time">Part Time</option>
                                            <option value="contract">Contract</option>
                                            <option value="intern">Intern</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Work Mode</label>
                                        <select value={form.workMode} onChange={e => setForm(f => ({ ...f, workMode: e.target.value }))}
                                            className="input-premium w-full h-9 px-3 text-sm rounded-lg border border-input bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                                            <option value="office">Office</option>
                                            <option value="remote">Remote</option>
                                            <option value="hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Joining Date</label>
                                        <input type="date" value={form.joiningDate} onChange={e => setForm(f => ({ ...f, joiningDate: e.target.value }))}
                                            className="input-premium w-full h-9 px-3 text-sm rounded-lg border border-input bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Monthly Salary (₹)</label>
                                        <input type="number" value={form.currentSalary} onChange={e => setForm(f => ({ ...f, currentSalary: e.target.value }))}
                                            placeholder="50000" className="input-premium w-full h-9 px-3 text-sm rounded-lg border border-input bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={step === 1 ? onClose : () => setStep(1)}>
                        {step === 1 ? 'Cancel' : '← Back'}
                    </Button>
                    {step === 1 ? (
                        <Button onClick={() => setStep(2)} disabled={!form.firstName || !form.email}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                            Continue →
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting || !form.designation}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white min-w-[100px]">
                            {isSubmitting ? (
                                <span className="flex items-center gap-2"><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Saving...</span>
                            ) : '✓ Add Employee'}
                        </Button>
                    )}
                </div>
            </motion.div>
        </>
    );
};

// missing import alias for RefreshCw
import { RefreshCw } from 'lucide-react';

export default function EmployeesPage() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const queryClient = useQueryClient();
    const searchTimer = useRef<ReturnType<typeof setTimeout>>();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            setDebouncedSearch(val);
            setPage(1);
        }, 400);
    };

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['employees', page, debouncedSearch, status],
        queryFn: async () => {
            const params = new URLSearchParams({ page: String(page), limit: '12' });
            if (debouncedSearch) params.append('search', debouncedSearch);
            if (status) params.append('status', status);
            const response = await api.get(`/employees?${params}`);
            return response.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/employees/${id}`),
        onSuccess: () => {
            toast.success('Employee deactivated');
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
        onError: () => toast.error('Failed to deactivate employee'),
    });

    const employees: Employee[] = data?.data || [];
    const pagination = data?.pagination;

    const statuses = [
        { value: '', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'on-leave', label: 'On Leave' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'terminated', label: 'Terminated' },
    ];

    return (
        <div className="space-y-6">
            {/* ======= HEADER ======= */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="h-6 w-6 text-indigo-500" />
                        Employees
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your workforce · {pagination?.total || 0} total employees
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs gap-1.5">
                        <Upload className="h-3.5 w-3.5" /> Import CSV
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs gap-1.5">
                        <Download className="h-3.5 w-3.5" /> Export
                    </Button>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        size="sm"
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow text-xs gap-1.5"
                    >
                        <Plus className="h-3.5 w-3.5" /> Add Employee
                    </Button>
                </div>
            </motion.div>

            {/* ======= FILTERS ======= */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Search */}
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={handleSearchChange}
                                    placeholder="Search by name, email, ID..."
                                    className="w-full h-9 pl-9 pr-3 text-sm bg-muted/50 border border-input rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                                />
                                {isFetching && (
                                    <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground animate-spin" />
                                )}
                            </div>

                            {/* Status filter */}
                            <div className="flex items-center gap-1.5">
                                {statuses.map(s => (
                                    <button
                                        key={s.value}
                                        onClick={() => { setStatus(s.value); setPage(1); }}
                                        className={cn(
                                            'text-xs px-3 py-1.5 rounded-lg border transition-all font-medium',
                                            status === s.value
                                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>

                            <div className="ml-auto flex items-center gap-2">
                                {/* View mode */}
                                <div className="flex items-center bg-muted rounded-lg p-0.5">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={cn('p-1.5 rounded-md transition-all', viewMode === 'grid' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}
                                    >
                                        <Grid3x3 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={cn('p-1.5 rounded-md transition-all', viewMode === 'list' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}
                                    >
                                        <List className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* ======= EMPLOYEE LIST ======= */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn('grid gap-4', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1')}
                    >
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <div className="h-1 skeleton" />
                                <CardContent className="p-5 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="skeleton w-12 h-12 rounded-xl" />
                                        <div className="flex-1">
                                            <div className="skeleton h-3.5 w-24 rounded mb-2" />
                                            <div className="skeleton h-3 w-16 rounded" />
                                        </div>
                                    </div>
                                    <div className="skeleton h-3 w-full rounded" />
                                    <div className="skeleton h-3 w-3/4 rounded" />
                                    <div className="flex gap-2">
                                        <div className="skeleton h-5 w-16 rounded-full" />
                                        <div className="skeleton h-5 w-16 rounded-full" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>
                ) : employees.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-24 text-center"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
                            <Users className="h-10 w-10 text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No employees found</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            {debouncedSearch ? `No results for "${debouncedSearch}"` : 'Start by adding your first employee'}
                        </p>
                        <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                            <Plus className="h-4 w-4 mr-1.5" /> Add First Employee
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn('grid gap-4', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1')}
                    >
                        <AnimatePresence>
                            {employees.map((emp, i) => (
                                <EmployeeCard
                                    key={emp._id}
                                    employee={emp}
                                    delay={i * 0.04}
                                    onView={() => toast('Employee profile view coming soon', { icon: '👤' })}
                                    onEdit={() => toast('Employee edit coming soon', { icon: '✏️' })}
                                    onDelete={() => {
                                        if (confirm('Deactivate this employee?')) {
                                            deleteMutation.mutate(emp._id);
                                        }
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ======= PAGINATION ======= */}
            {pagination && pagination.pages > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between"
                >
                    <p className="text-xs text-muted-foreground">
                        Showing {((page - 1) * 12) + 1}–{Math.min(page * 12, pagination.total)} of {pagination.total} employees
                    </p>
                    <div className="flex items-center gap-1.5">
                        <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1} className="text-xs h-8">
                            ← Prev
                        </Button>
                        {Array.from({ length: Math.min(pagination.pages, 5) }).map((_, i) => {
                            const p = i + 1;
                            return (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={cn(
                                        'w-8 h-8 text-xs rounded-lg transition-all font-medium',
                                        page === p ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent text-muted-foreground'
                                    )}
                                >
                                    {p}
                                </button>
                            );
                        })}
                        <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= pagination.pages} className="text-xs h-8">
                            Next →
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* ======= ADD MODAL ======= */}
            <AnimatePresence>
                {showAddModal && (
                    <AddEmployeeModal
                        onClose={() => setShowAddModal(false)}
                        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['employees'] })}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
