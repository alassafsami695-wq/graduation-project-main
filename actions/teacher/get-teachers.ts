import { apiFetch } from "@/lib/api";

export async function getTeachers(): Promise<any> {

    const response = apiFetch("/admin/users", {
        method: "GET",
    });

    return response
}
