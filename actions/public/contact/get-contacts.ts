"use server";
import { apiFetch } from "@/lib/api";
import { ContactSettings } from "@/types";

export async function getContacts(): Promise<ContactSettings> {
    return apiFetch<ContactSettings>("/contact-settings", {
        method: "GET",
    });
}
