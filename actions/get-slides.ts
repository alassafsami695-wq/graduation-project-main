"use server";
import { apiFetch } from "@/lib/api";

export async function getSlides(): Promise<{ data: any[] }> {
    return apiFetch("/slides", {
        method: "GET",
    });
}
