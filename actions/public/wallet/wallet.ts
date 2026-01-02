"use server"
import { apiFetch } from "@/lib/api"

export interface WithdrawRequest {
    amount: number;
    wallet_password: string;
}

export interface WithdrawResponse {
    success: boolean;
    message: string;
    new_balance?: number;
}

/**
 * Request a withdrawal from the user's wallet
 * (Teachers/users withdrawing their earnings)
 */
export async function withdrawFromWallet(data: WithdrawRequest): Promise<WithdrawResponse> {
    return apiFetch("/wallet/withdraw", {
        method: "POST",
        body: data
    });
}