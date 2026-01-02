"use server";
import { apiFetch } from "@/lib/api";
import { ActionResponse } from "@/types";

export async function deleteAd(id: number | string): Promise<ActionResponse> {
    const response = await apiFetch<ActionResponse>(`/admin/ads/${id}`, {
        method: "DELETE",
    });
    return response;
}
