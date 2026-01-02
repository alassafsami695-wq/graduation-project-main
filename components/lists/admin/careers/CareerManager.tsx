"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, Briefcase, BadgeDollarSign, Clock, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import CareerDialog from "./CareerDialog";
import { deleteCareer } from "@/actions/admin/careers/delete-careers";

interface Career {
    id: number;
    title: string;
    description: string;
    salary: string;
    company_name: string;
    company_email: string;
    job_type: string;
    working_hours: string;
    created_at: string | null;
}

interface CareerManagerProps {
    initialCareers: Career[];
}

export default function CareerManager({ initialCareers }: CareerManagerProps) {
    const [careers, setCareers] = useState(initialCareers);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCareers = careers.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (career: Career) => {
        setSelectedCareer(career);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا العرض الوظيفي؟")) return;

        try {
            await deleteCareer(id);
            setCareers(careers.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error deleting career:", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="البحث في الوظائف..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-bg-secondary border border-border rounded-2xl pr-12 pl-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                    />
                </div>

                <Button
                    onClick={() => {
                        setSelectedCareer(null);
                        setIsDialogOpen(true);
                    }}
                    className="btn-primary h-12 px-6 rounded-2xl flex items-center gap-2 text-white font-bold"
                >
                    <Plus className="w-5 h-5" />
                    <span>إضافة وظيفة</span>
                </Button>
            </div>

            <div className="space-y-4">
                {filteredCareers.map((career, index) => (
                    <motion.div
                        key={career.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-bg-secondary border border-border rounded-2xl p-4 hover:border-primary/30 transition-all duration-300"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <Briefcase className="w-6 h-6 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="text-lg font-black text-foreground truncate">
                                            {career.title}
                                        </h3>
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg border border-primary/20">
                                            {career.job_type}
                                        </span>
                                        <span className="text-xs font-bold text-foreground-muted">
                                            {career.company_name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-foreground-muted font-bold">
                                        <div className="flex items-center gap-1">
                                            <BadgeDollarSign className="w-3.5 h-3.5 text-primary" />
                                            <span>{career.salary}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{career.created_at ? new Date(career.created_at).toLocaleDateString('ar-SY') : 'مؤخراً'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                <Button
                                    onClick={() => handleEdit(career)}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl h-10 w-10 flex items-center justify-center border-border hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={() => handleDelete(career.id)}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl h-10 w-10 flex items-center justify-center text-red-500 border-red-500/10 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {filteredCareers.length === 0 && (
                    <div className="text-center py-24 bg-bg-secondary/50 border-2 border-dashed border-border rounded-[3rem]">
                        <Briefcase className="w-16 h-16 text-foreground-muted/20 mx-auto mb-4" />
                        <p className="text-foreground-muted font-black text-lg">لا توجد وظائف متاحة حالياً</p>
                    </div>
                )}
            </div>

            <CareerDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    window.location.reload();
                }}
                career={selectedCareer}
            />
        </div>
    );
}
