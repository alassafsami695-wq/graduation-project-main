"use server";
import { apiFetch } from "@/lib/api";
import { TeacherCourse } from "@/types";

export async function getTeacherCourses(): Promise<TeacherCourse[]> {

    const response = apiFetch<TeacherCourse[]>("/teacher/courses", {
        method: "GET",
    });

    return response
}
