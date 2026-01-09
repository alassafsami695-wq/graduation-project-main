"use client";

import React, { useState } from "react";
import { Star, Users, Clock, ArrowRight, Heart, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Course } from "@/types/course.types";
import { Card, CardContent, CardFooter } from "./Card";
import Link from "next/link";
import { toggleWishlistItem } from "@/actions/student/wishlist/toggle-wishlist-item";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { ShoppingBag } from "lucide-react";
import { Button } from "../ui/Button";



interface CourseCardProps {
    course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const [isWishlisted, setIsWishlisted] = useState(course.is_wishlisted || false);
    const [isLoading, setIsLoading] = useState(false);
    const { items } = useCartStore();
    const isInCart = items.some(item => item.id === course.id);

    const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop";
    const courseImage = (() => {
        if (!course.photo) return defaultImage;
        let p = course.photo;
        if (p.includes('http') && p.lastIndexOf('http') > 0) {
            p = p.substring(p.lastIndexOf('http'));
        }
        if (p.startsWith('http')) {
            if (p.includes('/courses/') && !p.includes('/storage/')) {
                return p.replace('/courses/', '/storage/courses/');
            }
            return p;
        }
        return `http://127.0.0.1:8000/storage/${p.startsWith('/') ? p.slice(1) : p}`;
    })();

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        try {
            setIsLoading(true);
            const res = await toggleWishlistItem(course.id);
            console.log(res);
            setIsWishlisted(!isWishlisted);
            toast.success(!isWishlisted ? "تمت الإضافة للمفضلة" : "تمت الإزالة من المفضلة");
        } catch (error) {
            toast.error("حدث خطأ أثناء تحديث المفضلة");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="overflow-hidden border-border bg-bg-secondary/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 rounded-3xl group relative">
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={course.photo || defaultImage}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />


                    {/* Wishlist Toggle Button */}
                    <button
                        onClick={handleToggleWishlist}
                        disabled={isLoading}
                        className={`absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 z-10 hover:scale-110 active:scale-95 ${isWishlisted
                            ? "bg-rose-500 text-white"
                            : "bg-white/80 dark:bg-black/20 text-foreground-muted hover:text-rose-500"
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                        <AnimatePresence>
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"
                                />
                            )}
                        </AnimatePresence>
                    </button>

                    <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {typeof course.price === 'number' ? `${course.price} ل.س` : course.price}
                    </div>
                </div>

                <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {course.title}
                    </h3>

                    <p className="text-sm text-foreground-muted mb-6 line-clamp-2 min-h-[40px]">
                        {course.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                        <div className="flex items-center gap-2 text-foreground-muted">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium">{course.course_duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground-muted">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium">{course.number_of_students} طالب</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-6 pt-0 flex gap-3 items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                        {course.is_enrolled && (
                            <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium border border-emerald-500/20 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                تم الشراء
                            </span>
                        )}
                        {isInCart && !course.is_enrolled && (
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20 flex items-center gap-1">
                                <ShoppingBag className="w-3 h-3" />
                                في السلة
                            </span>
                        )}
                        {isWishlisted && !course.is_enrolled && (
                            <span className="bg-rose-500/10 text-rose-600 px-3 py-1 rounded-full text-sm font-medium border border-rose-500/20 flex items-center gap-1">
                                <Heart className="w-3 h-3 fill-current" />
                                في المفضلة
                            </span>
                        )}
                    </div>

                    {!course.is_enrolled && !isInCart && (
                        <div className="ml-auto">
                            <CartActionButton course={course} />
                        </div>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
};

const CartActionButton = ({ course }: { course: Course }) => {
    // Import dynamically or ensure store is client-side safe (it is)
    // We need to import useCartStore at top level, but for cleaner code here:
    const { addItem, items } = useCartStore();
    const isInCart = items.some(item => item.id === course.id);

    return (
        <Button
            variant="outline"
            className="h-10 w-10 p-0 rounded-xl border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            onClick={(e) => {
                e.preventDefault();
                if (!isInCart) {
                    addItem(course);
                    toast.success("تمت الإضافة للسلة");
                } else {
                    toast.info("موجود بالفعل في السلة");
                }
            }}
            aria-label="Add to cart"
        >
            <ShoppingBag className="w-5 h-5" />
        </Button>
    )
}
