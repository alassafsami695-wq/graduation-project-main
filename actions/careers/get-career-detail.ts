"use server";
import { apiFetch } from "@/lib/api";

export async function getCareerDetail(careerId: number): Promise<any> {
    return apiFetch(`/job-listings/${careerId}`, {
        method: "GET",
    });
}
