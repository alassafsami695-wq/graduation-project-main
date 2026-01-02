import { apiFetch } from "@/lib/api";
import { CareersResponse } from "@/types/career.types";

// Get careers (jobs)
export async function getCareers(): Promise<CareersResponse> {
    return apiFetch<CareersResponse>("/job-listings", {
        method: "GET",
    });
}
