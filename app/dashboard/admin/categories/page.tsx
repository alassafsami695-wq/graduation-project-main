import React from "react";
import CategoryManager from "@/components/lists/admin/categories/CategoryManager";
import { getCategories } from "@/actions/public/categories/get-categories";

export default async function AdminCategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="p-8 space-y-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-black text-foreground">إدارة التصنيفات</h2>
                    <p className="text-foreground-muted mt-2">قم بإدارة تصنيفات الدورات والمسارات التعليمية المتاحة.</p>
                </div>

                <CategoryManager initialCategories={categories} />
            </div>
        </div>
    );
}
