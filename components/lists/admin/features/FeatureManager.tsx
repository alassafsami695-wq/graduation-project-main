"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, Search, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import FeatureDialog from "./FeatureDialog";
import { deleteFeatures } from "@/actions/admin/features/delete-feature";

interface Feature {
    id: number;
    title: string;
    description: string;
    image: string | null;
}

interface FeatureManagerProps {
    initialFeatures: Feature[];
}

export default function FeatureManager({ initialFeatures }: FeatureManagerProps) {
    const [features, setFeatures] = useState(initialFeatures);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

    const filteredFeatures = features.filter(f =>
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (feature: Feature) => {
        setSelectedFeature(feature);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذه الميزة؟")) return;

        try {
            await deleteFeatures(id);
            setFeatures(features.filter(f => f.id !== id));
        } catch (error) {
            console.error("Error deleting feature:", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <Button
                    onClick={() => {
                        setSelectedFeature(null);
                        setIsDialogOpen(true);
                    }}
                    className="btn-primary h-12 px-6 rounded-2xl flex items-center gap-2 text-white font-bold"
                >
                    <Plus className="w-5 h-5" />
                    <span>إضافة ميزة</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredFeatures.map((feature, index) => (
                    <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-bg-secondary border border-border rounded-3xl p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                        <div className="relative space-y-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Zap className="w-6 h-6 text-primary" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-foreground">{feature.title}</h3>
                                <p className="text-sm text-foreground-muted leading-relaxed line-clamp-3">
                                    {feature.description}
                                </p>
                            </div>

                            <div className="pt-4 flex items-center gap-2">
                                <Button
                                    onClick={() => handleEdit(feature)}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 rounded-xl h-10 font-bold border-border hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                                >
                                    <Pencil className="w-4 h-4 ml-2" />
                                    تعديل
                                </Button>
                                <Button
                                    onClick={() => handleDelete(feature.id)}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl h-10 w-10 flex items-center justify-center text-red-500 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredFeatures.length === 0 && (
                <div className="text-center py-20 bg-bg-secondary/50 border-2 border-dashed border-border rounded-[3rem]">
                    <p className="text-foreground-muted font-bold">لم يتم العثور على مميزات تغطي هذا البحث.</p>
                </div>
            )}

            <FeatureDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    // We might need to refresh data after save, 
                    // though revalidatePath handles it, local state might need sync or full router reload
                    window.location.reload();
                }}
                feature={selectedFeature}
            />
        </div>
    );
}
