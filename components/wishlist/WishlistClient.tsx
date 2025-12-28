"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Search, BookOpen, ArrowRight } from "lucide-react";
import { CourseCard } from "@/components/ui/CourseCard";
import { Course } from "@/types/course.types";
import Link from "next/link";

interface WishlistClientProps {
    initialCourses: Course[];
}

const WishlistClient: React.FC<WishlistClientProps> = ({ initialCourses }) => {
    const courses = initialCourses || [];

    console.log("wishlist courses", courses);

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
        <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 space-y-12 min-h-[60vh]">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-500 text-sm font-bold border border-rose-500/20">
                        <Heart className="w-4 h-4 fill-current" />
                        قائمة المفضلة
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gradient">
                        دوراتك المفضلة
                    </h1>
                    <p className="text-foreground-muted text-lg max-w-2xl leading-relaxed">
                        {courses.length > 0
                            ? `لديك ${courses.length} دورات محفوظة للوصول السريع والاشتراك.`
                            : "لم تقم بإضافة أي دورات إلى فضلتك بعد."}
                    </p>
                </div>
            </div>

            {courses.length > 0 ? (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {courses.map((course) => (
                        <motion.div key={course.id} variants={itemVariants}>
                            <CourseCard course={{ ...course, is_wishlisted: true }} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center space-y-8 bg-bg-secondary/30 rounded-[3rem] border border-dashed border-border"
                >
                    <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center">
                        <Heart className="w-12 h-12 text-rose-500/30" strokeWidth={1} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black">المفضلة فارغة</h3>
                        <p className="text-foreground-muted max-w-xs mx-auto">
                            استكشف مكتبتنا التعليمية وأضف الدورات التي تنال إعجابك للعودة إليها لاحقاً.
                        </p>
                    </div>
                    <Link
                        href="/courses"
                        className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-2 font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
                    >
                        <span>تصفح كل الدورات</span>
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </Link>
                </motion.div>
            )}
        </div>
    );
};

export default WishlistClient;
