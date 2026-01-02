"use server";
import { apiFetch } from "@/lib/api";
import { Profile } from "@/types/user.types";

export async function getProfile(): Promise<Profile> {
    return apiFetch<Profile>("/profile", {
        method: "GET",
    });
}
