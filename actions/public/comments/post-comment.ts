"use server"
import { apiFetch } from "@/lib/api";
import { getProfile } from "@/actions/get-profile";
import { ActionResponse } from "@/types";

export async function postComment(data: any): Promise<ActionResponse> {
    try {
        const user = await getProfile();
        // Assuming user.status exists based on the original logic
        const userProfile = user as any;
        if (userProfile.status === 'suspended') {
            return { success: false, error: "Your account is suspended. You cannot post comments." };
        }

        const response = await apiFetch<ActionResponse>("/comments", {
            method: "POST",
            body: data,
        });
        return response;
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to post comment" };
    }
}