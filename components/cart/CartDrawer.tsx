"use client";

import React from "react";
import { useCartStore } from "@/store/cart";
import { X, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const CartDrawer: React.FC = () => {
    const { items, isOpen, closeCart, removeItem, total } = useCartStore();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        سلة المشتريات
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                            <ShoppingBag className="w-16 h-16 opacity-20" />
                            <p>سلة المشتريات فارغة</p>
                            <Button onClick={closeCart} variant="outline" className="mt-4">
                                تصفح الدورات
                            </Button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800/50">
                                <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-slate-200">
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
                                        <h3 className="text-sm font-medium line-clamp-2" title={item.title}>
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {item.teacher?.name}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-sm font-semibold text-primary">
                                            {typeof item.price === 'number' ? `$${item.price}` : item.price}
                                        </span>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 hover:text-red-600 transition-colors p-1"
                                            aria-label="إزالة من السلة"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-4 border-t border-border bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium">المجموع</span>
                            <span className="text-lg font-bold">${total.toFixed(2)}</span>
                        </div>
                        <div className="space-y-2">
                            <Link href="/checkout" onClick={closeCart}>
                                <Button className="w-full" size="lg">
                                    إتمام الشراء
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={closeCart}
                            >
                                متابعة التسوق
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
