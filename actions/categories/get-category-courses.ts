"use server";
import { apiFetch } from "@/lib/api";

export async function getCategoryCourses(categoryId: number): Promise<any> {
    return apiFetch(`/paths/${categoryId}/courses`, {
        method: "GET",
    });
}
