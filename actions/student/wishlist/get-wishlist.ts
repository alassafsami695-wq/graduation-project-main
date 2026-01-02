"use server";
import { apiFetch } from "@/lib/api";
import { Course } from "@/types";

export async function getWishlists(): Promise<Course[]> {
    const response = apiFetch<Course[]>("/wishlist", {
        method: "GET",
    });
    return response
}
