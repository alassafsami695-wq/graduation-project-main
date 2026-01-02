"use server";
import { apiFetch } from "@/lib/api";
import { Teacher, User } from "@/types";

export async function getTeachers(): Promise<Teacher[]> {
    const response = apiFetch<Teacher[]>("/admin/users", {
        method: "GET",
    });
    return response;
}

export async function getTeacherStudents(): Promise<User[]> {
    return apiFetch<User[]>("/teacher/students", {
        method: "GET",
    });
}
