import { getTeacherCourses } from "@/actions/teacher/get-courses";
import TeacherCoursesClient from "@/components/dashboard/teacher/TeacherCoursesClient";
import { Suspense } from "react";
// import Loading from "@/components/ui/Loading";

export default async function TeacherCoursesPage() {
    const courses = await getTeacherCourses();

    return (
        <div className="p-8 space-y-8 overflow-y-auto">
            <Suspense fallback={<span />}>
                <TeacherCoursesClient courses={courses} />
            </Suspense>
        </div>
    );
}
