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
import StatsCard from "@/components/cards/StatsCard";

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
                {/* Sections removed: Latest Activity, System Health */}
            </div>
        </div>
    );
};

export default AdminDashboardClient;
