"use server";
import { apiFetch } from "@/lib/api";
import { Career } from "@/types/career.types";

export async function getCareerDetail(careerId: number): Promise<Career> {
    return apiFetch<Career>(`/job-listings/${careerId}`, {
        method: "GET",
    });
}
