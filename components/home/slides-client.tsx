"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type Slide = {
    id: number | string;
    title: string;
    description?: string;
    image_path?: string | null;
    image_url?: string | null;
    link?: string | null;
    is_active?: boolean;
    start_date?: string | null;
    end_date?: string | null;
    [k: string]: any;
};

export default function SlidesClient({ slides = [] }: { slides: Slide[] }) {
    const [current, setCurrent] = useState(0);
    const prefersReduced = useReducedMotion();

    if (!slides.length) {
        return (
            <section className="h-[400px] flex items-center justify-center rounded-2xl bg-muted">
                No slides
            </section>
        );
    }

    const total = slides.length;
    const active = slides[current];

    const getImageUrl = (s: Slide) => {
        let url = s.image_url || s.image_path || (s as any).image || "";
        if (url && !url.startsWith("http")) {
            url = url.replace(/^public\//, "").replace(/^\/storage\//, "");
            url = `http://localhost:8000/storage/${url}`;
        }
        return url;
    };

    useEffect(() => {
        if (total <= 1) return;
        const t = setInterval(() => {
            setCurrent((p) => (p + 1) % total);
        }, 6000);
        return () => clearInterval(t);
    }, [total]);

    const next = () => setCurrent((p) => (p + 1) % total);
    const prev = () => setCurrent((p) => (p - 1 + total) % total);

    return (
        <section className="relative w-full h-[520px] md:h-[600px] overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
                <motion.div
                    key={active.id}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: prefersReduced ? 0 : 0.6 }}
                    className="absolute inset-0"
                >
                    {/* Full background image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${getImageUrl(active)})` }}
                    />

                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

                    {/* Content */}
                    <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex items-end pb-16">
                        <div className="max-w-2xl text-white">
                            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                                {active.title}
                            </h2>
                            <p className="text-base md:text-lg text-white/85 mb-6 line-clamp-3">
                                {active.description}
                            </p>

                            {active.link && (
                                <Button asChild size="lg" className="rounded-xl px-6">
                                    <Link href={active.link} target="_blank" rel="noopener noreferrer">
                                        Explore
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Left arrow */}
            <button
                onClick={prev}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right arrow */}
            <button
                onClick={next}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`h-2.5 w-2.5 rounded-full transition-all ${current === i ? "bg-white w-6" : "bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
