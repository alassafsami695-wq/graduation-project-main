import { getTeacherCoursesLessons } from "@/actions/teacher/get-course-lessons";
import TeacherCourseLessonsClient from "@/components/dashboard/teacher/TeacherCourseLessonsClient";
import { Suspense } from "react";

interface TeacherCourseLessonsPageProps {
    params: {
        courseId: string;
    };
}

export default async function TeacherCourseLessonsPage({ params }: TeacherCourseLessonsPageProps) {
    const { courseId } = await params;

    // Fetch lessons data
    const lessonsData = await getTeacherCoursesLessons(parseInt(courseId));

    // We might need to fetch course title separately if it's not in lessonsData
    // For now, we'll try to extract it from the response or use a placeholder
    const lessons = lessonsData?.data || lessonsData || [];
    const courseTitle = lessons.length > 0 ? lessons[0]?.course?.title || "الدورة" : "الدورة التدريبية";

    return (
        <div className="p-8 space-y-8 overflow-y-auto min-h-screen">
            <Suspense fallback={<div className="flex items-center justify-center py-20"><span className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></span></div>}>
                <TeacherCourseLessonsClient
                    courseId={courseId}
                    courseTitle={courseTitle}
                    initialLessons={lessons}
                />
            </Suspense>
        </div>
    );
}
