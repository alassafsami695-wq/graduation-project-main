"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ArrowUpRight,
    ShieldCheck,
    Users,
    BookOpen,
    CircleDollarSign,
    TrendingUp,
    Plus,
    LayoutDashboard,
    Settings,
    Search
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

interface AdminDashboardClientProps {
    stats: any;
}

const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ stats }) => {
    return (
        <div className="flex flex-col gap-10">
            {/* Header Section with Always Visible Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-3">
                        <LayoutDashboard className="w-8 h-8 text-primary" />
                        لوحة تحكم المسؤول
                    </h1>
                    <p className="text-foreground-muted mt-1 text-sm font-medium">نظرة عامة على الأنظمة والمستخدمين</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group flex-1 md:flex-none">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="بحث سريع..."
                            className="bg-bg-secondary border border-border rounded-2xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all w-full md:w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95">
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">إضافة جديدة</span>
                    </button>
                    <button className="p-3 bg-bg-secondary border border-border rounded-2xl hover:border-primary/50 transition-all">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Quick Actions Bar - Always Visible */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[
                    { label: "إضافة فيديو", color: "bg-primary/10 text-primary" },
                    { label: "مراجعة طالب", color: "bg-indigo-500/10 text-indigo-500" },
                    { label: "سحب أرباح", color: "bg-secondary/10 text-secondary" },
                    { label: "تعديل إعدادات", color: "bg-rose-500/10 text-rose-500" },
                    { label: "تقارير النظام", color: "bg-amber-500/10 text-amber-500", hideOnMobile: true },
                ].map((action, i) => (
                    <button key={i} className={`p-4 rounded-2xl font-bold text-sm ${action.color} hover:scale-105 transition-all text-center border border-transparent hover:border-current/20 ${action.hideOnMobile ? 'hidden lg:block' : ''}`}>
                        {action.label}
                    </button>
                ))}
            </div>

            {/* Statistics Row - Custom Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    label="إجمالي الطلاب"
                    value={stats?.total_students || "0"}
                    icon={Users}
                    color="primary"
                    trend="+12% هذا الشهر"
                />
                <StatsCard
                    label="الدورات النشطة"
                    value={stats?.total_courses || "0"}
                    icon={BookOpen}
                    color="indigo"
                    trend="+5% أسبوعياً"
                />
                <StatsCard
                    label="إجمالي المدرسين"
                    value={`${stats?.total_teachers || "0"}`}
                    icon={CircleDollarSign}
                    color="secondary"
                    trend="+18% هذا العام"
                />
                <StatsCard
                    label="إجمالي الايرادات"
                    value={`$${stats?.total_revenue || "0"}`}
                    icon={TrendingUp}
                    color="rose"
                    trend="+2.4% اليوم"
                />
            </div>

            {/* Main Content Stack - One Column */}
            <div className="flex flex-col gap-8">
                {/* Latest Activity Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-bg-secondary border border-border rounded-3xl p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black">آخر المستخدمين المنضمين</h3>
                            <p className="text-sm text-foreground-muted mt-1">تتبع آخر انضمامات الطلاب والمعلمين على المنصة</p>
                        </div>
                        <button className="flex items-center gap-2 text-sm font-bold text-primary group">
                            عرض الكل <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-bg-primary rounded-2xl border border-border/50 hover:border-primary/30 transition-all group shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 group-hover:bg-primary/5 transition-colors" />
                                    <div>
                                        <p className="text-sm font-bold group-hover:text-primary transition-colors">مستخدم جديد رقم {i}</p>
                                        <p className="text-[10px] text-foreground-muted mt-0.5">انضم قبل {i} دقيقة</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-bold rounded-xl whitespace-nowrap">طالب</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* System Health Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-bg-secondary border border-border rounded-3xl p-8 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16" />

                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-green-500/10 rounded-2xl">
                            <ShieldCheck className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black">حالة النظام</h3>
                            <p className="text-sm text-green-500 font-bold">كل شيء يعمل بامتياز</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-foreground-muted">أداء الخادم الأساسي</span>
                                <span className="text-primary p-1 bg-primary/5 rounded-lg px-2">99.9%</span>
                            </div>
                            <div className="h-3 w-full bg-bg-primary rounded-full overflow-hidden border border-border/50">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "99.9%" }}
                                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-foreground-muted">استهلاك قاعدة البيانات</span>
                                <span className="text-indigo-500 p-1 bg-indigo-500/5 rounded-lg px-2">42%</span>
                            </div>
                            <div className="h-3 w-full bg-bg-primary rounded-full overflow-hidden border border-border/50">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "42%" }}
                                    className="h-full bg-indigo-500 rounded-full"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-foreground-muted">مساحة التخزين المستخدمة</span>
                                <span className="text-secondary p-1 bg-secondary/5 rounded-lg px-2">68%</span>
                            </div>
                            <div className="h-3 w-full bg-bg-primary rounded-full overflow-hidden border border-border/50">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "68%" }}
                                    className="h-full bg-secondary rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboardClient;
