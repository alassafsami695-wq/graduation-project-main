"use server";
import { apiFetch } from "@/lib/api";

export async function getProfile(): Promise<any> {
    return apiFetch("/profile", {
        method: "GET",
    });
}
