import { apiFetch } from "@/lib/api";

export async function getAdmins(): Promise<any> {
    return apiFetch("/admin/users?role=admin", {
        method: "GET",
    });
}
