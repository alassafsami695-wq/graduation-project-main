"use server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createNewCourse(data: any): Promise<any> {
    const response = await apiFetch(`/teacher/courses`, {
        method: "POST",
        body: data,
    });
    revalidatePath("/dashboard/teacher/courses");
    return response;
}
