"use server"
import { apiFetch } from "@/lib/api";
import { getProfile } from "@/actions/student/get-profile";

export async function purchaseCourses(coursesIds: number[]) {
    try {
        const user = await getProfile();
        if (user.status === 'suspended') {
            return { error: "Your account is suspended. You cannot purchase courses." };
        }

        const response = await apiFetch(`/courses/purchase`, {
            method: "POST",
            body: {
                course_ids: coursesIds
            }
        });
        return response;
    } catch (error: any) {
        return {
            error: error.message || "Failed to purchase courses"
        };
    }
}

