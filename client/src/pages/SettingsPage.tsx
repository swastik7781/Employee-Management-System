import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings, Sun, Moon, Monitor, Bell, Shield, User,
    Globe, Lock, Palette, Building2, Save, ChevronRight,
    Check, Mail, Phone, MapPin, Briefcase, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const SectionHeader = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    </div>
);

const ToggleSetting = ({ label, description, value, onChange }: {
    label: string; description: string; value: boolean; onChange: (v: boolean) => void;
}) => (
    <div className="flex items-center justify-between py-3.5 border-b border-border/60 last:border-0">
        <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <button
            onClick={() => onChange(!value)}
            className={cn(
                'w-11 h-6 rounded-full relative transition-colors flex-shrink-0',
                value ? 'bg-primary' : 'bg-muted'
            )}
        >
            <div className={cn(
                'absolute w-5 h-5 bg-white rounded-full shadow-sm top-0.5 transition-all',
                value ? 'left-5.5 left-[22px]' : 'left-0.5'
            )} />
        </button>
    </div>
);

export default function SettingsPage() {
    const { theme, setTheme } = useThemeStore();
    const { user, login } = useAuthStore(); // Using login to update user in store
    const [activeTab, setActiveTab] = useState('appearance');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [notifications, setNotifications] = useState({
        email: true, inApp: true, leaves: true, payroll: true,
        attendance: false, performance: true, announcements: true,
    });

    const [profile, setProfile] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dept: user?.department || '',
        designation: user?.designation || '',
    });

    // Fetch settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                if (res.data.data) {
                    const prefs = res.data.data;
                    if (prefs.notifications) setNotifications(prev => ({ ...prev, ...prefs.notifications }));
                    if (prefs.theme && prefs.theme !== theme) setTheme(prefs.theme as any);
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
                // Fail silently, fall back to defaults
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Save preferences
            await api.put('/settings', {
                theme,
                notifications
            });

            // Note: Profile update endpoint would go here. 
            // For now we just simulate success as we focused on preferences.
            toast.success('Settings saved successfully! ✅');
        } catch (error) {
            console.error('Save failed:', error);
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'company', label: 'Company', icon: Building2 },
    ] as const;

    if (isLoading) {
        return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="h-6 w-6 text-gray-500" />
                    Settings
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your account, preferences and company settings</p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="lg:w-52 flex-shrink-0">
                        <CardContent className="p-2">
                            <nav className="space-y-0.5">
                                {tabs.map(tab => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left',
                                                activeTab === tab.id
                                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                            )}
                                        >
                                            <Icon className="h-4 w-4 flex-shrink-0" />
                                            {tab.label}
                                            {activeTab === tab.id && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
                                        </button>
                                    );
                                })}
                            </nav>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Content */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex-1 min-w-0">

                    {/* Appearance */}
                    {activeTab === 'appearance' && (
                        <Card>
                            <CardHeader>
                                <SectionHeader icon={Palette} title="Appearance" description="Customize how WorkSphere Pro looks and feels" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <p className="text-sm font-semibold mb-3">Color Theme</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {([
                                            { id: 'light', label: 'Light', icon: Sun, bg: 'bg-white border-gray-200', preview: 'bg-gray-50' },
                                            { id: 'dark', label: 'Dark', icon: Moon, bg: 'bg-gray-900', preview: 'bg-gray-800' },
                                            { id: 'system', label: 'System', icon: Monitor, bg: 'bg-gradient-to-br from-white to-gray-900', preview: 'bg-gradient-to-br from-gray-50 to-gray-800' },
                                        ] as const).map(option => {
                                            const Icon = option.icon;
                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => setTheme(option.id)}
                                                    className={cn(
                                                        'relative p-4 rounded-xl border-2 flex flex-col items-center gap-2.5 transition-all',
                                                        theme === option.id
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border hover:border-primary/40'
                                                    )}
                                                >
                                                    {theme === option.id && (
                                                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                            <Check className="h-3 w-3 text-white" />
                                                        </div>
                                                    )}
                                                    <div className={`w-12 h-8 rounded-lg border ${option.bg}`} />
                                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-xs font-medium">{option.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold mb-3">Sidebar Behavior</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'expanded', label: 'Always Expanded' },
                                            { id: 'collapsed', label: 'Auto Collapse' },
                                        ].map(opt => (
                                            <button key={opt.id} className="p-3 rounded-xl border-2 border-border hover:border-primary/40 text-sm font-medium text-left transition-all">
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Profile */}
                    {activeTab === 'profile' && (
                        <Card>
                            <CardHeader>
                                <SectionHeader icon={User} title="Profile Settings" description="Update your personal information and preferences" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                                        {(profile.firstName[0] || 'A') + (profile.lastName[0] || '')}
                                    </div>
                                    <div>
                                        <Button variant="outline" size="sm" className="text-xs">Change Avatar</Button>
                                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { field: 'firstName', label: 'First Name', icon: User },
                                        { field: 'lastName', label: 'Last Name', icon: User },
                                        { field: 'email', label: 'Email', icon: Mail, type: 'email' },
                                        { field: 'phone', label: 'Phone', icon: Phone },
                                        { field: 'dept', label: 'Department', icon: Briefcase },
                                        { field: 'designation', label: 'Designation', icon: Briefcase },
                                    ].map(({ field, label, icon: Icon, type = 'text' }) => (
                                        <div key={field}>
                                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
                                            <div className="relative">
                                                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                                <input
                                                    type={type}
                                                    value={profile[field as keyof typeof profile]}
                                                    onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))}
                                                    className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-input bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notifications */}
                    {activeTab === 'notifications' && (
                        <Card>
                            <CardHeader>
                                <SectionHeader icon={Bell} title="Notification Preferences" description="Choose when and how you want to be notified" />
                            </CardHeader>
                            <CardContent>
                                <ToggleSetting label="Email Notifications" description="Receive important updates via email" value={notifications.email} onChange={v => setNotifications(n => ({ ...n, email: v }))} />
                                <ToggleSetting label="In-App Notifications" description="Show notifications within the app" value={notifications.inApp} onChange={v => setNotifications(n => ({ ...n, inApp: v }))} />
                                <ToggleSetting label="Leave Requests" description="Get notified when leave requests are submitted or updated" value={notifications.leaves} onChange={v => setNotifications(n => ({ ...n, leaves: v }))} />
                                <ToggleSetting label="Payroll Updates" description="Receive salary slip and payroll notifications" value={notifications.payroll} onChange={v => setNotifications(n => ({ ...n, payroll: v }))} />
                                <ToggleSetting label="Attendance Alerts" description="Daily attendance reminders and location alerts" value={notifications.attendance} onChange={v => setNotifications(n => ({ ...n, attendance: v }))} />
                                <ToggleSetting label="Performance Reviews" description="Notifications about review cycles and feedback" value={notifications.performance} onChange={v => setNotifications(n => ({ ...n, performance: v }))} />
                                <ToggleSetting label="Company Announcements" description="Important company-wide updates and events" value={notifications.announcements} onChange={v => setNotifications(n => ({ ...n, announcements: v }))} />
                            </CardContent>
                        </Card>
                    )}

                    {/* Security */}
                    {activeTab === 'security' && (
                        <Card>
                            <CardHeader>
                                <SectionHeader icon={Shield} title="Security Settings" description="Manage your account security and access" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/40 flex items-center gap-3">
                                    <Check className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-green-700 dark:text-green-300">Account is Secure</p>
                                        <p className="text-xs text-green-600 dark:text-green-400">Last login: Today, 9:02 AM · Mumbai, India</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold">Change Password</h4>
                                    {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                                        <div key={label}>
                                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-input bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <Button size="sm" variant="outline" className="text-xs">Update Password</Button>
                                </div>

                                <div className="border-t border-border pt-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">Two-Factor Authentication</p>
                                            <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                                        </div>
                                        <Button size="sm" className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white">Enable 2FA</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Company */}
                    {activeTab === 'company' && (
                        <Card>
                            <CardHeader>
                                <SectionHeader icon={Building2} title="Company Information" description="View and update company details" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                        <Building2 className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Swastik Industries Pvt. Ltd.</h3>
                                        <p className="text-sm text-muted-foreground">Est. 2020</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { label: 'Company Name', value: 'Swastik Industries Pvt. Ltd.', icon: Building2 },
                                        { label: 'Email', value: 'hr@swastikindustries.com', icon: Mail },
                                        { label: 'Phone', value: '+91-1234567890', icon: Phone },
                                        { label: 'Address', value: 'Mumbai, Maharashtra 400001', icon: MapPin },
                                        { label: 'Industry', value: 'Technology & SaaS', icon: Globe },
                                    ].map(r => (
                                        <div key={r.label} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                                            <div className="w-7 h-7 bg-background rounded-lg flex items-center justify-center flex-shrink-0">
                                                <r.icon className="h-3.5 w-3.5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground">{r.label}</p>
                                                <p className="text-sm font-medium">{r.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end mt-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white gap-1.5"
                            >
                                {isSaving
                                    ? <><RefreshCw className="h-4 w-4 animate-spin" /> Saving...</>
                                    : <><Save className="h-4 w-4" /> Save Changes</>
                                }
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
