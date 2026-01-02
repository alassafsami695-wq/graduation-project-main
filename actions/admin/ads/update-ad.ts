"use server";
import { apiFetch } from "@/lib/api";
import { ActionResponse } from "@/types";

export async function updateAd(id: number | string, data: FormData): Promise<ActionResponse> {
    const response = await apiFetch<ActionResponse>(`/admin/ads/${id}`, {
        method: "POST", // Using POST for FormData updates
        body: data,
    });
    return response;
}
