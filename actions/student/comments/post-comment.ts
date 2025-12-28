"use server"
import { apiFetch } from "@/lib/api";

export async function postComment(data: any) {
    const response = await apiFetch("/comments", {
        method: "POST",
        body: data,
    });
    return response;
}