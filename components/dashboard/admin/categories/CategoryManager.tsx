"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, Layers, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import CategoryDialog from "./CategoryDialog";
import { deleteCategory } from "@/actions/admin/categories/delete-category";

interface Category {
    id: number;
    title: string;
}

interface CategoryManagerProps {
    initialCategories: Category[];
}

export default function CategoryManager({ initialCategories }: { initialCategories: any[] }) {
    const [categories, setCategories] = useState(initialCategories);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCategories = categories.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا التصنيف؟ سيتأثر المسار التعليمي المرتبط به.")) return;

        try {
            await deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="البحث في التصنيفات..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-bg-secondary border border-border rounded-2xl pr-12 pl-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                    />
                </div>

                <Button
                    onClick={() => {
                        setSelectedCategory(null);
                        setIsDialogOpen(true);
                    }}
                    className="btn-primary h-12 px-6 rounded-2xl flex items-center gap-2 text-white font-bold"
                >
                    <Plus className="w-5 h-5" />
                    <span>إضافة تصنيف</span>
                </Button>
            </div>

            <div className="space-y-4">
                {filteredCategories.map((category, index) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-bg-secondary border border-border rounded-2xl p-4 hover:border-primary/30 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <Layers className="w-6 h-6 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg font-black text-foreground truncate">
                                        {category.title}
                                    </h3>
                                    <p className="text-xs font-bold text-foreground-muted">
                                        تصنيف تعليمي
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => handleEdit(category)}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl h-10 w-10 flex items-center justify-center border-border hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={() => handleDelete(category.id)}
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

                {filteredCategories.length === 0 && (
                    <div className="text-center py-24 bg-bg-secondary/50 border-2 border-dashed border-border rounded-[3rem]">
                        <Layers className="w-16 h-16 text-foreground-muted/20 mx-auto mb-4" />
                        <p className="text-foreground-muted font-black text-lg">لا توجد تصنيفات متاحة حالياً</p>
                    </div>
                )}
            </div>

            <CategoryDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    window.location.reload();
                }}
                category={selectedCategory}
            />
        </div>
    );
}
