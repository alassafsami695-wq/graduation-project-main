"use server";
import { apiFetch } from "@/lib/api";

export async function getTeacherComments(): Promise<any> {

    const response = apiFetch("/teacher/courses/details", {
        method: "GET",
    });

    return response
}
