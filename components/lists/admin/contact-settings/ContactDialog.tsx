"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2, MapPin, Phone, Mail, MessageCircle, Link } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { storeContact, updateContact } from "@/actions/admin/contact-settings";

interface ContactSettings {
    id: number;
    location: string | null;
    phone_primary: string | null;
    phone_secondary: string | null;
    email: string | null;
    whatsapp: string | null;
    map_link: string | null;
}

interface ContactDialogProps {
    isOpen: boolean;
    onClose: () => void;
    contact?: ContactSettings | null;
}

export default function ContactDialog({ isOpen, onClose, contact }: ContactDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());

            if (contact) {
                await updateContact(contact.id, data);
            } else {
                await storeContact(data);
            }
            onClose();
        } catch (error) {
            console.error("Error saving contact setting:", error);
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
                    className="relative w-full max-w-2xl bg-bg-secondary border border-border rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-border flex items-center justify-between bg-bg-primary/50">
                        <h2 className="text-xl font-black">
                            {contact ? "تعديل معلومات التواصل" : "إضافة معلومات جديـدة"}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-xl transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                الموقع
                            </label>
                            <input
                                name="location"
                                defaultValue={contact?.location || ""}
                                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                placeholder="مثال: دمشق، المزة"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                الهاتف الأساسي
                            </label>
                            <input
                                name="phone_primary"
                                defaultValue={contact?.phone_primary || ""}
                                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                placeholder="09xxxxxxx"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                الهاتف الثانوي
                            </label>
                            <input
                                name="phone_secondary"
                                defaultValue={contact?.phone_secondary || ""}
                                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                placeholder="09xxxxxxx"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" />
                                البريد الإلكتروني
                            </label>
                            <input
                                type="email"
                                name="email"
                                defaultValue={contact?.email || ""}
                                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                                placeholder="example@domain.com"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-green-500" />
                                واتساب
                            </label>
                            <input
                                name="whatsapp"
                                defaultValue={contact?.whatsapp || ""}
                                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all font-bold"
                                placeholder="09xxxxxxx"
                            />
                        </div>

                        <div className="space-y-4 md:col-span-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Link className="w-4 h-4 text-primary" />
                                رابط الخريطة (Google Maps)
                            </label>
                            <input
                                name="map_link"
                                defaultValue={contact?.map_link || ""}
                                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                placeholder="https://goo.gl/maps/..."
                            />
                        </div>

                        <div className="md:col-span-2 pt-4 flex gap-3">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 btn-primary h-12 rounded-xl text-white font-bold"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    contact ? "تحديث البيانات" : "حفظ البيانات"
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
