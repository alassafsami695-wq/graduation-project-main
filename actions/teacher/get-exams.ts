"use server";
import { apiFetch } from "@/lib/api";
import { CourseWithExams } from "@/types";

export async function getTeacherExams(): Promise<CourseWithExams[]> {

    const response = apiFetch<CourseWithExams[]>("/teacher/courses/exams", {
        method: "GET",
    });
    return response
}
