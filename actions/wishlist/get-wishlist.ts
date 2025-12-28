"use server";
import { apiFetch } from "@/lib/api";

export async function getWishlists(): Promise<any> {
    const response = apiFetch("/wishlist", {
        method: "GET",
    });
    return response
}
