import { apiFetch } from "@/lib/api";
import { User } from "@/types";

export async function getStudents(): Promise<User[]> {
    return apiFetch<User[]>("/admin/users?role=student", {
        method: "GET",
    });
}
