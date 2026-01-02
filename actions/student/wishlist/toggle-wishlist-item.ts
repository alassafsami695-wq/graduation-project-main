"use server";
import { apiFetch } from "@/lib/api";
import { ActionResponse } from "@/types";

export async function toggleWishlistItem(courseId: number): Promise<ActionResponse> {
    const response = await apiFetch<ActionResponse>("/wishlist/toggle", {
        method: "POST",
        body: {
            course_id: courseId,
        },
    });
    return response
}
