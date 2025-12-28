"use server";
import { apiFetch } from "@/lib/api";

export async function getStudentCourses(): Promise<any> {
    return apiFetch("/my-courses", {
        method: "GET",
    });
}
