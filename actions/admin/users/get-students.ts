import { apiFetch } from "@/lib/api";

export async function getStudents(): Promise<any> {
    return apiFetch("/admin/users?role=user", {
        method: "GET",
    });
}
