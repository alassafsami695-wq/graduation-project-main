"use server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function deleteAd(id: number | string): Promise<any> {
    const response = await apiFetch(`/admin/ads/${id}`, {
        method: "DELETE",
    });
    return response;
}
