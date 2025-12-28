"use server";
import { apiFetch } from "@/lib/api";

export async function getTeachers(): Promise<any> {

    const response = apiFetch("/teacher/profile", {
        method: "GET",
    });

    return response
}
