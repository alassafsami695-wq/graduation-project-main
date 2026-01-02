"use server"

import { apiFetch } from "@/lib/api";
import { Student } from "@/types/user.types";

export async function getTeacherStudents(): Promise<Student[]> {
    const res = await apiFetch<Student[]>("/statistics/students", {
        method: "GET",
    });

    return res;
}