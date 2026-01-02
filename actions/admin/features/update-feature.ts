"use server";
import { apiFetch } from "@/lib/api";
import { ActionResponse } from "@/types";

import { revalidatePath } from "next/cache";

export async function updateFeature(id: number, featureData: any): Promise<ActionResponse> {
    const response = await apiFetch<ActionResponse>(`/admin/features/${id}/update`, {
        method: "POST",
        body: featureData,
    });
    // revalidatePath("/dashboard/admin/features");
    // revalidatePath("/");
    return response;
}