import { apiFetch } from "@/lib/api";
import { User } from "@/types";

export async function getAdmins(): Promise<User[]> {
    return apiFetch<User[]>("/admin/users?role=admin", {
        method: "GET",
    });
}
