"use server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function updateCareer(data: any): Promise<any> {
    const response = await apiFetch(`/admin/job-listings/${data.id}`, {
        method: "POST",
        body: data,
    });
    // revalidatePath("/dashboard/admin/careers");
    // revalidatePath("/careers");
    return response;
}
