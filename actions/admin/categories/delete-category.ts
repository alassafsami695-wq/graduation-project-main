"use server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types";

export async function deleteCategory(id: number): Promise<ActionResponse> {
    const response = await apiFetch<ActionResponse>(`/admin/paths/${id}`, {
        method: "DELETE",
    });
    revalidatePath("/dashboard/admin/categories");
    revalidatePath("/");
    return response;
}
