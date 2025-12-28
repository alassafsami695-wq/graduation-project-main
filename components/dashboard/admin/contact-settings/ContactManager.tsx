"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, MapPin, Phone, Mail, MessageCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import ContactDialog from "./ContactDialog";
import { deleteContact } from "@/actions/admin/contact-settings";

interface ContactSettings {
    id: number;
    location: string | null;
    phone_primary: string | null;
    phone_secondary: string | null;
    email: string | null;
    whatsapp: string | null;
    map_link: string | null;
}

interface ContactManagerProps {
    initialContacts: ContactSettings;
}

export default function ContactManager({ initialContacts }: ContactManagerProps) {
    const [contacts, setContacts] = useState(initialContacts);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<ContactSettings | null>(null);

    const handleEdit = (contact: ContactSettings) => {
        setSelectedContact(contact);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذه الإعدادات؟")) return;

        try {
            await deleteContact(id);
            // setContacts(contacts.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error deleting contact setting:", error);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-8 max-w-4xl">
                <motion.div
                    key={contacts.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                >
                    <div className="space-y-8">
                        <div className="flex items-center justify-between border-b border-border/50 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-black text-foreground">{contacts.location || "بدون عنوان"}</h3>
                            </div>

                            <Button
                                onClick={() => handleEdit(contacts)}
                                variant="outline"
                                className="rounded-xl h-11 px-6 flex items-center gap-2 border-border hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all font-bold"
                            >
                                <Pencil className="w-4 h-4" />
                                <span>تعديل البيانات</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-secondary/30 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-foreground-muted uppercase tracking-wider">رقم الهاتف</p>
                                    <p className="text-sm font-bold text-foreground truncate">{contacts.phone_primary}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-secondary/30 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                                    <MessageCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-foreground-muted uppercase tracking-wider">واتساب</p>
                                    <p className="text-sm font-bold text-foreground truncate">{contacts.whatsapp}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-secondary/30 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-foreground-muted uppercase tracking-wider">البريد الإلكتروني</p>
                                    <p className="text-sm font-bold text-foreground truncate">{contacts.email}</p>
                                </div>
                            </div>
                        </div>

                        {contacts.map_link && (
                            <div className="pt-4">
                                <a
                                    href={contacts.map_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-bg-secondary border border-border rounded-2xl text-sm font-black hover:bg-primary hover:text-white transition-all group/link shadow-sm"
                                >
                                    <ExternalLink className="w-5 h-5 group-hover/link:scale-110 transition-transform" />
                                    <span>عرض الموقع على الخريطة بالتفصيل</span>
                                </a>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <ContactDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    // Force refresh for simplicity as server action handles revalidation
                    window.location.reload();
                }}
                contact={selectedContact}
            />
        </div>
    );
}

