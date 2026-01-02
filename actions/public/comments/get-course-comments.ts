"use server";
import { apiFetch } from "@/lib/api";

export async function getCourseComments(courseId: number): Promise<any[]> {
    return apiFetch<any[]>(`/comments?course_id=${courseId}`, {
        method: "GET",
    });
}