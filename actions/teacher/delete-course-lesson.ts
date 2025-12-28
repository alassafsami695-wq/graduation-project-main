"use server";
import { apiFetch } from "@/lib/api";

export async function deleteTeacherCoursesLessons(courseId: number, lessonId: number): Promise<any> {
    const response = apiFetch(`/teacher/courses/${courseId}/lessons/${lessonId}`, {
        method: "DELETE",
    });

    return response
}