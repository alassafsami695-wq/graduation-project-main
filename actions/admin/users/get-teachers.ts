"use server";
import { apiFetch } from "@/lib/api";
import { User } from "@/types";

export async function getTeachers(): Promise<User[]> {
    return apiFetch<User[]>("/admin/users?role=teacher", {
        method: "GET",
    });
}
