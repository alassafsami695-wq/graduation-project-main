"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2, Image as ImageIcon, Link as LinkIcon, Calendar, CheckCircle2, AlignLeft, Type } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { createNewAd } from "@/actions/admin/ads/create-new-ad";
import { updateAd } from "@/actions/admin/ads/update-ad";

interface Slide {
    id: number | string;
    title: string;
    description: string;
    image_url?: string | null;
    image_path?: string | null;
    link?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    is_active?: boolean | number;
}

interface SliderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    slide?: Slide | null;
}

export default function SliderDialog({ isOpen, onClose, slide }: SliderDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (slide) {
            setPreviewImage(slide.image_url || slide.image_path || null);
        } else {
            setPreviewImage(null);
        }
    }, [slide, isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);

            // Handle checkbox for is_active
            if (!formData.has("is_active")) {
                formData.append("is_active", "0");
            } else {
                formData.set("is_active", "1");
            }

            if (slide) {
                await updateAd(slide.id, formData);
            } else {
                await createNewAd(formData);
            }
            onClose();
        } catch (error) {
            console.error("Error saving slide:", error);
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
                    className="relative w-full max-w-2xl bg-bg-secondary border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                >
                    <div className="p-6 border-b border-border flex items-center justify-between bg-bg-primary/50">
                        <h2 className="text-xl font-black">
                            {slide ? "تعديل الإعلان" : "إضافة إعلان (سلايدر) جديد"}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-xl transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <Type className="w-4 h-4 text-primary" />
                                    العنوان
                                </label>
                                <input
                                    name="title"
                                    defaultValue={slide?.title || ""}
                                    required
                                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                    placeholder="مثال: خصم 50% على جميع الدورات"
                                />
                            </div>

                            {/* Link */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4 text-primary" />
                                    الرابط (اختياري)
                                </label>
                                <input
                                    name="link"
                                    defaultValue={slide?.link || ""}
                                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                    placeholder="https://example.com/course"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-primary" />
                                الوصف
                            </label>
                            <textarea
                                name="description"
                                defaultValue={slide?.description || ""}
                                rows={3}
                                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none font-medium"
                                placeholder="اكتب وصفاً قصيراً يظهر على السلايدر..."
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    تاريخ البدء
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    defaultValue={slide?.start_date ? slide.start_date.split('T')[0] : ""}
                                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    تاريخ الانتهاء
                                </label>
                                <input
                                    type="date"
                                    name="end_date"
                                    defaultValue={slide?.end_date ? slide.end_date.split('T')[0] : ""}
                                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-primary" />
                                صورة السلايدر
                            </label>
                            <div className="relative group aspect-video rounded-2xl border-2 border-dashed border-border overflow-hidden bg-bg-primary/50 flex flex-col items-center justify-center transition-all hover:border-primary/50">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <ImageIcon className="w-12 h-12 text-foreground-muted/20" />
                                        <p className="text-xs text-foreground-muted mt-2">اضغط لرفع صورة المقاس الموصى به: 1200x500</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    required={!slide}
                                />
                                {previewImage && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <p className="text-white font-bold text-sm">تغيير الصورة</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Active Switch */}
                        <div className="flex items-center gap-3 p-4 bg-bg-primary/30 rounded-2xl border border-border">
                            <input
                                type="checkbox"
                                name="is_active"
                                id="is_active"
                                defaultChecked={slide ? Boolean(slide.is_active) : true}
                                className="w-5 h-5 accent-primary cursor-pointer"
                            />
                            <label htmlFor="is_active" className="text-sm font-bold cursor-pointer">
                                تفعيل السلايدر (ظهوره في الصفحة الرئيسية)
                            </label>
                        </div>

                        <div className="pt-4 flex gap-3 sticky bottom-0 bg-bg-secondary pb-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 btn-primary h-12 rounded-xl text-white font-bold"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    slide ? "تحديث السلايدر" : "حفظ السلايدر"
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
