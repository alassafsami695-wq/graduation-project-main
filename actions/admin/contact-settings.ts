"use server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types";

export async function storeContact(data: any): Promise<ActionResponse> {
    const response = await apiFetch<ActionResponse>("/admin/contact-settings", {
        method: "POST",
        body: data,
    });
    revalidatePath("/");
    revalidatePath("/dashboard/admin/contact-settings");
    return response;
}

export async function updateContact(id: number, data: any): Promise<ActionResponse> {
    const response = await apiFetch<ActionResponse>(`/admin/contact-settings/${id}/update`, {
        method: "POST",
        body: data,
    });
    revalidatePath("/");
    revalidatePath("/dashboard/admin/contact-settings");
    return response;
}

export async function deleteContact(id: number): Promise<ActionResponse> {
    const response = await apiFetch<ActionResponse>(`/admin/contact-settings/${id}`, {
        method: "DELETE",
    });
    revalidatePath("/");
    revalidatePath("/dashboard/admin/contact-settings");
    return response;
}
