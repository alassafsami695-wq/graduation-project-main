"use server";
import { apiFetch } from "@/lib/api";
import { Course } from "@/types";

export async function getStudentCourses(): Promise<Course[]> {
    return apiFetch<Course[]>("/my-courses", {
        method: "GET",
    });
}
