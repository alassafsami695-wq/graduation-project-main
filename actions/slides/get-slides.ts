import { apiFetch } from "@/lib/api";

export async function getAds(): Promise<any> {
    return apiFetch("/ads", {
        method: "GET",
    });
}
