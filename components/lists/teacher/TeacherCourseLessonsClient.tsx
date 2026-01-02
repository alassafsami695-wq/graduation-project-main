"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen,
    Plus,
    ArrowRight,
    PlayCircle,
    FileText,
    Clock,
    MoreVertical,
    Trash2,
    Edit,
    Video,
    File
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { toast } from "sonner";
import { Card } from "@/components/cards/Card";
import { Input } from "@/components/ui/Input";
import { deleteTeacherCoursesLessons } from "@/actions/teacher/delete-course-lesson";
import { updateTeacherCoursesLessons } from "@/actions/teacher/update-course-lesson";

interface Lesson {
    id: number;
    title: string;
    content: string;
    video_url?: string;
    file_url?: string;
    duration?: string;
    order: number;
}

interface TeacherCourseLessonsClientProps {
    courseId: string;
    courseTitle: string;
    initialLessons: Lesson[];
}

const TeacherCourseLessonsClient: React.FC<TeacherCourseLessonsClientProps> = ({
    courseId,
    courseTitle,
    initialLessons
}) => {
    const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
        }
    };

    const handleDeleteLesson = async (lessonId: number) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا الدرس؟")) return;

        try {
            setIsDeleting(lessonId);
            await deleteTeacherCoursesLessons(parseInt(courseId), lessonId);
            setLessons(lessons.filter(l => l.id !== lessonId));
            toast.success("تم حذف الدرس بنجاح");
        } catch (error) {
            toast.error("حدث خطأ أثناء حذف الدرس");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleEditLesson = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setVideoFile(null);
        setIsEditModalOpen(true);
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLesson) return;

        try {
            setIsUpdating(true);

            const formData = new FormData();
            formData.append("title", editingLesson.title);
            formData.append("content", editingLesson.content);
            if (editingLesson.duration) formData.append("duration", editingLesson.duration);
            if (editingLesson.file_url) formData.append("file_url", editingLesson.file_url);

            if (videoFile) {
                formData.append("video", videoFile);
            }

            await updateTeacherCoursesLessons(parseInt(courseId), editingLesson.id, formData);

            // In a real app, you might want to fetch the updated lesson from the response
            // For now, we update local state. Note that video_url won't be updated locally 
            // until a refresh or if we get it back from the API.
            setLessons(lessons.map(l => l.id === editingLesson.id ? { ...editingLesson } : l));

            toast.success("تم تحديث الدرس بنجاح");
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error("حدث خطأ أثناء تحديث الدرس");
        } finally {
            setIsUpdating(false);
        }
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
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <Link
                        href="/dashboard/teacher/courses"
                        className="flex items-center gap-2 text-foreground-muted hover:text-primary transition-colors text-sm font-bold group"
                    >
                        <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>العودة لجميع الدورات</span>
                    </Link>
                    <h1 className="text-4xl font-black italic">
                        دروس <span className="text-primary">{courseTitle}</span>
                    </h1>
                    <p className="text-foreground-muted flex items-center gap-2">
                        <Video className="w-4 h-4 text-primary" />
                        لديك {lessons.length} دروس في هذه الدورة
                    </p>
                </div>
                <Button className="h-14 px-8 bg-primary text-white font-black rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 flex items-center gap-2">
                    <Plus className="w-6 h-6" />
                    <span>إضافة درس جديد</span>
                </Button>
            </div>

            {/* Lessons List */}
            <AnimatePresence mode="popLayout">
                {lessons.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 gap-4"
                    >
                        {lessons.map((lesson, index) => (
                            <motion.div key={lesson.id} variants={itemVariants} layout>
                                <Card className="overflow-hidden border-border bg-bg-secondary/30 backdrop-blur-md hover:bg-bg-secondary/50 transition-all duration-300 rounded-[1.5rem] group">
                                    <div className="p-5 flex flex-col md:flex-row items-center gap-6">
                                        {/* Lesson Number/Index */}
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <span className="text-primary font-black text-xl">{index + 1}</span>
                                        </div>

                                        {/* Lesson Info */}
                                        <div className="flex-1 min-w-0 text-center md:text-right">
                                            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                                <h3 className="text-lg font-black truncate group-hover:text-primary transition-colors">
                                                    {lesson.title}
                                                </h3>
                                                {lesson.video_url && (
                                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded-full flex items-center gap-1">
                                                        <PlayCircle className="w-3 h-3" />
                                                        فيديو
                                                    </span>
                                                )}
                                                {lesson.file_url && (
                                                    <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-[10px] font-bold rounded-full flex items-center gap-1">
                                                        <FileText className="w-3 h-3" />
                                                        ملف
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-foreground-muted text-sm line-clamp-1">
                                                {lesson.content || "لا يوجد وصف لهذا الدرس"}
                                            </p>
                                        </div>

                                        {/* Stats */}
                                        <div className="hidden lg:flex items-center gap-6 px-6 border-r border-border shrink-0">
                                            <div className="text-center">
                                                <p className="text-[10px] text-foreground-muted font-bold uppercase tracking-wider mb-0.5">المدة</p>
                                                <p className="text-sm font-black flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-primary" />
                                                    {lesson.duration || "غير محدد"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleEditLesson(lesson)}
                                                className="w-10 h-10 rounded-xl border-border hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all active:scale-95"
                                                title="تعديل الدرس"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                disabled={isDeleting === lesson.id}
                                                onClick={() => handleDeleteLesson(lesson.id)}
                                                className="w-10 h-10 rounded-xl border-border hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95"
                                                title="حذف الدرس"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 bg-bg-secondary/20 border border-dashed border-border rounded-[3rem] text-center"
                    >
                        <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center mb-6">
                            <Video className="w-10 h-10 text-foreground-muted" />
                        </div>
                        <h3 className="text-2xl font-black mb-2">لا يوجد دروس بعد</h3>
                        <p className="text-foreground-muted max-w-sm mb-8">
                            ابدأ بإضافة أول درس لهذه الدورة التدريبية الآن.
                        </p>
                        <Button className="h-12 px-8 bg-primary text-white font-black rounded-xl hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            <span>إضافة أول درس</span>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Lesson Modal */}
            <AnimatePresence>
                {isEditModalOpen && editingLesson && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-bg-primary border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-border bg-bg-secondary/30 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black italic">
                                        تعديل <span className="text-primary">الدرس</span>
                                    </h2>
                                    <p className="text-foreground-muted mt-1 text-sm">تحديث تفاصيل الدرس ومحتواه</p>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleUpdateSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold mr-2">عنوان الدرس</label>
                                    <Input
                                        required
                                        value={editingLesson.title}
                                        onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                                        className="bg-bg-secondary/50 border-border rounded-xl h-11"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold mr-2">محتوى الدرس</label>
                                    <textarea
                                        required
                                        value={editingLesson.content}
                                        onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                                        className="w-full min-h-[120px] p-4 rounded-xl border border-border bg-bg-secondary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                        placeholder="أدخل محتوى أو وصف الدرس..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold mr-2">فيديو الدرس</label>
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleVideoChange}
                                                className="hidden"
                                                id="video-upload"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('video-upload')?.click()}
                                                className="rounded-xl border-border h-11 w-full flex items-center justify-center gap-2 bg-bg-secondary/30"
                                            >
                                                <Video className="w-4 h-4 text-primary" />
                                                <span>{videoFile ? videoFile.name : (editingLesson.video_url ? "تغيير الفيديو" : "اختر فيديو")}</span>
                                            </Button>
                                            {editingLesson.video_url && !videoFile && (
                                                <p className="text-[10px] text-foreground-muted px-2 truncate">
                                                    الحالي: {editingLesson.video_url}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold mr-2">المدة (مثال: 10:00)</label>
                                        <Input
                                            value={editingLesson.duration || ""}
                                            onChange={(e) => setEditingLesson({ ...editingLesson, duration: e.target.value })}
                                            placeholder="00:00"
                                            className="bg-bg-secondary/50 border-border rounded-xl h-11"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold mr-2">رابط الملف (اختياري)</label>
                                    <Input
                                        value={editingLesson.file_url || ""}
                                        onChange={(e) => setEditingLesson({ ...editingLesson, file_url: e.target.value })}
                                        placeholder="https://..."
                                        className="bg-bg-secondary/50 border-border rounded-xl h-11"
                                    />
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="border-t border-border p-4 bg-bg-primary/40">
                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        onClick={handleUpdateSubmit as any}
                                        disabled={isUpdating}
                                        className="flex-1 h-12 bg-primary text-white font-black rounded-xl hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                                    >
                                        {isUpdating ? "جاري التحديث..." : "تحديث الدرس"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="h-12 px-8 rounded-xl border-border hover:bg-bg-secondary transition-all"
                                    >
                                        إلغاء
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherCourseLessonsClient;
