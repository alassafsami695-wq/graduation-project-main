"use server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types";

export async function deleteFeatures(featureId: number): Promise<ActionResponse> {
    const response = await apiFetch<ActionResponse>(`/features/${featureId}`, {
        method: "DELETE",
    });
    revalidatePath("/dashboard/admin/features");
    revalidatePath("/");
    return response;
}
