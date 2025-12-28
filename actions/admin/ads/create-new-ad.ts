"use server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createNewAd(data: FormData): Promise<any> {
    const response = await apiFetch("/admin/ads", {
        method: "POST",
        body: data,
    });
    return response;
}
