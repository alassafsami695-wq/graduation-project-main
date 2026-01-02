"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { getCategories } from "@/actions/public/categories/get-categories";
import { Category } from "@/types/category.types";

export default function CategoriesDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await getCategories();
                if (result) {
                    setCategories(result as any);
                }
            } catch (error) {
                console.error("Failed to fetch categories, using mock data", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 h-12 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 font-medium text-sm"
            >
                <span>التصنيفات</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 w-56 bg-bg-primary border border-border rounded-2xl shadow-xl z-[60] py-2 overflow-hidden"
                    >
                        {categories.map((category) => (
                            <Link
                                key={category?.id}
                                href={`/categories/${category?.id}`}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2 text-sm text-foreground-muted hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                {category?.title}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
