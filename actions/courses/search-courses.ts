"use server";
import { apiFetch } from "@/lib/api";

export async function searchCourses(query: string): Promise<any> {
    return apiFetch(`/courses?search=${query}`, {
        method: "GET",
    });
}