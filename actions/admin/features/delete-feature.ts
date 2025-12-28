"use server";
import { apiFetch } from "@/lib/api";

import { revalidatePath } from "next/cache";

export async function deleteFeatures(featureId: number): Promise<any> {
    const response = await apiFetch(`/features/${featureId}`, {
        method: "DELETE",
    });
    revalidatePath("/dashboard/admin/features");
    revalidatePath("/");
    return response;
}
