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
                {/* Engagement Section */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-bg-secondary/40 backdrop-blur-md border border-border rounded-[2.5rem] p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black">الدورات الأكثر تفاعلاً</h3>
                            <p className="text-sm text-foreground-muted">أداء دوراتك خلال آخر 30 يوم</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-primary/20" />
                    </div>

                    <div className="space-y-4">
                        {[
                            { title: "أساسيات تطوير الويب بالذكاء الاصطناعي", students: 450, growth: "+15%", color: "primary" },
                            { title: "تصميم واجهات المستخدم المتقدمة", students: 320, growth: "+8%", color: "secondary" },
                            { title: "احتراف React Context API", students: 280, growth: "+12%", color: "indigo" }
                        ].map((course, i) => (
                            <div key={i} className="flex items-center gap-6 p-5 bg-bg-primary/50 border border-border rounded-3xl hover:border-primary/30 transition-all hover:translate-x-[-8px] group">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${course.color}/10 text-${course.color}`}>
                                    <PlayCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-sm mb-1">{course.title}</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-3.5 h-3.5 text-foreground-muted" />
                                            <span className="text-[10px] font-bold text-foreground-muted">{course.students} طالب</span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-border" />
                                        <div className="flex items-center gap-2">
                                            <Star className="w-3.5 h-3.5 text-yellow-500" />
                                            <span className="text-[10px] font-bold text-foreground-muted">4.8</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left font-black text-primary">
                                    {course.growth}
                                </div>
                                <ChevronLeft className="w-5 h-5 text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Schedule & Tasks */}
                <div className="space-y-8">
                    <motion.div
                        variants={itemVariants}
                        className="bg-bg-secondary border border-border rounded-[2.5rem] p-8 relative overflow-hidden"
                    >
                        <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            الجدول القادم
                        </h3>
                        <div className="space-y-6 relative">
                            {[
                                { time: "10:00 AM", event: "محاضرة مباشرة: تصميم النظام", type: "Live Session", color: "bg-primary" },
                                { time: "02:30 PM", event: "مراجعة مشاريع الطلاب", type: "Grading", color: "bg-secondary" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${item.color} ring-4 ring-bg-secondary`} />
                                        <div className="w-0.5 h-full bg-border" />
                                    </div>
                                    <div className="pb-6">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-wider">{item.time}</p>
                                        <p className="text-sm font-bold mt-1 group-hover:text-primary transition-colors">{item.event}</p>
                                        <span className="text-[10px] text-foreground-muted mt-1 inline-block">{item.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-3 bg-bg-primary border border-border rounded-xl text-xs font-bold hover:bg-border transition-colors">
                            عرض الجدول الكامل
                        </button>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-br from-primary to-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/20"
                    >
                        <h3 className="text-xl font-black mb-2 italic">نصيحة اليوم 💡</h3>
                        <p className="text-sm text-white/80 leading-relaxed mb-6">
                            التفاعل في الجلسات المباشرة يزيد من معدل إكمال الدورة بنسبة تصل إلى 40%. جرب طرح أسئلة سريعة اليوم!
                        </p>
                        <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                className="h-full bg-white"
                            />
                        </div>
                        <p className="text-[10px] mt-2 text-white/60 font-medium">هدف التفاعل الأسبوعي: 75%</p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default TeacherDashboardClient;
