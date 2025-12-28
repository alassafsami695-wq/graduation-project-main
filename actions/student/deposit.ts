"use server"
import { apiFetch } from "@/lib/api";

// Renaming to match intent better, though keeping file name is fine
export async function initiateDeposit(amount: number) {
    return apiFetch(`/deposit`, {
        method: "POST",
        body: { amount }
    });
}
