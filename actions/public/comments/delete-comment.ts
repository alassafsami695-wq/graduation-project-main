"use server"
import { apiFetch } from "@/lib/api";
import { ActionResponse } from "@/types";

export async function deleteComment(id: number): Promise<ActionResponse> {
    return apiFetch<ActionResponse>(`/comments/${id}`, {
        method: "DELETE",
    });
}