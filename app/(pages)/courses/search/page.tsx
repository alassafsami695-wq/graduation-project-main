import { searchCourses } from "@/actions/courses/search-courses";
import { CourseCard } from "@/components/ui/CourseCard";
import { Course } from "@/types/course.types";

interface SearchPageProps {
    searchParams: Promise<{ query?: string }>;
}

export default async function Page({ searchParams }: SearchPageProps) {
    const { query } = await searchParams;
    const response = await searchCourses(query || "");
    const courses: Course[] = response || [];

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4">نتائج البحث</h1>
                <p className="text-foreground-muted">
                    {query ? `نتائج البحث عن: "${query}"` : "تصفح جميع الكورسات"}
                </p>
            </div>

            {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-bg-secondary/30 rounded-3xl border border-dashed border-border">
                    <p className="text-xl text-foreground-muted">لم يتم العثور على نتائج للبحث.</p>
                </div>
            )}
        </div>
    );
}
