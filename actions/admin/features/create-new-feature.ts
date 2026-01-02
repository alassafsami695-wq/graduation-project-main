"use server";
import { apiFetch } from "@/lib/api";
import { ActionResponse } from "@/types";

import { revalidatePath } from "next/cache";

export async function createNewFeature(featureData: any): Promise<ActionResponse> {
    const response = await apiFetch<ActionResponse>("/admin/features", {
        method: "POST",
        body: featureData,
    });
    return response;
}