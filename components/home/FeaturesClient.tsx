"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpLeft } from "lucide-react";
import { getFullUrl } from "@/lib/utils";

interface Feature {
    id: number;
    title: string;
    description: string;
    image: string | null;
}

interface FeaturesClientProps {
    features: Feature[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

const FeaturesClient = ({ features }: FeaturesClientProps) => {
    return (
        <section className="relative py-20 overflow-hidden bg-background">
            {/* Decorative Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

            <div className="container px-4 mx-auto">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-bold border border-primary/10 shadow-sm backdrop-blur-sm"
                    >
                        <Sparkles size={14} className="animate-pulse" />
                        <span>المميزات الذكية</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-foreground tracking-tight"
                    >
                        لماذا تختار <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">الأكاديمية الإلكترونية؟</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground max-w-2xl text-lg md:text-xl leading-relaxed"
                    >
                        نحن نعيد تعريف تجربة التعلم من خلال دمج التكنولوجيا المتطورة مع المحتوى التعليمي عالي الجودة لتجربة لا تنسى.
                    </motion.p>
                </div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature) => {
                        const fallbackImage =
                            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop";

                        return (
                            <motion.div
                                key={feature.id}
                                variants={itemVariants}
                                className="group relative flex flex-col h-[400px] rounded-3xl overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-colors duration-500"
                            >
                                {/* Image Section (Top Half) */}
                                <div className="relative h-[200px] overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{
                                            backgroundImage: `url(${getFullUrl(feature.image) || fallbackImage})`,
                                        }}
                                    />
                                </div>

                                {/* Content Section (Bottom Half) */}
                                <div className="relative z-20 flex flex-col flex-grow p-6 -mt-8">
                                    {/* Icon/Decoration Wrapper */}
                                    <div className="w-12 h-12 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300">
                                        {/* You could map Lucide icons here based on ID, using a placeholder for now */}
                                        <Sparkles className="w-5 h-5 text-primary" />
                                    </div>

                                    <h3 className="text-xl font-bold text-foreground mb-3 leading-tight">
                                        {feature.title}
                                    </h3>

                                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                                        {feature.description}
                                    </p>

                                    {/* Hover "Learn More" Hint */}
                                    <div className="mt-auto flex items-center text-primary text-sm font-medium opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        <span>اكتشف المزيد</span>
                                        <ArrowUpLeft className="w-4 h-4 mr-1" />
                                    </div>
                                </div>

                                {/* Hover Gradient Glow Effect */}
                                <div
                                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{
                                        background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(var(--primary-rgb), 0.06), transparent 40%)"
                                    }}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesClient;