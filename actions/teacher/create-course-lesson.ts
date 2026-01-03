"use server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createTeacherCourseLesson(courseId: number, formData: FormData) {
    try {
        const response = await apiFetch(`/teacher/courses/${courseId}/lessons`, {
            method: "POST",
            body: formData,
        });

        revalidatePath(`/dashboard/teacher/courses/${courseId}/lessons`);
        return response;
    } catch (error: any) {
        return {
            error: error.message || "Failed to create lesson"
        };
    }
}
