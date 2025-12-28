"use server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function updateCategory(id: number, data: { title: string }): Promise<any> {
    const response = await apiFetch(`/admin/paths/${id}/update`, {
        method: "POST",
        body: data,
    });
    revalidatePath("/dashboard/admin/categories");
    revalidatePath("/");
    return response;
}
