"use server";
import { apiFetch } from "@/lib/api";

export async function createNewCareer(data: any): Promise<any> {
    const response = await apiFetch(`/admin/job-listings`, {
        method: "POST",
        body: data,
    });
    return response;
}
