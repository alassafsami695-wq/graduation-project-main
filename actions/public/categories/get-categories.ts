"use server";
import { apiFetch } from "@/lib/api";
import { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
    return apiFetch<Category[]>("/paths", {
        method: "GET",
    });
}
