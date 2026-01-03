import { z } from "zod";

export const LoginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "البريد الإلكتروني مطلوب" })
        .email({ message: "البريد الإلكتروني غير صالح" }),
    password: z
        .string()
        .min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
});

export const RegisterSchema = z.object({
    name: z.string().min(2, { message: "الاسم مطلوب" }),
    email: z
        .string()
        .min(1, { message: "البريد الإلكتروني مطلوب" })
        .email({ message: "البريد الإلكتروني غير صالح" }),
    password: z
        .string()
        .min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
    password_confirmation: z
        .string()
        .min(1, { message: "تأكيد كلمة المرور مطلوب" }),
    wallet_password: z
        .string()
        .min(4, { message: "كلمة مرور المحفظة يجب أن تكون 4 أحرف على الأقل" }),
}).refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
