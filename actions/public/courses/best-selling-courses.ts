"use server";
import { apiFetch } from "@/lib/api";
import { Course } from "@/types";

export async function bestSellingCourses(): Promise<Course[]> {
    return apiFetch<Course[]>("/courses/best-selling", {
        method: "GET",
    });
}
