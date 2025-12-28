"use server";
import { apiFetch } from "@/lib/api";

export async function getContacts(): Promise<{ data: any[] }> {
    return apiFetch("/contact-settings", {
        method: "GET",
    });
}
