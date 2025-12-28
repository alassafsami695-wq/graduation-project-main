"use server";
import { apiFetch } from "@/lib/api";

export async function getCategories(): Promise<{ data: any[] }> {
    return apiFetch("/paths", {
        method: "GET",
    });
}
