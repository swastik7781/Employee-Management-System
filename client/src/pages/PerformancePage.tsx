import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, Award, Star, Target, Users, Plus, ChevronUp,
    Filter, ArrowRight, BarChart2, Brain, Flame, CheckCircle2,
    Clock, MessageSquare, ThumbsUp, Minus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// Star Rating Component
const StarRating = ({ rating, max = 5 }: { rating: number; max?: number }) => (
    <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
            <Star
                key={i}
                className={cn('h-3.5 w-3.5', i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30')}
            />
        ))}
        <span className="text-xs font-bold ml-1.5">{rating.toFixed(1)}</span>
    </div>
);

// OKR Progress
const OKRCard = ({ okr, delay }: { okr: any; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all"
    >
        <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-violet-500 flex-shrink-0" />
                    <p className="text-sm font-semibold truncate">{okr.objective}</p>
                </div>
                <p className="text-xs text-muted-foreground pl-6">{okr.keyResult}</p>
            </div>
            <span className={cn(
                'ml-3 text-sm font-bold flex-shrink-0',
                okr.progress >= 80 ? 'text-green-500' : okr.progress >= 50 ? 'text-orange-500' : 'text-red-500'
            )}>
                {okr.progress}%
            </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${okr.progress}%` }}
                transition={{ duration: 1.2, delay: delay + 0.2 }}
                className={cn(
                    'h-full rounded-full',
                    okr.progress >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                        okr.progress >= 50 ? 'bg-gradient-to-r from-orange-400 to-amber-500' :
                            'bg-gradient-to-r from-red-400 to-rose-500'
                )}
            />
        </div>
        <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">Due: {okr.dueDate}</span>
            <span className={cn(
                'text-[10px] px-2 py-0.5 rounded-full font-medium',
                okr.status === 'on-track' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                    okr.status === 'at-risk' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' :
                        'bg-red-100 text-red-600 dark:bg-red-900/30'
            )}>
                {okr.status === 'on-track' ? '✓ On Track' : okr.status === 'at-risk' ? '⚠ At Risk' : '✗ Behind'}
            </span>
        </div>
    </motion.div>
);

export default function PerformancePage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'okrs' | 'feedback'>('overview');

    const performanceData = [
        { name: 'Rajesh Sharma', dept: 'Engineering', rating: 4.8, reviews: 3, trend: 'up', score: 96, status: 'outstanding' },
        { name: 'Priya Patel', dept: 'HR', rating: 4.5, reviews: 2, trend: 'up', score: 88, status: 'excellent' },
        { name: 'Amit Kumar', dept: 'Sales', rating: 3.9, reviews: 3, trend: 'down', score: 74, status: 'good' },
        { name: 'Sneha Gupta', dept: 'Finance', rating: 4.2, reviews: 2, trend: 'stable', score: 82, status: 'excellent' },
        { name: 'Dev Singh', dept: 'Engineering', rating: 4.7, reviews: 3, trend: 'up', score: 93, status: 'outstanding' },
    ];

    const okrs = [
        { objective: 'Increase Platform Reliability to 99.9%', keyResult: 'Reduce P1 incidents to < 2/month', progress: 87, dueDate: 'Mar 31', status: 'on-track' },
        { objective: 'Expand Customer Base by 40%', keyResult: 'Close 15 new enterprise deals', progress: 53, dueDate: 'Jun 30', status: 'at-risk' },
        { objective: 'Improve Employee Engagement Score', keyResult: 'Achieve NPS > 50 in Q1 survey', progress: 38, dueDate: 'Mar 15', status: 'behind' },
        { objective: 'Launch Mobile App v2.0', keyResult: '5 new premium features shipped', progress: 80, dueDate: 'Apr 30', status: 'on-track' },
    ];

    const feedbackItems = [
        { from: 'Rajesh Sharma', to: 'Dev Singh', type: 'kudos', message: 'Outstanding work on the infrastructure migration! Delivered ahead of schedule!', time: '2h ago' },
        { from: 'Priya Patel', to: 'Sneha Gupta', type: 'constructive', message: 'Could improve on documentation practices. The financial reports need more detail.', time: '1d ago' },
        { from: 'Dev Singh', to: 'Amit Kumar', type: 'kudos', message: 'Closed the biggest deal of the quarter! Amazing persistence and negotiation skills.', time: '2d ago' },
    ];

    const statusColors: Record<string, string> = {
        outstanding: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30',
        excellent: 'bg-green-100 text-green-700 dark:bg-green-900/30',
        good: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30',
        'needs-improvement': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30',
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart2 },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'okrs', label: 'OKRs & Goals', icon: Target },
        { id: 'feedback', label: 'Feedback Wall', icon: MessageSquare },
    ] as const;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-pink-500" />
                        Performance Management
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">360° reviews, OKRs, goals and continuous feedback</p>
                </div>
                <Button
                    className="bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg gap-1.5 text-xs"
                    onClick={() => toast('New Review module coming soon!', { icon: '📝' })}
                >
                    <Plus className="h-3.5 w-3.5" /> Start Review
                </Button>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Avg Rating', value: '4.4', sub: 'Out of 5.0', icon: Star, gradient: 'bg-gradient-to-br from-amber-500 to-orange-600' },
                    { label: 'Reviews Done', value: '78', sub: 'This quarter', icon: CheckCircle2, gradient: 'bg-gradient-to-br from-green-500 to-emerald-600' },
                    { label: 'OKRs On Track', value: '67%', sub: '8 of 12 goals', icon: Target, gradient: 'bg-gradient-to-br from-violet-500 to-purple-600' },
                    { label: 'Top Performers', value: '12', sub: 'Promotion candidates', icon: Award, gradient: 'bg-gradient-to-br from-pink-500 to-rose-600' },
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <Card className="hover:shadow-md transition-shadow overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-9 h-9 rounded-xl ${stat.gradient} flex items-center justify-center shadow-sm`}>
                                        <stat.icon className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-2xl font-bold">{stat.value}</span>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{stat.sub}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl w-fit">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all',
                                    activeTab === tab.id
                                        ? 'bg-card shadow-sm text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Team Performance Leaderboard</CardTitle>
                                <CardDescription>Q1 2026 performance rankings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {performanceData.sort((a, b) => b.score - a.score).map((emp, i) => (
                                        <motion.div
                                            key={emp.name}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors group"
                                        >
                                            <div className={cn(
                                                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                                                i === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
                                                    i === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-800' :
                                                        i === 2 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' :
                                                            'bg-muted text-muted-foreground'
                                            )}>
                                                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                                            </div>

                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                {emp.name[0]}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-sm font-semibold">{emp.name}</p>
                                                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{emp.dept}</span>
                                                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium capitalize', statusColors[emp.status])}>
                                                        {emp.status}
                                                    </span>
                                                </div>
                                                <StarRating rating={emp.rating} />
                                            </div>

                                            <div className="text-right flex-shrink-0">
                                                <div className="flex items-center gap-1 justify-end mb-1">
                                                    {emp.trend === 'up' && <ChevronUp className="h-3.5 w-3.5 text-green-500" />}
                                                    {emp.trend === 'down' && <ChevronUp className="h-3.5 w-3.5 text-red-500 rotate-180" />}
                                                    {emp.trend === 'stable' && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
                                                    <span className="text-lg font-bold">{emp.score}</span>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground">{emp.reviews} reviews</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'okrs' && (
                    <motion.div key="okrs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-semibold">OKRs — Q1 2026</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Objectives & Key Results tracking</p>
                            </div>
                            <Button size="sm" variant="outline" className="text-xs gap-1">
                                <Plus className="h-3 w-3" /> Add OKR
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {okrs.map((okr, i) => (
                                <OKRCard key={i} okr={okr} delay={i * 0.08} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'feedback' && (
                    <motion.div key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">Continuous Feedback Wall</CardTitle>
                                        <CardDescription>Real-time peer recognition and constructive feedback</CardDescription>
                                    </div>
                                    <Button size="sm" className="text-xs gap-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white">
                                        <ThumbsUp className="h-3 w-3" /> Give Kudos
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {feedbackItems.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        className={cn(
                                            'p-4 rounded-xl border',
                                            item.type === 'kudos'
                                                ? 'border-amber-200 bg-amber-50/50 dark:border-amber-800/30 dark:bg-amber-900/10'
                                                : 'border-blue-200 bg-blue-50/50 dark:border-blue-800/30 dark:bg-blue-900/10'
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn(
                                                'w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0',
                                                item.type === 'kudos' ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                            )}>
                                                {item.type === 'kudos' ? '🏆' : '💡'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                    <span className="text-sm font-bold">{item.from}</span>
                                                    <span className="text-xs text-muted-foreground">→</span>
                                                    <span className="text-sm font-semibold text-primary">{item.to}</span>
                                                    <span className={cn(
                                                        'text-[10px] px-2 py-0.5 rounded-full ml-auto font-medium',
                                                        item.type === 'kudos' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                                                    )}>
                                                        {item.type === 'kudos' ? '🎉 Kudos' : '💙 Constructive'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground/80">{item.message}</p>
                                                <p className="text-[10px] text-muted-foreground mt-2">{item.time}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'reviews' && (
                    <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-24">
                                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-2xl flex items-center justify-center mb-4">
                                    <Star className="h-8 w-8 text-pink-500" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">360° Review System</h3>
                                <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
                                    Multi-rater performance reviews with self, peer, and manager assessments
                                </p>
                                <Button className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
                                    Start Q1 Review Cycle
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
