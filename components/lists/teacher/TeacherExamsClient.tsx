"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, HelpCircle, FileText, ChevronLeft, CheckCircle2, Info, Plus } from "lucide-react";
import QuestionDialog from "./QuestionDialog";
import { Button } from "@/components/ui/Button";

interface Question {
    id: number;
    lesson_id: number;
    type: string;
    question: string; // The text content as per user's log
    options: any;
    answer: string;
    [key: string]: any;
}

interface CourseWithExams {
    id: number;
    title: string;
    description: string;
    questions: Question[];
    [key: string]: any;
}

interface TeacherExamsClientProps {
    exams: CourseWithExams[];
}

const TeacherExamsClient: React.FC<TeacherExamsClientProps> = ({ exams }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<{ id: number; title: string } | null>(null);

    const handleAddQuestions = (courseId: number, courseTitle: string) => {
        setSelectedCourse({ id: courseId, title: courseTitle });
        setIsDialogOpen(true);
    };

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
            className="space-y-12"
        >
            {exams && exams.length > 0 ? (
                exams.map((course) => (
                    <motion.div
                        key={course.id}
                        variants={itemVariants}
                        className="space-y-6"
                    >
                        {/* Course Header */}
                        <div className="flex flex-col md:flex-row md:items-center gap-6 border-b border-border pb-6">
                            <div className="flex items-center gap-6 flex-1">
                                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-sm">
                                    <BookOpen className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-black text-foreground mb-1">{course.title}</h2>
                                    <div className="flex items-center gap-3 text-foreground-muted text-sm">
                                        <div className="flex items-center gap-1.5 font-bold">
                                            <FileText className="w-4 h-4" />
                                            <span>{course.questions.length || 0} أسئلة</span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-border" />
                                        <p className="truncate max-w-md italic">{course.description}</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => handleAddQuestions(course.id, course.title)}
                                className="h-12 px-6 rounded-xl bg-secondary text-white font-black flex items-center gap-2 shadow-lg shadow-secondary/10 hover:shadow-secondary/20 transition-all shrink-0"
                            >
                                <Plus className="w-5 h-5" />
                                إضافة أسئلة
                            </Button>
                        </div>

                        {/* Questions List */}
                        <div className="grid gap-6 pr-4 md:pr-12">
                            {course.questions && course.questions.length > 0 ? (
                                course.questions.map((q, idx) => (
                                    <div
                                        key={q.id}
                                        className="group bg-bg-secondary/30 backdrop-blur-sm border border-border p-6 rounded-3xl hover:border-secondary/30 transition-all duration-300 relative overflow-hidden flex flex-col gap-4"
                                    >
                                        <div className="flex items-start gap-4 z-10">
                                            <div className="w-10 h-10 rounded-xl bg-bg-primary border border-border flex items-center justify-center shrink-0 font-black text-sm text-foreground-muted group-hover:text-secondary group-hover:border-secondary/30 transition-colors shadow-sm">
                                                Q{idx + 1}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black bg-secondary/10 text-secondary px-2 py-1 rounded-md uppercase tracking-tighter">
                                                        {q.type || "عام"}
                                                    </span>
                                                    {q.options && (
                                                        <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-1 rounded-md">
                                                            خيارات: {q.options}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-base font-bold text-foreground leading-relaxed">
                                                    {q.question}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Answer Badge */}
                                        <div className="flex items-center gap-2 mt-2 bg-green-500/5 w-fit px-4 py-2 rounded-2xl border border-green-500/10 z-10">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="text-xs font-black text-green-600">الإجابة الصحيحة:</span>
                                            <span className="text-xs font-bold text-foreground/80">{q.answer}</span>
                                        </div>

                                        {/* Subtle background decoration */}
                                        <div className="absolute left-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.06] group-hover:rotate-12 transition-all duration-500 pointer-events-none">
                                            <HelpCircle className="w-24 h-24" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 bg-bg-secondary/20 border border-dashed border-border rounded-3xl text-center">
                                    <div className="w-12 h-12 bg-bg-primary rounded-full flex items-center justify-center mb-3 shadow-inner">
                                        <HelpCircle className="w-6 h-6 text-foreground-muted opacity-30" />
                                    </div>
                                    <p className="text-sm font-black text-foreground-muted">لم يتم إضافة أسئلة لهذه الدورة</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-bg-secondary/20 border border-dashed border-border rounded-[3rem] text-center">
                    <FileText className="w-12 h-12 text-foreground-muted mb-4 opacity-20" />
                    <h3 className="text-xl font-black mb-1">لا توجد دورات متاحة</h3>
                    <p className="text-sm text-foreground-muted">لم يتم العثور على أي دورات مختبرة حالياً.</p>
                </div>
            )}
            {/* Modal */}
            {selectedCourse && (
                <QuestionDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    courseId={selectedCourse.id}
                    courseTitle={selectedCourse.title}
                />
            )}
        </motion.div>
    );
};

export default TeacherExamsClient;
