"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2, Briefcase, BadgeDollarSign, AlignLeft, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { createNewCareer } from "@/actions/admin/careers/create-new-career";
import { updateCareer } from "@/actions/admin/careers/update-career";

interface Career {
    id: number;
    title: string;
    description: string;
    salary: string;
    company_name: string;
    company_email: string;
    job_type: string;
    working_hours: string;
}

interface CareerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    career?: Career | null;
}

export default function CareerDialog({ isOpen, onClose, career }: CareerDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());

            if (career) {
                await updateCareer({ ...data, id: career.id });
            } else {
                await createNewCareer(data);
            }
            onClose();
        } catch (error) {
            console.error("Error saving career:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-xl bg-bg-secondary border border-border rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-border flex items-center justify-between bg-bg-primary/50">
                        <h2 className="text-xl font-black">
                            {career ? "تعديل الوظيفة" : "إضافة وظيفة جديدة"}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-xl transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-primary" />
                                المسمى الوظيفي
                            </label>
                            <input
                                name="title"
                                defaultValue={career?.title || ""}
                                required
                                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                placeholder="مثال: مطور واجهات أمامية"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <BadgeDollarSign className="w-4 h-4 text-primary" />
                                    الراتب المتوقع
                                </label>
                                <input
                                    name="salary"
                                    defaultValue={career?.salary || ""}
                                    required
                                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                    placeholder="مثال: $2000 - $3000"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    عدد ساعات العمل
                                </label>
                                <input
                                    type="number"
                                    name="working_hours"
                                    defaultValue={career?.working_hours || "8"}
                                    required
                                    min="1"
                                    max="24"
                                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                    placeholder="مثال: 8"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-primary" />
                                    اسم الشركة
                                </label>
                                <input
                                    name="company_name"
                                    defaultValue={career?.company_name || ""}
                                    required
                                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                    placeholder="مثال: أكاديمية الإلكترونيك"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-primary" />
                                    بريد الشركة الإلكتروني
                                </label>
                                <input
                                    type="email"
                                    name="company_email"
                                    defaultValue={career?.company_email || ""}
                                    required
                                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                    placeholder="company@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-primary" />
                                نوع الوظيفة
                            </label>
                            <select
                                name="job_type"
                                defaultValue={career?.job_type || "دوام كامل"}
                                required
                                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold appearance-none"
                            >
                                <option value="دوام كامل">دوام كامل</option>
                                <option value="دوام جزئي">دوام جزئي</option>
                                <option value="عن بعد">عن بعد</option>
                                <option value="تدريب">تدريب</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-primary" />
                                الوصف الوظيفي
                            </label>
                            <textarea
                                name="description"
                                defaultValue={career?.description || ""}
                                required
                                rows={6}
                                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none font-medium"
                                placeholder="اكتب تفاصيل الوظيفة والمتطلبات..."
                            />
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 btn-primary h-12 rounded-xl text-white font-bold"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    career ? "تحديث الوظيفة" : "حفظ الوظيفة"
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 h-12 rounded-xl font-bold"
                            >
                                إلغاء
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
