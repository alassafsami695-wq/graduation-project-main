"use server";
import { apiFetch } from "@/lib/api";
import { Course } from "@/types";

export async function searchCourses(query: string): Promise<Course[]> {
    return apiFetch<Course[]>(`/courses?search=${query}`, {
        method: "GET",
    });
}