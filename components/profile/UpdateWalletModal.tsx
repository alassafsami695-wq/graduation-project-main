"use client";

import React, { useState } from "react";
import { X, Wallet, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { updateWallet } from "@/actions/student/update-wallet";

interface UpdateWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    wallet: any;
}

export default function UpdateWalletModal({ isOpen, onClose, wallet }: UpdateWalletModalProps) {
    const [accountNumber, setAccountNumber] = useState(wallet?.account_number || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data: any = {};
            if (accountNumber !== wallet?.account_number) {
                data.account_number = accountNumber;
            }
            if (newPassword) {
                if (!oldPassword) {
                    toast.error("يرجى إدخال كلمة المرور القديمة");
                    setLoading(false);
                    return;
                }
                data.old_wallet_password = oldPassword;
                data.new_wallet_password = newPassword;
            }

            if (Object.keys(data).length === 0) {
                toast.info("لم يتم تغيير أي بيانات");
                setLoading(false);
                return;
            }

            const res: any = await updateWallet(data);

            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success("تم تحديث معلومات المحفظة بنجاح");
                onClose();
                // Optionally reload or callback to refresh
                window.location.reload();
            }
        } catch (error: any) {
            console.error("Update wallet error:", error);
            toast.error("حدث خطأ أثناء تحديث المحفظة");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            >
                <div className="p-6 bg-gradient-to-r from-primary to-indigo-600 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold">تحديث المحفظة</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground-muted">رقم الحساب</label>
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary rounded-2xl outline-none transition-all"
                                placeholder="أدخل رقم الحساب"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground-muted">كلمة المرور الجديدة (اختياري)</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary rounded-2xl outline-none transition-all"
                                placeholder="أدخل كلمة المرور الجديدة"
                            />
                        </div>
                        {newPassword && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground-muted">كلمة المرور القديمة</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary rounded-2xl outline-none transition-all"
                                    placeholder="أدخل كلمة المرور القديمة"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                جاري التحديث...
                            </>
                        ) : (
                            "حفظ التغييرات"
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
