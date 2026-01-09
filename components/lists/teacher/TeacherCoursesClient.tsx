"use client";

import React, { useState, useEffect, useRef } from "react";
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
    const [categories, setCategories] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<any>({
        title: "",
        description: "",
        photo: null,
        price: "",
        course_duration: "",
        path_id: "",
        rating: "0",
        number_of_students: "0",
        sales_count: "0",
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res: any = await getCategories();
                setCategories(res?.data ?? res ?? []);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    const filteredCourses = courses.filter((course) =>
        `${course.title} ${course.description}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("حجم الصورة أكبر من 2MB");
                return;
            }
            setFormData((prev: any) => ({ ...prev, photo: file }));
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result as string);
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

    const validate = () => {
        const e: Record<string, string> = {};
        if (!formData.title || formData.title.trim().length < 3) e.title = "الرجاء إدخال عنوان صالح (3 أحرف على الأقل)";
        if (!formData.description || formData.description.trim().length < 10) e.description = "يرجى إدخال وصف لا يقل عن 10 أحرف";
        if (!formData.path_id) e.path_id = "اختر القسم";
        if (formData.price !== "" && Number(formData.price) < 0) e.price = "السعر لا يمكن أن يكون سالباً";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleCreateSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!validate()) return;
        try {
            setIsSubmitting(true);
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                const val = formData[key];
                if (val !== null && val !== undefined && val !== "") {
                    data.append(key, val);
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
                sales_count: "0",
            });
            setPhotoPreview(null);
            setErrors({});
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء إنشاء الدورة");
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } },
    };
    const itemVariants = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
                        دوراتي <span className="text-primary">التعليمية</span>
                    </h1>
                    <p className="text-foreground-muted flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        لديك {courses.length} دورات مسجلة في المنصة
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-3 px-5 py-3 bg-primary text-white font-bold rounded-2xl hover:shadow-lg transition-transform active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>إنشاء دورة جديدة</span>
                </Button>
            </div>

            {/* Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-bg-secondary/40 backdrop-blur-md border border-border p-4 rounded-2xl">
                <div className="relative flex-1 w-full">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted w-5 h-5" />
                    <Input
                        placeholder="ابحث عن دورة..."
                        className="pr-12 h-12 bg-bg-primary/50 border-border rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="ابحث عن دورة"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" className="h-12 px-4 rounded-2xl border-border hover:bg-bg-primary gap-2">
                        <Filter className="w-5 h-5" />
                        <span>تصفية</span>
                    </Button>
                </div>
            </div>

            {/* Course list */}
            <AnimatePresence mode="popLayout">
                {filteredCourses.length > 0 ? (
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-4">
                        {filteredCourses.map((course) => (
                            <motion.div key={course.id} variants={itemVariants} layout>
                                <Card className="overflow-hidden border-border bg-bg-secondary/30 backdrop-blur-sm hover:bg-bg-secondary/50 transition-all duration-300 rounded-2xl">
                                    <div className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-6">
                                        <div className="w-full md:w-40 aspect-video md:aspect-square shrink-0 overflow-hidden rounded-xl relative">
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
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        </div>


                                        <div className="flex-1 min-w-0 text-center md:text-right">
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                                    {course.price === 0 || course.price === "0" ? "مجاني" : `${course.price} ل.س`}
                                                </span>
                                                <span className="px-3 py-1 bg-bg-secondary text-foreground-muted text-xs font-bold rounded-full flex items-center gap-1">
                                                    <BookOpen className="w-3 h-3" />
                                                    {course.course_duration}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-1 truncate">{course.title}</h3>
                                            <p className="text-foreground-muted text-sm line-clamp-1 max-w-2xl mx-auto md:mx-0">{course.description}</p>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button asChild variant="outline" size="icon" className="w-11 h-11 rounded-xl border-border">
                                                <Link href={`/dashboard/teacher/courses/${course.id}/lessons`}>
                                                    <BookOpen className="w-5 h-5" />
                                                </Link>
                                            </Button>
                                            <Button asChild variant="outline" size="icon" className="w-11 h-11 rounded-xl border-border">
                                                <Link href={`/courses/${course.id}`}>
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                            </Button>
                                            <Button asChild variant="outline" size="icon" className="w-11 h-11 rounded-xl border-border">
                                                <Link href={`/dashboard/teacher/courses/${course.id}/edit`}>
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                disabled={isDeleting === course.id}
                                                onClick={() => handleDelete(course.id)}
                                                className="w-11 h-11 rounded-xl border-border"
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
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 bg-bg-secondary/20 border border-dashed border-border rounded-2xl text-center">
                        <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center mb-6">
                            <GraduationCap className="w-10 h-10 text-foreground-muted" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">لم يتم العثور على نتائج</h3>
                        <p className="text-foreground-muted max-w-sm">{searchQuery ? `لا يوجد نتائج تطابق "${searchQuery}"` : "لم تقم بإنشاء أي دورات بعد. ابدأ الآن وشارك معرفتك!"}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative w-full max-w-4xl bg-bg-primary border border-border rounded-3xl shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-border bg-bg-secondary/30 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        إنشاء <span className="text-primary">دورة جديدة</span>
                                    </h2>
                                    <p className="text-foreground-muted mt-1 text-sm">أدخل تفاصيل الدورة التدريبية التي ترغب في تقديمها</p>
                                </div>
                                <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="text-foreground-muted">
                                    إغلاق
                                </Button>
                            </div>

                            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-8">
                                        <label htmlFor="title" className="text-sm font-semibold block mb-1">عنوان الدورة</label>
                                        <Input id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="مثال: أساسيات البرمجة" className="h-11 rounded-lg" />
                                        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                                    </div>

                                    <div className="md:col-span-4">
                                        <label htmlFor="category" className="text-sm font-semibold block mb-1">القسم / التصنيف</label>
                                        <select id="category" required value={formData.path_id} onChange={(e) => setFormData({ ...formData, path_id: e.target.value })} className="w-full h-11 px-3 rounded-lg border border-border bg-bg-secondary/50">
                                            <option value="">اختر القسم...</option>
                                            {categories.map((cat: any) => (
                                                <option key={cat.id} value={cat.id}>{cat.title}</option>
                                            ))}
                                        </select>
                                        {errors.path_id && <p className="text-xs text-red-500 mt-1">{errors.path_id}</p>}
                                    </div>

                                    <div className="md:col-span-5">
                                        <label className="text-sm font-semibold block mb-1">صورة الدورة</label>
                                        <div className="flex items-center gap-4 p-3 border border-dashed rounded-lg bg-bg-secondary/20">
                                            <div className="w-20 h-20 rounded-md overflow-hidden bg-bg-secondary flex items-center justify-center">
                                                {photoPreview ? <img src={photoPreview} alt="preview" className="w-full h-full object-cover" /> : <Plus className="w-6 h-6 text-foreground-muted" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-foreground-muted mb-2">اختَر صورة جذابة (أقصى حجم 2MB)</p>
                                                <div className="flex gap-2">
                                                    <Button type="button" onClick={() => fileRef.current?.click()} className="rounded-lg">اختر صورة</Button>
                                                    <Button type="button" variant="outline" onClick={() => { setPhotoPreview(null); setFormData((p: any) => ({ ...p, photo: null })); }}>إزالة</Button>
                                                </div>
                                                <input ref={fileRef} id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-7">
                                        <label htmlFor="description" className="text-sm font-semibold block mb-1">وصف الدورة</label>
                                        <textarea id="description" required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="أدخل وصفاً شاملاً للدورة..." className="w-full h-32 p-3 rounded-lg border border-border bg-bg-secondary/50 resize-none" />
                                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                                    </div>

                                    <div className="md:col-span-3">
                                        <label className="text-sm font-semibold block mb-1">سعر الدورة</label>
                                        <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="150" className="h-11 rounded-lg" />
                                        {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                                    </div>

                                    <div className="md:col-span-3">
                                        <label className="text-sm font-semibold block mb-1">المدة</label>
                                        <Input value={formData.course_duration} onChange={(e) => setFormData({ ...formData, course_duration: e.target.value })} placeholder="10 ساعات" className="h-11 rounded-lg" />
                                    </div>
                                </div>

                                <div className="h-4" />

                                {/* Sticky footer inside the form so the submit is within form context */}
                                <div className="sticky bottom-0 left-0 right-0 bg-bg-primary/50 backdrop-blur py-3 rounded-b-3xl border-t border-border flex gap-3">
                                    <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 bg-primary text-white font-bold rounded-xl">
                                        {isSubmitting ? "جاري الإنشاء..." : "إنشاء الدورة"}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="h-12 px-6 rounded-xl">إلغاء</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherCoursesClient;
