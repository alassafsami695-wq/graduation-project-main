"use server";
import { apiFetch } from "@/lib/api";

export async function getFeatures(): Promise<any> {
    return apiFetch("/features", {
        method: "GET",
    });
}
