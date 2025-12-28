"use server";
import { apiFetch } from "@/lib/api";

export async function updateProfile(data: any): Promise<any> {
    return apiFetch("/profile/update", {
        method: "POST",
        body: data,
    });
}
