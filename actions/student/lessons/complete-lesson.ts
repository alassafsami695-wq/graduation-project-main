"use server";

import { apiFetch } from "@/lib/api";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function completeLessonAction(lessonId: number): Promise<ActionResponse> {
    try {
        await apiFetch(`/lessons/${lessonId}/complete`, {
            method: "POST",
        });

        revalidatePath("/my-courses");
        revalidatePath(`/courses`);

        return { success: true, message: "تم إكمال الدرس بنجاح" };
    } catch (error: any) {
        return { success: false, error: error.message || "حدث خطأ أثناء إكمال الدرس" };
    }
}
