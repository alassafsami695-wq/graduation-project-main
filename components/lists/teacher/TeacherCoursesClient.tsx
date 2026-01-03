"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Filter, BookOpen, GraduationCap, Edit, Trash2, Eye } from "lucide-react";
import { Course } from "@/types/course.types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { deleteCourse } from "@/actions/teacher/delete-course";
import { createNewCourse } from "@/actions/teacher/create-new-course";
import { getCategories } from "@/actions/public/categories/get-categories";
import { toast } from "sonner";
import { Card } from "@/components/cards/Card";

interface TeacherCoursesClientProps {
    courses: Course[];
}

const TeacherCoursesClient: React.FC<TeacherCoursesClientProps> = ({ courses }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [categories, setCategories] = useState<any[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formData, setFormData] = useState<any>({
        title: "",
        description: "",
        photo: null,
        price: "",
        course_duration: "",
        path_id: "",
        rating: "0",
        number_of_students: "0",
        sales_count: "0"
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const res: any = await getCategories();
                setCategories(res.data || res || []);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, photo: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("هل أنت متأكد من حذف هذه الدورة؟ لا يمكن التراجع عن هذا الإجراء.")) return;

        try {
            setIsDeleting(id);
            await deleteCourse(id);
            toast.success("تم حذف الدورة بنجاح");
        } catch (error) {
            toast.error("حدث خطأ أثناء حذف الدورة");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);

            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    data.append(key, formData[key]);
                }
            });

            await createNewCourse(data);
            toast.success("تم إنشاء الدورة بنجاح");
            setIsCreateModalOpen(false);
            setFormData({
                title: "",
                description: "",
                photo: null,
                price: "",
                course_duration: "",
                path_id: "",
                rating: "0",
                number_of_students: "0",
                sales_count: "0"
            });
            setPhotoPreview(null);
        } catch (error) {
            toast.error("حدث خطأ أثناء إنشاء الدورة");
        } finally {
            setIsSubmitting(false);
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
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 italic">
                        دوراتي <span className="text-primary">التعليمية</span>
                    </h1>
                    <p className="text-foreground-muted flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        لديك {courses.length} دورات مسجلة في المنصة
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-6 bg-primary text-white font-black rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 text-lg"
                >
                    <Plus className="w-6 h-6" />
                    <span>إنشاء دورة جديدة</span>
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-bg-secondary/40 backdrop-blur-md border border-border p-4 rounded-[2rem]">
                <div className="relative flex-1 w-full">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted w-5 h-5" />
                    <Input
                        placeholder="ابحث عن دورة..."
                        className="pr-12 h-14 bg-bg-primary/50 border-border rounded-2xl focus:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" className="h-14 px-6 rounded-2xl border-border hover:bg-bg-primary gap-2 flex-1 md:flex-none">
                        <Filter className="w-5 h-5" />
                        <span>تصفية</span>
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
                                                src={course.photo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                                                alt={course.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                        </div>

                                        {/* Course Info */}
                                        <div className="flex-1 min-w-0 text-center md:text-right">
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                                    {course.price === 0 || course.price === "0" ? "مجاني" : `${course.price} ريال`}
                                                </span>
                                                <span className="px-3 py-1 bg-bg-secondary text-foreground-muted text-xs font-bold rounded-full flex items-center gap-1">
                                                    <BookOpen className="w-3 h-3" />
                                                    {course.course_duration}
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
                                                className="w-11 h-11 rounded-xl border-border hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all active:scale-95"
                                                title="إدارة الدروس"
                                            >
                                                <Link href={`/dashboard/teacher/courses/${course.id}/lessons`}>
                                                    <BookOpen className="w-5 h-5" />
                                                </Link>
                                            </Button>
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
                                                asChild
                                                variant="outline"
                                                size="icon"
                                                className="w-11 h-11 rounded-xl border-border hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all active:scale-95"
                                                title="تعديل الدورة"
                                            >
                                                <Link href={`/dashboard/teacher/courses/${course.id}/edit`}>
                                                    <Edit className="w-5 h-5" />
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
                            <GraduationCap className="w-10 h-10 text-foreground-muted" />
                        </div>
                        <h3 className="text-2xl font-black mb-2">لم يتم العثور على نتائج</h3>
                        <p className="text-foreground-muted max-w-sm">
                            {searchQuery ? `لا يوجد نتائج تطابق "${searchQuery}"` : "لم تقم بإنشاء أي دورات بعد. ابدأ الآن وشارك معرفتك!"}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Course Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-5xl bg-bg-primary border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-border bg-bg-secondary/30 flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-black italic">
                                        إنشاء <span className="text-primary">دورة جديدة</span>
                                    </h2>
                                    <p className="text-foreground-muted mt-1 text-sm">أدخل تفاصيل الدورة التدريبية التي ترغب في تقديمها</p>
                                </div>
                            </div>

                            {/* Scrollable form body */}
                            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1">
                                {/* 12 Column Grid for landscape layout */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">

                                    <div className="w-full flex ">
                                        {/* Row 1: Title (8) & Category (4) */}
                                        <div className="space-y-1.5 md:col-span-8">
                                            <label className="text-sm font-bold mr-2">عنوان الدورة</label>
                                            <Input
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="مثال: أساسيات البرمجة"
                                                className="bg-bg-secondary/50 border-border rounded-xl h-11"
                                            />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-4">
                                            <label className="text-sm font-bold mr-2">القسم / التصنيف </label>
                                            <select
                                                required
                                                value={formData.path_id}
                                                onChange={(e) => setFormData({ ...formData, path_id: e.target.value })}
                                                className="w-full h-11 px-4 rounded-xl border border-border bg-bg-secondary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            >
                                                <option value="">اختر القسم...</option>
                                                {categories.map((cat: any) => (
                                                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Row 2: Photo (5) & Description (7) side-by-side */}

                                    {/* Compact Photo Section */}
                                    <div className="space-y-1.5 md:col-span-5 h-full">
                                        <label className="text-sm font-bold mr-2">صورة الدورة</label>
                                        <div className="flex flex-col h-[130px] p-3 border-2 border-dashed border-border rounded-xl bg-bg-secondary/20 hover:bg-bg-secondary/40 transition-all group">
                                            <div className="flex items-center gap-3 h-full">
                                                <div className="w-24 h-24 rounded-lg overflow-hidden bg-bg-secondary border border-border shrink-0 flex items-center justify-center relative">
                                                    {photoPreview ? (
                                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Plus className="w-8 h-8 text-foreground-muted group-hover:scale-110 transition-transform" />
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => document.getElementById('photo-upload')?.click()}
                                                        className="rounded-lg border-border w-full flex items-center justify-center gap-2 mb-1"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        <span>اختر صورة</span>
                                                    </Button>
                                                    <p className="text-[10px] text-foreground-muted text-center leading-tight">Max size 2MB</p>
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                                id="photo-upload"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-1.5 md:col-span-7">
                                        <label className="text-sm font-bold mr-2">وصف الدورة</label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="أدخل وصفاً شاملاً للدورة..."
                                            className="w-full h-[130px] p-3 rounded-xl border border-border bg-bg-secondary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                        />
                                    </div>

                                    {/* Row 3: Small Inputs spread horizontally (3 cols each) */}
                                    <div className="w-full flex">
                                        <div className="space-y-1.5 md:col-span-3">
                                            <label className="text-sm font-bold mr-2">سعر الدورة</label>
                                            <Input
                                                type="number"
                                                required
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                placeholder="150"
                                                className="bg-bg-secondary/50 border-border rounded-xl h-11"
                                            />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-3">
                                            <label className="text-sm font-bold mr-2">المدة</label>
                                            <Input
                                                required
                                                value={formData.course_duration}
                                                onChange={(e) => setFormData({ ...formData, course_duration: e.target.value })}
                                                placeholder="10 ساعات"
                                                className="bg-bg-secondary/50 border-border rounded-xl h-11"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* keep a little space at the bottom so sticky footer doesn't overlap last fields */}
                                <div className="h-6" />
                            </form>

                            {/* Sticky Footer (actions) */}
                            <div className="border-t border-border p-4 bg-bg-primary/40">
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        onClick={handleCreateSubmit as any}
                                        disabled={isSubmitting}
                                        className="flex-1 h-12 bg-primary text-white font-black rounded-xl hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                                    >
                                        {isSubmitting ? "جاري الإنشاء..." : "إنشاء الدورة"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsCreateModalOpen(false)}
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

export default TeacherCoursesClient;
