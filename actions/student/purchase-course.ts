"use server"
import { apiFetch } from "@/lib/api";

export async function purchaseCourse(userWallet: any, courseId: number) {
    const response = await apiFetch(`/courses/${courseId}/purchase`, {
        method: "POST",
        body: userWallet
    });
    return response;
}
