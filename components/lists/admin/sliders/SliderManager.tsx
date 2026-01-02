"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon, Search, ExternalLink, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import SliderDialog from "./SliderDialog";
import { deleteAd } from "@/actions/admin/ads/delete-ad";

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
    created_at?: string | null;
}

interface SliderManagerProps {
    initialSlides: Slide[];
}

export default function SliderManager({ initialSlides }: SliderManagerProps) {
    const [slides, setSlides] = useState(initialSlides);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSlides = slides.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (slide: Slide) => {
        setSelectedSlide(slide);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number | string) => {
        if (!confirm("هل أنت متأكد من حذف هذا السلايدر؟")) return;

        try {
            await deleteAd(id);
            setSlides(slides.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting slide:", error);
        }
    };

    const formatDate = (date: string | null | undefined) => {
        if (!date) return "غير محدد";
        return new Date(date).toLocaleDateString('ar-SY');
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="البحث في السلايدرز..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-bg-secondary border border-border rounded-2xl pr-12 pl-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                    />
                </div>

                <Button
                    onClick={() => {
                        setSelectedSlide(null);
                        setIsDialogOpen(true);
                    }}
                    className="btn-primary h-12 px-6 rounded-2xl flex items-center gap-2 text-white font-bold"
                >
                    <Plus className="w-5 h-5" />
                    <span>إضافة سلايدر</span>
                </Button>
            </div>

            <div className="space-y-4">
                {filteredSlides.map((slide, index) => (
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-bg-secondary border border-border rounded-2xl p-4 hover:border-primary/30 transition-all duration-300"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-24 h-16 bg-primary/10 rounded-xl overflow-hidden shrink-0 border border-border">
                                    {(slide.image_url || slide.image_path) ? (
                                        <img src={slide.image_url || slide.image_path || ""} alt={slide.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6 text-primary" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="text-lg font-black text-foreground truncate">
                                            {slide.title}
                                        </h3>
                                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black border ${slide.is_active ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                            {slide.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {slide.is_active ? 'نشط' : 'غير نشط'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-foreground-muted font-bold">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>من: {formatDate(slide.start_date)} - إلى: {formatDate(slide.end_date)}</span>
                                        </div>
                                        {slide.link && (
                                            <a href={slide.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                <span>الرابط</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                <Button
                                    onClick={() => handleEdit(slide)}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl h-10 w-10 flex items-center justify-center border-border hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={() => handleDelete(slide.id)}
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

                {filteredSlides.length === 0 && (
                    <div className="text-center py-24 bg-bg-secondary/50 border-2 border-dashed border-border rounded-[3rem]">
                        <ImageIcon className="w-16 h-16 text-foreground-muted/20 mx-auto mb-4" />
                        <p className="text-foreground-muted font-black text-lg">لا توجد سلايدرز متاحة حالياً</p>
                    </div>
                )}
            </div>

            <SliderDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    // We rely on revalidatePath, but if needed we can reload
                    // window.location.reload(); 
                }}
                slide={selectedSlide}
            />
        </div>
    );
}
