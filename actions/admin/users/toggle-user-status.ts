"use server";
import { apiFetch } from "@/lib/api";

export async function toggleUser(userId: number): Promise<any> {
    return apiFetch(`/admin/users/${userId}/toggle-status`, {
        method: "POST",
    });
}
