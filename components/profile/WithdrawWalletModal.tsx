"use client";

import React, { useState } from "react";
import { X, Wallet, Banknote, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { withdrawFromWallet } from "@/actions/public/wallet/wallet";

interface WithdrawWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    wallet: any;
}

export default function WithdrawWalletModal({ isOpen, onClose, wallet }: WithdrawWalletModalProps) {
    const [amount, setAmount] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || isNaN(Number(amount)) || Number(amount) < 100) {
            toast.error("أقل مبلغ للسحب هو 100 ريال");
            return;
        }

        if (Number(amount) > wallet?.balance) {
            toast.error("المبلغ المطلوب أكبر من الرصيد المتاح");
            return;
        }

        if (!password) {
            toast.error("يرجى إدخال كلمة مرور المحفظة");
            return;
        }

        setLoading(true);
        setStep('processing');

        try {
            const res = await withdrawFromWallet({
                amount: Number(amount),
                wallet_password: password
            });

            if (res?.success) {
                setStep('success');
                toast.success(res.message || "تم طلب السحب بنجاح!");
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                throw new Error((res as any)?.error || "فشل في طلب السحب");
            }
        } catch (error: any) {
            console.error("Withdraw error:", error);
            toast.error(error.message || "حدث خطأ أثناء طلب السحب");
            setStep('input');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep('input');
        setAmount("");
        setPassword("");
        onClose();
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
                <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Banknote className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold">سحب الرصيد</h2>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Balance Display */}
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">الرصيد المتاح</p>
                        <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{wallet?.balance || 0} ريال</p>
                    </div>

                    {step === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-emerald-600" />
                            </div>
                            <p className="text-lg font-bold text-emerald-600">تم طلب السحب بنجاح!</p>
                            <p className="text-sm text-slate-500">سيتم تحويل المبلغ خلال 24 ساعة</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground-muted">المبلغ المراد سحبه (ريال)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="100"
                                        className="w-full text-2xl font-black p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all text-center"
                                        max={wallet?.balance}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 text-center">أقل مبلغ للسحب هو 100 ريال</p>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[100, 500, 1000, wallet?.balance].filter(Boolean).map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setAmount(val.toString())}
                                        className="py-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 font-bold rounded-xl transition-colors text-xs"
                                    >
                                        {val === wallet?.balance ? "الكل" : `${val}`}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground-muted">كلمة مرور المحفظة</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all"
                                    placeholder="أدخل كلمة مرور المحفظة"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {step === 'processing' ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        جاري المعالجة...
                                    </>
                                ) : (
                                    "تأكيد السحب"
                                )}
                            </button>
                        </>
                    )}
                </form>
            </motion.div>
        </div>
    );
}
