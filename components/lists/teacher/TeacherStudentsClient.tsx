"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Mail, BookOpen, Calendar, ChevronLeft, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Student } from "@/types/user.types";

interface TeacherStudentsClientProps {
    students: Student[];
}

const TeacherStudentsClient: React.FC<TeacherStudentsClientProps> = ({ students }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStudents = Array.isArray(students) ? students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 italic">
                        قائمة <span className="text-secondary">طلابي</span>
                    </h1>
                    <p className="text-foreground-muted flex items-center gap-2">
                        <Users className="w-4 h-4 text-secondary" />
                        لديك {students?.length || 0} طالب مسجل في دوراتك
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-bg-secondary/40 backdrop-blur-md border border-border p-4 rounded-[2rem]">
                <div className="relative flex-1 w-full">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted w-5 h-5" />
                    <Input
                        placeholder="ابحث عن طالب بالاسم أو البريد الإلكتروني..."
                        className="pr-12 h-14 bg-bg-primary/50 border-border rounded-2xl focus:ring-secondary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Students List */}
            <AnimatePresence mode="popLayout">
                {filteredStudents.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-4"
                    >
                        {filteredStudents.map((student) => (
                            <motion.div key={student.id} variants={itemVariants} layout>
                                <Card className="overflow-hidden border-border bg-bg-secondary/30 backdrop-blur-sm hover:bg-bg-secondary/50 transition-all duration-300 rounded-[1.5rem] group">
                                    <div className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-6">
                                        {/* Avatar / Icon */}
                                        <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <GraduationCap className="w-8 h-8" />
                                        </div>

                                        {/* Student Info */}
                                        <div className="flex-1 min-w-0 text-center md:text-right">
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                                                <h3 className="text-xl font-black truncate group-hover:text-secondary transition-colors">
                                                    {student.name}
                                                </h3>
                                                {student.status === 'active' && (
                                                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full">
                                                        نشط
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-foreground-muted">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    <span className="truncate">{student.email}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <BookOpen className="w-3.5 h-3.5" />
                                                    <span>{student.enrolled_courses_count} دورات</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Meta Info */}
                                        <div className="flex flex-col items-center md:items-end gap-1 shrink-0">
                                            <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>انضم في: {new Date(student.created_at).toLocaleDateString('ar-EG')}</span>
                                            </div>
                                            <Button variant="ghost" className="text-secondary hover:text-secondary hover:bg-secondary/10 gap-2 mt-2">
                                                <span>عرض الملف الشخصي</span>
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 bg-bg-secondary/20 border border-dashed border-border rounded-[3rem] text-center"
                    >
                        <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center mb-6">
                            <Users className="w-10 h-10 text-foreground-muted" />
                        </div>
                        <h3 className="text-2xl font-black mb-2">لم يتم العثور على طلاب</h3>
                        <p className="text-foreground-muted max-w-sm">
                            {searchQuery ? `لا يوجد طلاب يطابقون "${searchQuery}"` : "لا يوجد طلاب مسجلون في دوراتك حالياً."}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherStudentsClient;
