"use server";
import { apiFetch } from "@/lib/api";

export async function updateTeacherCoursesLessons(courseId: number, lessonId: number, data: any): Promise<any> {
    const response = apiFetch(`/teacher/courses/${courseId}/lessons/${lessonId}/update`, {
        method: "POST",
        body: data, // Assuming the backend expects POST with data for updates
    });

    return response
}
