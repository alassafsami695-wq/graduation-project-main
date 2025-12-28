"use server";
import { apiFetch } from "@/lib/api";

export async function simulatePayment(transactionId: number | string) {
    // Assuming the route is /payment/simulate/{id} based on controller method simulateSuccess($orderId)
    // Using POST as it performs a state change (transaction completion)
    return apiFetch(`/payment/simulate/${transactionId}`, {
        method: "POST",
    });
}
