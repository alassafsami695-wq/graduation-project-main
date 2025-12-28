"use client";

import React from "react";
import { useCartStore } from "@/store/cart";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
    const { items, removeItem, total } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center space-y-4 px-4">
                <div className="p-6 rounded-full bg-slate-100 dark:bg-slate-800">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold">سلة المشتريات فارغة</h1>
                <p className="text-muted-foreground text-center">يبدو أنك لم تضف أي دورات إلى سلتك بعد.</p>
                <Button asChild size="lg" className="mt-4">
                    <Link href="/courses">تصفح الدورات</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                    <ShoppingBag className="w-8 h-8 text-primary" />
                    سلة المشتريات ({items.length})
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-bg-secondary/50 border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative w-1/3 sm:w-40 h-32 sm:h-28 flex-shrink-0 bg-muted rounded-xl overflow-hidden">
                                    {item.photo ? (
                                        <Image
                                            src={item.photo}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold line-clamp-2">
                                            <Link href={`/courses/${item.id}`} className="hover:text-primary transition-colors">
                                                {item.title}
                                            </Link>
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {item.teacher?.name}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xl font-bold text-primary">
                                            {typeof item.price === 'number' ? `$${item.price}` : item.price}
                                        </span>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-bg-secondary/50 border border-border rounded-2xl p-6 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>المجموع الفرعي</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>الخصم</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="border-t border-border pt-3 mt-3 flex justify-between font-bold text-lg">
                                    <span>الإجمالي</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button className="w-full text-base py-6 rounded-xl mb-3 shadow-lg shadow-primary/20">
                                إتمام الشراء
                            </Button>

                            <p className="text-xs text-center text-muted-foreground mt-4">
                                بإتمام عملية الشراء، أنت توافق على شروط الخدمة وسياسة الخصوصية.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
