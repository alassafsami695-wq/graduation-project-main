"use server";
import { apiFetch } from "@/lib/api";
import { ActionResponse } from "@/types";

export async function purchaseCourse(userWallet: any, courseId: number): Promise<ActionResponse> {
    const response = await apiFetch<ActionResponse>(`/courses/${courseId}/purchase`, {
        method: "POST",
        body: userWallet
    });
    return response;
}
