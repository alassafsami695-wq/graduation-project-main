"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Users,
    BookOpen,
    Star,
    MessageSquare,
    PlayCircle,
    Clock,
    Plus,
    Calendar,
    ChevronLeft,
    BarChart3,
    Trophy
} from "lucide-react";
import StatsCard from "@/components/cards/StatsCard";

interface TeacherDashboardClientProps {
    stats: any;
}

const TeacherDashboardClient: React.FC<TeacherDashboardClientProps> = ({ stats }) => {
    // Assuming the stats structure for teachers might be similar or from getStats()
    const teacherStats = stats || {};

    console.log("teacherStats", teacherStats);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-10"
        >
            {/* Teacher Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 italic">
                        أهلاً بك، <span className="text-secondary">يا معلم الجيل</span>
                    </h1>
                    <p className="text-foreground-muted flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        لديك اليوم 3 محاضرات مباشرة ومهمتين للمراجعة
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-white font-black rounded-2xl hover:shadow-xl hover:shadow-secondary/20 transition-all active:scale-95">
                        <Plus className="w-5 h-5" />
                        <span>إنشاء دورة جديدة</span>
                    </button>
                    <button className="p-3 bg-bg-secondary border border-border rounded-2xl hover:border-secondary/50 transition-all">
                        <Calendar className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    label="إجمالي طلابي"
                    value={teacherStats.total_students}
                    icon={Users}
                    color="indigo"
                    trend="+24 اليوم"
                />
                <StatsCard
                    label="دوراتي النشطة"
                    value={teacherStats.my_courses_count}
                    icon={BookOpen}
                    color="primary"
                />
                <StatsCard
                    label="عدد طلابي"
                    value={teacherStats.total_lessons}
                    icon={Star}
                    color="secondary"
                    trend="ممتاز"
                />
                <StatsCard
                    label="الإيرادات"
                    value={teacherStats.my_earnings}
                    icon={MessageSquare}
                    color="rose"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sections removed: Engagement, Schedule, Tips */}
            </div>
        </motion.div>
    );
};

export default TeacherDashboardClient;
