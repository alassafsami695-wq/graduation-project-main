"use server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types";

export async function updateCategory(id: number, data: { title: string }): Promise<ActionResponse> {
    const response = await apiFetch<ActionResponse>(`/admin/paths/${id}/update`, {
        method: "POST",
        body: data,
    });
    revalidatePath("/dashboard/admin/categories");
    revalidatePath("/");
    return response;
}
