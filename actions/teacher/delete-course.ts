"use server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function deleteCourse(courseId: number): Promise<any> {
    const response = await apiFetch(`/teacher/courses/${courseId}`, {
        method: "DELETE",
    });

    revalidatePath("/dashboard/teacher/courses");
    return response;
}
