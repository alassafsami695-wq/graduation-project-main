"use client";

import React, { useEffect, useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { createNewFeature } from "@/actions/admin/features/create-new-feature";
import { updateFeature } from "@/actions/admin/features/update-feature";

interface Feature {
    id: number;
    title: string;
    description: string;
    image: string | null;
}

interface FeatureDialogProps {
    isOpen: boolean;
    onClose: () => void;
    feature?: Feature | null;
}

export default function FeatureDialog({ isOpen, onClose, feature }: FeatureDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (feature?.image) {
            setPreview(feature.image);
        } else {
            setPreview(null);
        }
    }, [feature, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);

            if (feature) {
                await updateFeature(feature.id, formData);
            } else {
                await createNewFeature(formData);
            }
            onClose();
        } catch (error) {
            console.error("Error saving feature:", error);
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
                    className="relative w-full max-w-lg bg-bg-secondary border border-border rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h2 className="text-xl font-black">
                            {feature ? "تعديل الميزة" : "إضافة ميزة جديدة"}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-xl transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold block">العنوان</label>
                            <input
                                name="title"
                                defaultValue={feature?.title}
                                required
                                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                placeholder="أدخل عنوان الميزة..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold block">الوصف</label>
                            <textarea
                                name="description"
                                defaultValue={feature?.description}
                                required
                                rows={4}
                                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                                placeholder="اشرح هذه الميزة بالتفصيل..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold block">الصورة</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => setPreview(reader.result as string);
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-3 group-hover:border-primary/50 transition-colors bg-bg-primary/50">
                                    {preview ? (
                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-xs font-bold">تغيير الصورة</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                                <Upload className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold">انقر أو اسحب لرفع صورة</p>
                                                <p className="text-xs text-foreground-muted">PNG, JPG حتى 5 ميجابايت</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
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
                                    feature ? "تحديث الميزة" : "حفظ الميزة"
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
