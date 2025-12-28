"use client";

import React, { useState } from "react";
import { X, Loader2, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { createNewCategory } from "@/actions/admin/categories/create-new-category";
import { updateCategory } from "@/actions/admin/categories/update-category";

interface Category {
    id: number;
    title: string;
}

interface CategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    category?: Category | null;
}

export default function CategoryDialog({ isOpen, onClose, category }: CategoryDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const data = { title: formData.get("title") as string };

            if (category) {
                await updateCategory(category.id, data);
            } else {
                await createNewCategory(data);
            }
            onClose();
        } catch (error) {
            console.error("Error saving category:", error);
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
                    className="relative w-full max-w-md bg-bg-secondary border border-border rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-border flex items-center justify-between bg-bg-primary/50">
                        <h2 className="text-xl font-black">
                            {category ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-xl transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Layers className="w-4 h-4 text-primary" />
                                اسم التصنيف
                            </label>
                            <input
                                name="title"
                                defaultValue={category?.title || ""}
                                required
                                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                placeholder="مثال: التصميم الجرافيكي"
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
                                    category ? "تحديث التصنيف" : "حفظ التصنيف"
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
