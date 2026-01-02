"use server";
import { apiFetch } from "@/lib/api";

export async function getStats(): Promise<any> {
    return apiFetch<any>(`/dashboard/stats`, {
        method: "GET",
    });
}