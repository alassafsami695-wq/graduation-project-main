import { getAdminCourses } from "@/actions/admin/courses/get-courses";
import AdminCoursesClient from "@/components/lists/admin/courses/AdminCoursesClient";

export default async function AdminCoursesPage() {
    const coursesData = await getAdminCourses();
    const courses = Array.isArray(coursesData) ? coursesData : (coursesData as any)?.data || [];

    return (
        <div className="p-8 space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-black text-foreground tracking-tight italic">
                    إدارة <span className="text-primary italic">الدورات</span>
                </h1>
                <p className="text-lg text-foreground-muted max-w-2xl font-medium">
                    هنا يمكنك عرض وإدارة جميع الدورات التعليمية المسجلة في المنصة.
                </p>
            </div>

            <AdminCoursesClient initialCourses={courses} />
        </div>
    );
}
