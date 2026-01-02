"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function generateQuestionsAction(lessonId: number, text: string) {
    try {
        const res = await apiFetch(`/teacher/lessons/${lessonId}/questions/generate`, {
            method: "POST",
            body: { text }
        });
        revalidatePath("/dashboard/teacher/exams");
        return res;
    } catch (error: any) {
        throw new Error(error.message || "Failed to generate questions");
    }
}

export async function storeQuestionsAction(lessonId: number, questions: any[]) {
    try {
        const res = await apiFetch(`/teacher/lessons/${lessonId}/questions/store`, {
            method: "POST",
            body: {
                lesson_id: lessonId,
                questions
            }
        });
        revalidatePath("/dashboard/teacher/exams");
        return res;
    } catch (error: any) {
        throw new Error(error.message || "Failed to save questions");
    }
}
