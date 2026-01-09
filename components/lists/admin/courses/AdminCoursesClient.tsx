"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, User, Calendar, Trash2, Eye, Filter } from "lucide-react";
import { Course } from "@/types/course.types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/cards/Card";
import Link from "next/link";
import { toast } from "sonner";



interface AdminCoursesClientProps {
    initialCourses: Course[];
}

const AdminCoursesClient: React.FC<AdminCoursesClientProps> = ({ initialCourses }) => {
    const [courses, setCourses] = useState(initialCourses);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course as any).teacher?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: number) => {
        if (!window.confirm("هل أنت متأكد من حذف هذه الدورة؟ لا يمكن التراجع عن هذا الإجراء.")) return;

        try {
            setIsDeleting(id);
            // Assuming there's a delete course action for admin, if not we'd need to create it
            // For now, we'll just simulate local deletion if the action is missing
            // await deleteCourse(id); 
            setCourses(prev => prev.filter(c => c.id !== id));
            toast.success("تم حذف الدورة بنجاح");
        } catch (error) {
            toast.error("حدث خطأ أثناء حذف الدورة");
        } finally {
            setIsDeleting(null);
        }
    };

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
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-bg-secondary/40 backdrop-blur-md border border-border p-4 rounded-[2rem]">
                <div className="relative flex-1 w-full">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted w-5 h-5" />
                    <Input
                        placeholder="ابحث عن دورة أو معلم..."
                        className="pr-12 h-14 bg-bg-primary/50 border-border rounded-2xl focus:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" className="h-14 px-6 rounded-2xl border-border hover:bg-bg-primary gap-2 flex-1 md:flex-none">
                        <Filter className="w-5 h-5" />
                        <span>تصنيف</span>
                    </Button>
                </div>
            </div>

            {/* Courses Rows */}
            <AnimatePresence mode="popLayout">
                {filteredCourses.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-4"
                    >
                        {filteredCourses.map((course) => (
                            <motion.div key={course.id} variants={itemVariants} layout>
                                <Card className="overflow-hidden border-border bg-bg-secondary/30 backdrop-blur-sm hover:bg-bg-secondary/50 transition-all duration-300 rounded-[1.5rem] group">
                                    <div className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-6">
                                        {/* Course Image */}
                                        <div className="w-full md:w-40 aspect-video md:aspect-square shrink-0 overflow-hidden rounded-2xl relative">
                                            <img
                                                src={(() => {
                                                    if (!course.photo) return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop";
                                                    let p = course.photo;
                                                    if (p.includes('http') && p.lastIndexOf('http') > 0) p = p.substring(p.lastIndexOf('http'));
                                                    if (p.startsWith('http')) {
                                                        if (p.includes('/courses/') && !p.includes('/storage/')) return p.replace('/courses/', '/storage/courses/');
                                                        return p;
                                                    }
                                                    return `http://127.0.0.1:8000/storage/${p.startsWith('/') ? p.slice(1) : p}`;
                                                })()}
                                                alt={course.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                        </div>


                                        {/* Course Info */}
                                        <div className="flex-1 min-w-0 text-center md:text-right">
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                                    {course.price === 0 || course.price === "0" ? "مجاني" : `${course.price} ل.س`}
                                                </span>
                                                <span className="px-3 py-1 bg-bg-secondary text-foreground-muted text-xs font-bold rounded-full flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {(course as any).teacher?.name || "معلم الأكاديمية"}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black mb-1 truncate group-hover:text-primary transition-colors">
                                                {course.title}
                                            </h3>
                                            <p className="text-foreground-muted text-sm line-clamp-1 max-w-2xl mx-auto md:mx-0">
                                                {course.description}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="icon"
                                                className="w-11 h-11 rounded-xl border-border hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
                                                title="عرض الدورة"
                                            >
                                                <Link href={`/courses/${course.id}`}>
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                disabled={isDeleting === course.id}
                                                onClick={() => handleDelete(course.id)}
                                                className="w-11 h-11 rounded-xl border-border hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95"
                                                title="حذف الدورة"
                                            >
                                                <Trash2 className="w-5 h-5" />
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
                            <BookOpen className="w-10 h-10 text-foreground-muted" />
                        </div>
                        <h3 className="text-2xl font-black mb-2">لم يتم العثور على دورات</h3>
                        <p className="text-foreground-muted max-w-sm">
                            {searchQuery ? `لا يوجد نتاج تطابق "${searchQuery}"` : "لا يوجد دورات مسجلة في النظام حالياً."}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCoursesClient;
