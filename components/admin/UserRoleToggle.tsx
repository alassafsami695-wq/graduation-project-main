"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { UserMinus, UserCog, ShieldCheck } from "lucide-react";
import { toggleAdminAction } from "@/actions/admin/users/toggle-admin";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface UserRoleToggleProps {
    userId: number;
    userName: string;
    currentRole: string; // 'admin', 'user', 'teacher', etc.
    isSuperAdmin?: boolean; // If the TARGET user is super admin
    onSuccess?: () => void;
}

export default function UserRoleToggle({ userId, userName, currentRole, isSuperAdmin = false, onSuccess }: UserRoleToggleProps) {
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);

    const isAdmin = currentRole === 'admin' || currentRole === 'super_admin';

    const handleToggle = () => {
        startTransition(async () => {
            const res = await toggleAdminAction(userId);
            if (res.success) {
                toast.success(res.message);
                setIsOpen(false);
                onSuccess?.();
            } else {
                toast.error(res.error);
            }
        });
    };

    // Hide if target is super admin
    if (isSuperAdmin) return null;

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(true)}
                className={`gap-2 border transition-colors ${isAdmin
                        ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-200"
                        : "text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                    }`}
            >
                {isAdmin ? <UserMinus className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                {isAdmin ? "إلغاء الصلاحية" : "منح صلاحية مسؤول"}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-border"
                        >
                            <h3 className="text-lg font-bold mb-2">تأكيد الإجراء</h3>
                            <p className="text-foreground-muted mb-6">
                                {isAdmin
                                    ? <span>سيتم سحب صلاحيات المسؤول من <strong>{userName}</strong> وتحويله إلى مستخدم عادي.</span>
                                    : <span>سيتم منح <strong>{userName}</strong> صلاحيات كاملة كمسؤول في النظام.</span>
                                }
                            </p>

                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                    disabled={isPending}
                                >
                                    إلغاء
                                </Button>
                                <Button
                                    onClick={handleToggle}
                                    disabled={isPending}
                                    className={`text-white ${isAdmin ? "bg-rose-500 hover:bg-rose-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
                                >
                                    {isPending ? "جاري التنفيذ..." : (isAdmin ? "تأكيد السحب" : "تأكيد المنح")}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
