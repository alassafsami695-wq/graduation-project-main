"use client";

import React, { useState } from "react";
import { X, Wallet, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { initiateDeposit } from "@/actions/student/deposit";
import { simulatePayment } from "@/actions/student/simulate-payment";
import { useAuthStore } from "@/store/auth";

interface ChargeWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChargeWalletModal({ isOpen, onClose }: ChargeWalletModalProps) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
    const { token, setAuth } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Updated validation for minimum amount of 1000
        if (!amount || isNaN(Number(amount)) || Number(amount) < 1000) {
            toast.error("أقل مبلغ للشحن هو 1000 ريال");
            return;
        }

        setLoading(true);
        setStep('processing');

        try {
            // Step 1: Initiate Deposit
            const initRes = await initiateDeposit(Number(amount));

            console.log(initRes);

            if (initRes && initRes.transaction_id) {
                toast.info("جاري توجيهك لبوابة الدفع...");

                // Step 2: Simulate Payment (Simulating external gateway success)
                // In a real app, you would redirect to initRes.payment_url

                await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay for UX

                const simRes = await simulatePayment(initRes.transaction_id);

                if (simRes && simRes.success) {
                    setStep('success');
                    toast.success("تم شحن الرصيد بنجاح!");

                    // Refresh user data functionality if available or force reload
                    // Since we don't have a direct 'get fresh user' action handy that returns the full user object cleanly, 
                    // and the simulation endpoint might not return the user, we might need to reload.
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    throw new Error("فشل في تأكيد الدفع");
                }

            } else {
                throw new Error(initRes?.error || "فشل في إنشاء طلب الشحن");
            }
        } catch (error: any) {
            console.error("Deposit error:", error);
            toast.error(error.message || "حدث خطأ أثناء الاتصال بالخادم");
            setStep('input');
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
                        <h2 className="text-xl font-bold">شحن الرصيد</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground-muted">المبلغ المراد شحنه (ريال)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="1000"
                                className="w-full text-2xl font-black p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary rounded-2xl outline-none transition-all text-center"
                                autoFocus
                            />
                        </div>
                        <p className="text-xs text-red-500 font-bold text-center">أقل مبلغ للشحن هو 1000 ريال</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[1000, 2000, 5000, 10000].map((val) => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => setAmount(val.toString())}
                                className="py-2 bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary font-bold rounded-xl transition-colors text-sm"
                            >
                                {val} ريال
                            </button>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 ${step === 'success' ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20' : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'}`}
                    >
                        {step === 'processing' ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                جاري المعالجة...
                            </>
                        ) : step === 'success' ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                تم بنجاح!
                            </>
                        ) : (
                            "تأكيد الشحن"
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
