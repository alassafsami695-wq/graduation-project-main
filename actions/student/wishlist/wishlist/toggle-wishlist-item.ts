"use server";
import { apiFetch } from "@/lib/api";

export async function toggleWishlistItem(courseId: number): Promise<any> {
    const response = await apiFetch("/wishlist/toggle", {
        method: "POST",
        body: {
            course_id: courseId,
        },
    });
    return response
}
