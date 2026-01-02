"use server";
import { apiFetch } from "@/lib/api";
import { Course } from "@/types";

export async function getCategoryCourses(categoryId: number): Promise<Course[]> {
    return apiFetch<Course[]>(`/paths/${categoryId}/courses`, {
        method: "GET",
    });
}
