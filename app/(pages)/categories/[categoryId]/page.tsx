import { getCategoryCourses } from "@/actions/public/categories/get-category-courses";
import { CourseCard } from "@/components/cards/CourseCard";
import { Course } from "@/types/course.types";
import { BookOpen, GraduationCap, LayoutGrid, Search } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ categoryId: string }>;
}

export default async function CategoryCoursesPage({ params }: PageProps) {
    const { categoryId } = await params;
    const response = await getCategoryCourses(Number(categoryId));

    if (!response) {
        notFound();
    }

    const { path_title, courses } = response as any;

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-bg-secondary border-b border-border py-20">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50" />

                <div className="container mx-auto px-4 max-w-7xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                                <GraduationCap size={16} />
                                تصفح الدورات حسب القسم
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-gradient leading-tight">
                                {path_title}
                            </h1>
                            <p className="text-lg text-foreground-muted leading-relaxed">
                                اكتشف مجموعة واسعة من الدورات التدريبية المتخصصة في {path_title}. ابدأ رحلتك التعليمية اليوم مع أفضل الخبراء.
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-4 bg-bg-primary/50 backdrop-blur-md p-6 rounded-3xl border border-border glass">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <BookOpen size={32} />
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-primary">{courses?.length || 0}</div>
                                <div className="text-sm text-foreground-muted font-medium">دورة متاحة</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="container mx-auto px-4 max-w-7xl py-16">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                        <LayoutGrid className="text-primary" size={24} />
                        <h2 className="text-2xl font-bold">الدورات المتاحة</h2>
                    </div>

                    {/* Placeholder for filters/search if needed later */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                            <input
                                type="text"
                                placeholder="ابحث في هذا القسم..."
                                className="pr-12 pl-4 py-2.5 bg-bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-64 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {courses && courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course: Course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-3xl border-dashed border-2 border-border/50">
                        <div className="w-20 h-20 rounded-full bg-foreground-muted/10 flex items-center justify-center text-foreground-muted mb-6">
                            <LayoutGrid size={40} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">لا توجد دورات حالياً</h3>
                        <p className="text-foreground-muted max-w-sm">
                            نحن نعمل باستمرار على إضافة دورات جديدة. يرجى مراجعة هذا القسم لاحقاً.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
