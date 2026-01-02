"use server";
import { apiFetch } from "@/lib/api";
import { Course } from "@/types";

export async function getCourseData(courseId: number): Promise<Course> {
    return apiFetch<Course>(`/courses/${courseId}`, {
        method: "GET",
    });
}
