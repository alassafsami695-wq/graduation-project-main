"use client";

import React, { useState } from "react";
import { Star, Users, Clock, ArrowRight, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Course } from "@/types/course.types";
import { Button } from "./Button";
import { Card, CardContent, CardFooter } from "./Card";
import Link from "next/link";
import { toggleWishlistItem } from "@/actions/wishlist/toggle-wishlist-item";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { ShoppingBag } from "lucide-react";

interface CourseCardProps {
    course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const [isWishlisted, setIsWishlisted] = useState(course.is_wishlisted || false);
    const [isLoading, setIsLoading] = useState(false);

    const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop";
    const courseImage = course.photo || defaultImage;

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
                        src={courseImage}
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
                        {typeof course.price === 'number' ? `${course.price} ريال` : course.price}
                    </div>
                </div>

                <CardContent className="p-6">
                    <div className="flex items-center gap-1 text-yellow-500 mb-3">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold">{course.rating}</span>
                        <span className="text-xs text-foreground-muted">({course.number_of_students} مبيعات)</span>
                    </div>

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

                <CardFooter className="p-6 pt-0 flex gap-3">
                    <Button asChild className="w-full btn-primary h-12 rounded-xl group/btn flex-1">
                        <Link href={`/courses/${course.id}`}>
                            <span>اشترك الآن</span>
                            <ArrowRight className="w-4 h-4 mr-2 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                    </Button>
                    <CartActionButton course={course} />
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
            className="h-12 w-12 rounded-xl border-primary text-primary hover:bg-primary hover:text-white transition-colors"
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
