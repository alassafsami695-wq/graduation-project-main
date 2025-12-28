"use server";
import { apiFetch } from "@/lib/api";

export async function getTeacherCourses(): Promise<any> {

    const response = apiFetch("/teacher/courses", {
        method: "GET",
    });

    return response
}
