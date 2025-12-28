"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function storeCareer(data: any) {
    const response = await apiFetch("/admin/job-listings", {
        method: "POST",
        body: data,
    });
    revalidatePath("/careers");
    revalidatePath("/dashboard/admin/careers");
    return response;
}

export async function updateCareer(id: number, data: any) {
    const response = await apiFetch(`/admin/job-listings/${id}/update`, {
        method: "POST", // Using POST for update based on user's route pattern
        body: data,
    });
    revalidatePath("/careers");
    revalidatePath(`/careers/${id}`);
    revalidatePath("/dashboard/admin/careers");
    return response;
}

export async function deleteCareer(id: number) {
    const response = await apiFetch(`/admin/job-listings/${id}`, {
        method: "DELETE",
    });
    revalidatePath("/careers");
    revalidatePath("/dashboard/admin/careers");
    return response;
}
