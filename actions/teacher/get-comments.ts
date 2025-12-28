"use server";
import { apiFetch } from "@/lib/api";

export async function getTeacherComments(): Promise<any> {

    const response = apiFetch("/teacher/comments", {
        method: "GET",
    });

    return response
}
