"use server";

import { apiFetch } from "@/lib/api";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function toggleAdminAction(userId: number): Promise<ActionResponse> {
    try {
        await apiFetch(`/users/${userId}/toggle-admin`, {
            method: "POST",
        });

        revalidatePath("/dashboard/admin/admins");
        return { success: true, message: "تم تحديث صلاحيات المسؤول بنجاح" };
    } catch (error: any) {
        return { success: false, error: error.message || "حدث خطأ أثناء تحديث الصلاحيات" };
    }
}
