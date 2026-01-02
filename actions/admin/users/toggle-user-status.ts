"use server";
import { apiFetch } from "@/lib/api";
import { ActionResponse } from "@/types";

export async function toggleUser(userId: number): Promise<ActionResponse> {
    return apiFetch<ActionResponse>(`/admin/users/${userId}/toggle-status`, {
        method: "POST",
    });
}
