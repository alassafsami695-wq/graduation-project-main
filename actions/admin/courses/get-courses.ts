"use server";
import { apiFetch } from "@/lib/api";
import { Course } from "@/types";

export async function getAdminCourses(): Promise<Course[]> {
    return apiFetch<Course[]>("/courses", {
        method: "GET",
    });
}
