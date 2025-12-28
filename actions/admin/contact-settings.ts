"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function storeContact(data: any) {
    const response = await apiFetch("/admin/contact-settings", {
        method: "POST",
        body: data,
    });
    revalidatePath("/");
    revalidatePath("/dashboard/admin/contact-settings");
    return response;
}

export async function updateContact(id: number, data: any) {
    const response = await apiFetch(`/admin/contact-settings/${id}/update`, {
        method: "POST",
        body: data,
    });
    revalidatePath("/");
    revalidatePath("/dashboard/admin/contact-settings");
    return response;
}

export async function deleteContact(id: number) {
    const response = await apiFetch(`/admin/contact-settings/${id}`, {
        method: "DELETE",
    });
    revalidatePath("/");
    revalidatePath("/dashboard/admin/contact-settings");
    return response;
}
