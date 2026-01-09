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
