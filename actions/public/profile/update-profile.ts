"use server";
import { apiFetch } from "@/lib/api";
import { ActionResponse, Profile } from "@/types";

export async function updateProfile(data: any): Promise<ActionResponse<Profile>> {
    return apiFetch<ActionResponse<Profile>>("/profile/update", {
        method: "POST",
        body: data,
    });
}
