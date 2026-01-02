"use server"
import { apiFetch } from "@/lib/api";
import { ActionResponse } from "@/types";

// Renaming to match intent better, though keeping file name is fine
interface UpdateWalletData {
    account_number?: string;
    old_wallet_password?: string;
    new_wallet_password?: string;
}

export async function updateWallet(data: UpdateWalletData): Promise<ActionResponse> {
    return apiFetch<ActionResponse>(`/wallet/update`, {
        method: "POST",
        body: data
    });
}
