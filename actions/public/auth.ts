"use server";

import { apiFetch } from "@/lib/api";
import { cookies } from "next/headers";
import { LoginInput, RegisterInput } from "@/lib/validations/auth.schema";

import { ActionResponse } from "@/types";

export async function loginAction(values: LoginInput): Promise<ActionResponse> {
    try {
        const response = await apiFetch<any>("/login", {
            method: "POST",
            body: values,
        });

        const token = response.access_token;
        const userType = response.user?.type;

        if (!token) {
            return { success: false, error: "فشل الحصول على رمز الدخول" };
        }

        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        cookieStore.set("role", userType, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        // Determine redirect path based on user type
        let redirectTo = "/";
        if (userType === "teacher") {
            redirectTo = "/dashboard/teacher";
        } else if (userType === "super_admin") {
            redirectTo = "/dashboard/admin";
        } else if (userType === "user") {
            redirectTo = "/dashboard/student";
        }

        return {
            success: true,
            redirectTo,
            user: response.user,
            access_token: response.access_token
        };
    } catch (error: any) {
        return { success: false, error: error.message || "حدث خطأ أثناء تسجيل الدخول" };
    }
}

export async function registerStudentAction(values: RegisterInput): Promise<ActionResponse> {
    try {
        await apiFetch("/register/student", {
            method: "POST",
            body: {
                name: values.name,
                email: values.email,
                password: values.password,
                password_confirmation: values.password_confirmation,
                wallet_password: values.wallet_password,
            },
        });

        const cookieStore = await cookies();
        cookieStore.set("email", values.email, {
            path: "/",
        });

        return { success: true, redirectTo: "/verification" };
    } catch (error: any) {
        return { success: false, error: error.message || "حدث خطأ أثناء التسجيل" };
    }
}

export async function registerTeacherAction(values: RegisterInput): Promise<ActionResponse> {
    try {
        await apiFetch("/register/teacher", {
            method: "POST",
            body: {
                name: values.name,
                email: values.email,
                password: values.password,
                password_confirmation: values.password_confirmation,
                wallet_password: values.wallet_password,
            },
        });

        const cookieStore = await cookies();
        cookieStore.set("email", values.email, {
            path: "/",
        });

        return { success: true, redirectTo: "/verification" };
    } catch (error: any) {
        return { success: false, error: error.message || "حدث خطأ أثناء التسجيل" };
    }
}

export async function logoutAction(): Promise<ActionResponse> {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return { success: true };
}
