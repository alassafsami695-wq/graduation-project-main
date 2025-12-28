"use server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function deleteCategory(id: number): Promise<any> {
    const response = await apiFetch(`/admin/paths/${id}`, {
        method: "DELETE",
    });
    revalidatePath("/dashboard/admin/categories");
    revalidatePath("/");
    return response;
}
