"use client";

import React, { useState } from "react";
import { Star, Users, Clock, ArrowRight, Heart, CheckCircle, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Course } from "@/types/course.types";
import { Card, CardContent, CardFooter } from "./Card";
import Link from "next/link";
import { toggleWishlistItem } from "@/actions/student/wishlist/toggle-wishlist-item";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { Button } from "../ui/Button";

// تعريف الواجهة لضمان عدم وجود أخطاء برمجية (الخطوط الحمراء)
interface ExtendedCourse extends Course {
    is_enrolled?: boolean;
    is_wishlisted?: boolean;
    progress_percentage?: number;
}

interface CourseCardProps {
    course: ExtendedCourse;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const [isWishlisted, setIsWishlisted] = useState(course.is_wishlisted || false);
    const [isLoading, setIsLoading] = useState(false);
    const { items } = useCartStore();
    const isInCart = items.some(item => item.id === course.id);

    const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop";
    
    // منطق معالجة الصورة لضمان ظهورها من السيرفر المحلي
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

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="w-full"
        >
            <Card className="overflow-hidden border-border bg-bg-secondary/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 rounded-3xl group relative">
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={courseImage}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* زر المفضلة - يظهر فقط إذا لم يتم الشراء */}
                    {!course.is_enrolled && (
                        <button
                            onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (isLoading) return;
                                try {
                                    setIsLoading(true);
                                    await toggleWishlistItem(course.id);
                                    setIsWishlisted(!isWishlisted);
                                    toast.success(!isWishlisted ? "تمت الإضافة للمفضلة" : "تمت الإزالة من المفضلة");
                                } catch {
                                    toast.error("حدث خطأ");
                                } finally { setIsLoading(false); }
                            }}
                            className={`absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all ${isWishlisted ? "bg-rose-500 text-white" : "bg-white/80 text-gray-600"}`}
                        >
                            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                        </button>
                    )}

                    <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {typeof course.price === 'number' ? `${course.price} ل.س` : course.price}
                    </div>
                </div>

                <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors text-white">
                        {course.title}
                    </h3>

                    <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
                        {course.description}
                    </p>

                    {/* --- شريط تتبع التقدم الاحترافي --- */}
                    {course.is_enrolled && (
                        <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-primary flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5" /> مستوى الإنجاز
                                </span>
                                <span className="text-xs font-black text-primary">
                                    {Math.round(course.progress_percentage || 0)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${course.progress_percentage || 0}%` }}
                                    transition={{ duration: 1.5, ease: "anticipate" }}
                                    className="bg-gradient-to-r from-primary to-blue-400 h-full rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium">{course.course_duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium">{course.number_of_students} طالب</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-6 pt-0 flex gap-3 items-center justify-between">
                    <div className="flex gap-2">
                        {course.is_enrolled && (
                            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> تم الشراء
                            </span>
                        )}
                    </div>

                    {/* زر تفاعلي بناءً على الحالة */}
                    {course.is_enrolled ? (
                        <Link href={`/courses/${course.id}`} className="ml-auto">
                            <Button className="bg-primary hover:bg-primary/80 text-white rounded-xl px-5 h-10 text-xs font-bold flex gap-2">
                                ابدأ التعلم <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    ) : (
                        !isInCart && (
                            <div className="ml-auto">
                                <Button
                                    variant="outline"
                                    className="h-10 w-10 p-0 rounded-xl border-primary text-primary hover:bg-primary"
                                    onClick={() => { useCartStore.getState().addItem(course); toast.success("تمت الإضافة"); }}
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                </Button>
                            </div>
                        )
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
};