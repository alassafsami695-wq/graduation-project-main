"use server";
import { apiFetch } from "@/lib/api";
import { ActionResponse } from "@/types";

// Renaming to match intent better, though keeping file name is fine
export async function initiateDeposit(amount: number): Promise<ActionResponse> {
    return apiFetch<ActionResponse>(`/deposit`, {
        method: "POST",
        body: { amount }
    });
}
