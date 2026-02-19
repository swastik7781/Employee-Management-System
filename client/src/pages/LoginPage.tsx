import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, Mail, Lock, Eye, EyeOff, Shield, Zap,
    ChevronRight, Star, TrendingUp, Users, BarChart2, CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const FEATURES = [
    { icon: Users, text: 'AI-powered workforce analytics' },
    { icon: Shield, text: 'Enterprise-grade security' },
    { icon: TrendingUp, text: 'Real-time performance insights' },
    { icon: BarChart2, text: 'Advanced reporting & OKR tracking' },
];

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { toast.error('Please fill in all fields'); return; }
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { user, token, refreshToken } = response.data.data;
            login(user, token, refreshToken);
            toast.success(`Welcome back, ${user.firstName}! 👋`);
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fillDemo = (role: 'admin' | 'hr' | 'employee') => {
        const creds = {
            admin: { email: 'admin@swastikindustries.com', password: 'Admin@123' },
            hr: { email: 'rahul.iyer100@swastikindustries.com', password: 'Employee@123' },
            employee: { email: 'aditya.shah101@swastikindustries.com', password: 'Employee@123' },
        };
        setEmail(creds[role].email);
        setPassword(creds[role].password);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif' }}>

            {/* ─── LEFT BRANDING PANEL ─── */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55 }}
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 55%, #9333ea 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '48px',
                }}
                className="hidden lg:flex"
            >
                {/* Orbs */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 9, repeat: Infinity }}
                        style={{
                            position: 'absolute', top: -100, left: -100,
                            width: 500, height: 500, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.15)', filter: 'blur(70px)',
                        }}
                    />
                    <motion.div
                        animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
                        transition={{ duration: 12, repeat: Infinity }}
                        style={{
                            position: 'absolute', bottom: -100, right: -100,
                            width: 500, height: 500, borderRadius: '50%',
                            background: 'rgba(147,51,234,0.35)', filter: 'blur(80px)',
                        }}
                    />
                </div>

                {/* Logo */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: 16,
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Building2 style={{ width: 28, height: 28, color: '#fff' }} />
                        </div>
                        <div>
                            <p style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: 0, lineHeight: 1.1 }}>WorkSphere Pro</p>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0, marginTop: 2 }}>Swastik Industries</p>
                        </div>
                    </div>
                </div>

                {/* Hero content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)',
                        borderRadius: 999, padding: '8px 18px', marginBottom: 32,
                        width: 'fit-content',
                    }}>
                        <Zap style={{ width: 17, height: 17, color: '#fde047' }} />
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>AI-Powered HR Platform</span>
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        color: '#fff', fontWeight: 900,
                        fontSize: 'clamp(36px, 3.5vw, 56px)',
                        lineHeight: 1.15, margin: 0, marginBottom: 20,
                    }}>
                        The Future of<br />
                        <span style={{ color: '#fde047' }}>Workforce Management</span>
                    </h1>

                    <p style={{
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: 'clamp(15px, 1.2vw, 18px)',
                        lineHeight: 1.65, margin: 0, marginBottom: 44,
                        maxWidth: 480,
                    }}>
                        Transform your HR operations with intelligent automation, predictive analytics, and real-time workforce insights.
                    </p>

                    {/* Feature list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {FEATURES.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                style={{ display: 'flex', alignItems: 'center', gap: 14 }}
                            >
                                <div style={{
                                    width: 38, height: 38, borderRadius: 10,
                                    background: 'rgba(255,255,255,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <f.icon style={{ width: 19, height: 19, color: '#fff' }} />
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.87)', fontSize: 16 }}>{f.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Social proof */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 18,
                        background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(12px)',
                        borderRadius: 18, padding: '18px 24px',
                    }}>
                        <div style={{ display: 'flex' }}>
                            {['RS', 'PP', 'AK', 'SG', 'DS'].map((init, i) => (
                                <div key={i} style={{
                                    width: 40, height: 40, borderRadius: '50%',
                                    border: '2px solid rgba(255,255,255,0.4)',
                                    background: 'rgba(255,255,255,0.25)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 700, color: '#fff',
                                    marginLeft: i === 0 ? 0 : -10,
                                }}>
                                    {init}
                                </div>
                            ))}
                        </div>
                        <div>
                            <p style={{ color: '#fff', fontWeight: 600, fontSize: 15, margin: 0 }}>Trusted by 95+ employees</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} style={{ width: 13, height: 13, fill: '#facc15', color: '#facc15' }} />
                                ))}
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginLeft: 6 }}>4.9/5 · Swastik Industries</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ─── RIGHT FORM PANEL ─── */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55 }}
                style={{
                    width: '100%',
                    maxWidth: 'min(500px, 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px 40px',
                    background: 'var(--background, #ffffff)',
                    flexShrink: 0,
                }}
                className="lg:w-[500px] xl:w-[540px]"
            >
                <div style={{ width: '100%', maxWidth: 420 }}>

                    {/* Mobile logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }} className="lg:hidden">
                        <div style={{
                            width: 46, height: 46,
                            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                            borderRadius: 14,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Building2 style={{ width: 26, height: 26, color: '#fff' }} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 800, fontSize: 17, margin: 0 }}>WorkSphere Pro</p>
                            <p style={{ fontSize: 13, color: '#6b7280', margin: 0, marginTop: 1 }}>Swastik Industries</p>
                        </div>
                    </div>

                    {/* Heading */}
                    <div style={{ marginBottom: 36 }}>
                        <h2 style={{ fontWeight: 900, fontSize: 34, margin: 0, marginBottom: 8, letterSpacing: '-0.5px' }}>
                            Welcome back 👋
                        </h2>
                        <p style={{ fontSize: 17, color: '#6b7280', margin: 0 }}>
                            Sign in to your WorkSphere account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{
                                    position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                                    width: 20, height: 20, color: '#9ca3af',
                                }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@swastikindustries.com"
                                    required
                                    style={{
                                        width: '100%', height: 52,
                                        paddingLeft: 48, paddingRight: 16,
                                        fontSize: 16, borderRadius: 14,
                                        border: '2px solid #e5e7eb',
                                        background: 'transparent',
                                        outline: 'none', boxSizing: 'border-box',
                                        color: 'inherit',
                                        transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <label style={{ fontWeight: 700, fontSize: 15 }}>Password</label>
                                <button type="button" style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    fontSize: 14, color: '#7c3aed', fontWeight: 600, padding: 0,
                                }}>
                                    Forgot password?
                                </button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{
                                    position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                                    width: 20, height: 20, color: '#9ca3af',
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%', height: 52,
                                        paddingLeft: 48, paddingRight: 52,
                                        fontSize: 16, borderRadius: 14,
                                        border: '2px solid #e5e7eb',
                                        background: 'transparent',
                                        outline: 'none', boxSizing: 'border-box',
                                        color: 'inherit',
                                        transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                                        color: '#9ca3af', display: 'flex', alignItems: 'center',
                                    }}
                                >
                                    {showPassword
                                        ? <EyeOff style={{ width: 20, height: 20 }} />
                                        : <Eye style={{ width: 20, height: 20 }} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                            style={{
                                width: '100%', height: 54,
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                border: 'none', borderRadius: 14,
                                color: '#fff', fontWeight: 800, fontSize: 17,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.75 : 1,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: '0 8px 30px rgba(124,58,237,0.35)',
                                transition: 'box-shadow 0.2s, opacity 0.2s',
                                letterSpacing: '0.01em',
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.span key="ld" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{
                                            width: 22, height: 22, borderRadius: '50%',
                                            border: '3px solid rgba(255,255,255,0.3)',
                                            borderTopColor: '#fff',
                                            animation: 'spin 0.7s linear infinite',
                                        }} />
                                        Signing in…
                                    </motion.span>
                                ) : (
                                    <motion.span key="si" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        Sign In <ChevronRight style={{ width: 22, height: 22 }} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </form>

                    {/* Demo credentials */}
                    <div style={{
                        marginTop: 28, padding: '20px 22px',
                        borderRadius: 16, border: '2px dashed #e5e7eb',
                        background: '#f9fafb',
                    }}>
                        <p style={{
                            textAlign: 'center', fontWeight: 700, fontSize: 15,
                            color: '#6b7280', margin: 0, marginBottom: 12,
                        }}>
                            🚀 Quick Demo Access
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                            {(['admin', 'hr', 'employee'] as const).map(role => (
                                <button
                                    key={role}
                                    onClick={() => fillDemo(role)}
                                    style={{
                                        padding: '10px 8px',
                                        borderRadius: 12,
                                        border: '2px solid #e5e7eb',
                                        background: '#fff',
                                        cursor: 'pointer',
                                        fontSize: 14, fontWeight: 700,
                                        color: '#374151',
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => {
                                        (e.target as HTMLButtonElement).style.borderColor = '#7c3aed';
                                        (e.target as HTMLButtonElement).style.color = '#7c3aed';
                                    }}
                                    onMouseLeave={e => {
                                        (e.target as HTMLButtonElement).style.borderColor = '#e5e7eb';
                                        (e.target as HTMLButtonElement).style.color = '#374151';
                                    }}
                                >
                                    {role === 'admin' ? '👑 Admin' : role === 'hr' ? '👤 HR' : '🧑‍💼 Emp'}
                                </button>
                            ))}
                        </div>
                        <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', margin: 0, marginTop: 10 }}>
                            Click any role to auto-fill credentials
                        </p>
                    </div>

                    <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', marginTop: 28, marginBottom: 0 }}>
                        © 2026 Swastik Industries · WorkSphere Pro v2.0
                    </p>
                </div>
            </motion.div>

            {/* Spin animation */}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
