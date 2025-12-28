"use server";
import { apiFetch } from "@/lib/api";

// Get careers (jobs)
export async function deleteCareer(careerId: any): Promise<any> {
    return apiFetch(`/admin/job-listings/${careerId}`, {
        method: "DELETE",
    });
}
