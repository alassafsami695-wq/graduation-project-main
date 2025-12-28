"use server";
import { apiFetch } from "@/lib/api";

// Get careers (jobs)
export async function getCareers(): Promise<any> {
    return apiFetch("/job-listings", {
        method: "GET",

    });
}
