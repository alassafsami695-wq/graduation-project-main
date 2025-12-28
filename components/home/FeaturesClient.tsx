"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, BookOpen, Users, Trophy, Sparkles, Orbit, Cpu, Rocket } from "lucide-react";

interface Feature {
    id: number;
    title: string;
    description: string;
    image: string | null;
}

interface FeaturesClientProps {
    features: Feature[];
}
const FeaturesClient = ({ features }: FeaturesClientProps) => {
    return (
        <section className="py-12">
            <div className="flex flex-col items-center text-center mb-16 space-y-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20"
                >
                    <Sparkles size={14} className="animate-pulse" />
                    المميزات الذكية
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                    لماذا تختار <span className="text-gradient">الأكاديمية الإلكترونية؟</span>
                </h2>
                <p className="text-foreground-muted max-w-2xl text-lg leading-relaxed">
                    نحن نعيد تعريف تجربة التعلم من خلال دمج التكنولوجيا المتطورة مع المحتوى التعليمي عالي الجودة.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => {
                    const fallbackImage = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop";

                    return (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                            className="group relative h-[340px] rounded-[2.5rem] overflow-hidden border border-border bg-bg-secondary hover:shadow-2xl transition-all duration-500"
                        >
                            {/* Background Image with Hover Effect */}
                            <div
                                className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-10 group-hover:opacity-30"
                                style={{ backgroundImage: `url(${feature.image?.replace("http://localhost:8000/storage/", "")}` }}
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent opacity-80" />

                            {/* Content */}
                            <div className="relative h-full p-8 flex flex-col justify-end items-start space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-foreground-muted text-sm leading-relaxed group-hover:text-foreground transition-colors group-hover:line-clamp-none line-clamp-2">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>

                            {/* Bottom Accent Line */}
                            <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-primary group-hover:w-full transition-all duration-500" />
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default FeaturesClient;
