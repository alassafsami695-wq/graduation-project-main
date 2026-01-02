"use server";
import { apiFetch } from "@/lib/api";

export async function getLessonComments(lessonId: number): Promise<any[]> {
    return apiFetch<any[]>(`/comments?lesson_id=${lessonId}`, {
        method: "GET",
    });
}
