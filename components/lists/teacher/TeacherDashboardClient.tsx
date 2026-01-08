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
                        لوحة تحكم المعلم
                    </h1>
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
