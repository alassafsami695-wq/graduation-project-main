"use server";
import { apiFetch } from "@/lib/api";

export async function getTeacherCoursesLessons(courseId: number): Promise<any> {

    const response = apiFetch(`/teacher/courses/${courseId}/lessons`, {
        method: "GET",
    });

    return response
}
