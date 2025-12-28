"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileQuestion, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Animated Blobs */}
            <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />

            <div className="z-10 text-center space-y-8 max-w-2xl">
                {/* Animated Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 100 }}
                    className="mx-auto w-24 h-24 bg-bg-secondary border border-border rounded-3xl flex items-center justify-center shadow-lg glow"
                >
                    <FileQuestion className="w-12 h-12 text-primary" />
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <h1 className="text-8xl font-black text-gradient tracking-tighter">
                        404
                    </h1>
                    <h2 className="text-3xl font-bold text-foreground">
                        عذراً، الصفحة غير موجودة
                    </h2>
                    <p className="text-foreground-muted text-lg max-w-md mx-auto leading-relaxed">
                        يبدو أنك وصلت إلى طريق مسدود. الصفحة التي تحاول الوصول إليها قد تم نقلها أو أنها لم تعد موجودة.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button asChild size="lg" className="btn-primary min-w-[200px]">
                        <Link href="/" className="flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            <span>العودة للرئيسية</span>
                        </Link>
                    </Button>

                    <Button asChild variant="outline" size="lg" className="rounded-xl border-2 hover:bg-primary/5 transition-all duration-300 min-w-[200px]">
                        <Link href="/courses" className="flex items-center gap-2">
                            <span>تصفح الدورات</span>
                            <ArrowRight className="w-5 h-5 rotate-180" />
                        </Link>
                    </Button>
                </motion.div>

                {/* Support Link */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm text-foreground-muted pt-8"
                >
                    هل تعتقد أن هناك خطأ ما؟ <Link href="/contact" className="text-primary hover:underline font-medium">اتصل بنا</Link>
                </motion.p>
            </div>
        </div>
    );
}
