"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Clock, BookOpen, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/cards/Card";
import { Course } from "@/types/course.types";

// تعريف واجهة محلية لإضافة حقل التقدم وتجنب الأخطاء البرمجية
interface ExtendedCourse extends Course {
    progress_percentage?: number;
}

interface PurchasedCoursesListProps {
    purchasedCourses: ExtendedCourse[];
}

export default function PurchasedCoursesList({ purchasedCourses }: PurchasedCoursesListProps) {

    if (!purchasedCourses || purchasedCourses.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-medium text-muted-foreground">لا توجد دورات مشتراة بعد</h3>
                <Button asChild className="mt-4" variant="outline">
                    <Link href="/courses">تصفح الدورات</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                دوراتي
            </h2>
            <div className="grid grid-cols-1 gap-4">
                {purchasedCourses?.map((course) => (
                    <Card key={course.id} className="overflow-hidden bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border rounded-2xl">
                        <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Course Details */}
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors">
                                                <h3 className="text-xl font-bold line-clamp-1">{course.title}</h3>
                                            </Link>
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                                            {course.description}
                                        </p>

                                        {course.teacher && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                المعلم: <span className="font-semibold text-foreground">{course.teacher.name}</span>
                                            </p>
                                        )}

                                        {/* --- شريط التقدم المضاف حديثاً --- */}
                                        <div className="py-4 max-w-md">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[11px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
                                                    <CheckCircle className="w-3 h-3" /> تقدمك في التعلم
                                                </span>
                                                <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                                                    {Math.round(course.progress_percentage || 0)}%
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-gray-800/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${course.progress_percentage || 0}%` }}
                                                    transition={{ duration: 1.5, ease: "anticipate" }}
                                                    className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-2 flex items-center justify-between gap-4 border-t border-white/5 pt-4">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            {course.course_duration && (
                                                <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-lg">
                                                    <Clock className="w-3.5 h-3.5 text-primary" />
                                                    <span className="font-medium">{course.course_duration}</span>
                                                </div>
                                            )}
                                        </div>

                                        <Button asChild size="default" className="gap-2 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 px-6">
                                            <Link href={`/courses/${course.id}`}>
                                                <PlayCircle className="w-4.5 h-4.5" />
                                                <span className="font-bold text-sm">ابدأ التعلم الآن</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}