import { getBestSellingCourses } from '@/actions/courses/best-selling-courses';
import { CourseCard } from '@/components/ui/CourseCard';
import { Course } from '@/types/course.types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function BestSellingCourses() {
    const courses: Course[] = await getBestSellingCourses();

    if (courses.length === 0) return null;

    return (
        <section className="py-24 bg-bg-primary">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            الدورات الأكثر مبيعاً
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gradient">
                            ابدأ رحلة التعلم اليوم
                        </h2>
                        <p className="text-foreground-muted text-lg max-w-2xl leading-relaxed">
                            انضم إلى آلاف الطلاب الذين غيروا حياتهم من خلال دوراتنا الاحترافية المصممة من قبل خبراء الصناعة.
                        </p>
                    </div>

                    <Link
                        href="/courses"
                        className="group flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all duration-300"
                    >
                        <span>عرض جميع الدورات</span>
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.slice(0, 3).map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </section>
    );
}
