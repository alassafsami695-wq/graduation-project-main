"use server";
import { apiFetch } from "@/lib/api";
import { ActionResponse } from "@/types";

export async function simulatePayment(transactionId: number | string): Promise<ActionResponse> {
    // Assuming the route is /payment/simulate/{id} based on controller method simulateSuccess($orderId)
    // Using POST as it performs a state change (transaction completion)
    return apiFetch<ActionResponse>(`/payment/simulate/${transactionId}`, {
        method: "POST",
    });
}
