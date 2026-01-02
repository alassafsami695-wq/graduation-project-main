"use server";
import { apiFetch } from "@/lib/api";
import { ActionResponse } from "@/types";

export async function createNewAd(data: FormData): Promise<ActionResponse> {
    const response = await apiFetch<ActionResponse>("/admin/ads", {
        method: "POST",
        body: data,
    });
    return response;
}
