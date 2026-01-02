"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { RegisterSchema, RegisterInput } from "@/lib/validations/auth.schema";
import { registerAction } from "@/actions/public/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

export default function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
    });

    const onSubmit = (values: RegisterInput) => {
        setError(null);
        startTransition(async () => {
            const result = await registerAction(values);
            if (result.error) {
                setError(result.error);
            } else if (result.success && result.redirectTo) {
                router.push(result.redirectTo);
            }
        });
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-bg-secondary/50 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gradient mb-2">إنشاء حساب</h1>
                    <p className="text-foreground-muted">انضم إلينا وابدأ رحلتك التعليمية اليوم</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium mr-1">الاسم الكامل</label>
                            <div className="relative">
                                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                                <Input
                                    {...register("name")}
                                    placeholder="سليمان ..."
                                    className="pr-11 bg-bg-primary/50 border-border focus:ring-primary focus:border-primary rounded-xl transition-all"
                                    disabled={isPending}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-red-500 mr-1 mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium mr-1">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                                <Input
                                    {...register("email")}
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pr-11 bg-bg-primary/50 border-border focus:ring-primary focus:border-primary rounded-xl transition-all"
                                    disabled={isPending}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 mr-1 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium mr-1">كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                                <Input
                                    {...register("password")}
                                    type="password"
                                    placeholder="••••••••"
                                    className="pr-11 bg-bg-primary/50 border-border focus:ring-primary focus:border-primary rounded-xl transition-all"
                                    disabled={isPending}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 mr-1 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium mr-1">تأكيد كلمة المرور</label>
                            <div className="relative">
                                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                                <Input
                                    {...register("password_confirmation")}
                                    type="password"
                                    placeholder="••••••••"
                                    className="pr-11 bg-bg-primary/50 border-border focus:ring-primary focus:border-primary rounded-xl transition-all"
                                    disabled={isPending}
                                />
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-xs text-red-500 mr-1 mt-1">{errors.password_confirmation.message}</p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full btn-primary h-12 text-lg group mt-2"
                    >
                        {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                إنشاء حساب
                            </span>
                        )}
                    </Button>

                    <p className="text-center text-sm text-foreground-muted pt-4">
                        لديك حساب بالفعل؟{" "}
                        <Link href="/auth/login" className="text-primary font-bold hover:underline">
                            تسجيل الدخول
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
