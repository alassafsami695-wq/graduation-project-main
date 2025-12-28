"use server";
import { apiFetch } from "@/lib/api";

export async function getBestSellingCourses(): Promise<{ data: any[] }> {
    return apiFetch("/courses/best-selling", {
        method: "GET",
    });
}