import { apiFetch } from "@/lib/api";

export async function getTeachers(): Promise<any> {
    return apiFetch("/admin/users?role=teacher", {
        method: "GET",
    });
}
