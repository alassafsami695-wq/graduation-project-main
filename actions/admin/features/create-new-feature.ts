"use server";
import { apiFetch } from "@/lib/api";

import { revalidatePath } from "next/cache";

export async function createNewFeature(featureData: any): Promise<any> {
    const response = await apiFetch("/admin/features", {
        method: "POST",
        body: featureData,
    });
    // revalidatePath("/dashboard/admin/features");
    // revalidatePath("/");
    return response;
}