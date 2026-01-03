"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    start_date?: string | null;
    end_date?: string | null;
    is_active?: boolean;
    created_at?: string | null;
    updated_at?: string | null;
    [k: string]: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SlidesClient({ slides }: { slides: any }) {

    const [current, setCurrent] = useState(0);

    console.log(slides);

    // Auto-slide (only if more than one slide)
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const next = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    if (!slides || slides.length === 0) {
        return (
            <section className="relative h-[360px] w-full flex items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <p className="text-center">No slides to display.</p>
            </section>
        );
    }

    const active = slides[current];
    let imageUrl = active.image_url || active.image_path || active.image || "";

    // Fix image URL if it doesn't start with http
    if (imageUrl && !imageUrl.startsWith("http")) {
        // Remove 'public/' or '/storage/' prefix if present to avoid duplication if backend sends it weirdly, 
        // but mostly just handle the simple relative case
        imageUrl = imageUrl.replace(/^public\//, "").replace(/^\/storage\//, "");
        imageUrl = `http://localhost:8000/storage/${imageUrl}`;
    }

    const formatDate = (d?: string | null) => {
        if (!d) return "—";
        try {
            return new Date(d).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return d;
        }
    };

    return (
        <section className="relative w-full overflow-hidden mb-16 rounded-3xl shadow-lg bg-card">
            <AnimatePresence mode="wait">
                <motion.div
                    key={active.id}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6 }}
                    className="relative h-[600px] md:h-[520px] lg:h-[520px]"
                >
                    {/* Background image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 group-hover:scale-110"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                        role="img"
                        aria-label={active.title || "slide image"}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                    {/* Main content area */}
                    <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-center gap-8">
                        {/* Left: Text content */}
                        <div className="w-full md:w-2/3 lg:w-3/5 text-left text-white z-10">
                            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3">{active.title}</h2>
                            <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-6">{active.description}</p>

                            <div className="flex flex-wrap items-center gap-4">
                                <Button asChild size="lg" className="rounded-xl px-6 py-3">
                                    <Link href={active.link || '#'} target={active.link ? "_blank" : undefined} rel={active.link ? "noopener noreferrer" : undefined}>
                                        <span>Visit</span>
                                        <ArrowRight className="w-4 h-4 mr-0 ml-2" />
                                    </Link>
                                </Button>

                                {/* Active badge + dates */}
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${active.is_active ? 'bg-green-600/90' : 'bg-gray-600/60'}`}>
                                        {active.is_active ? 'Active' : 'Inactive'}
                                    </span>

                                    <div className="text-sm text-white/80">
                                        <div>Start: <span className="font-medium">{formatDate(active.start_date)}</span></div>
                                        <div>End: <span className="font-medium">{formatDate(active.end_date)}</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* small meta */}
                            <div className="mt-6 text-sm text-white/70">
                                <div>Created: <span className="font-medium">{formatDate(active.created_at)}</span></div>
                                <div>Updated: <span className="font-medium">{formatDate(active.updated_at)}</span></div>
                                <div>ID: <span className="font-medium">{active.id}</span></div>
                            </div>
                        </div>

                        {/* Right: compact card with link + image + description summary */}
                        <aside className="hidden md:flex md:flex-col md:items-end md:w-1/3 lg:w-2/5 z-10">
                            <div className="w-64 bg-white/6 p-4 rounded-2xl backdrop-blur border border-white/10">
                                <img src={imageUrl} alt={active.title} className="w-full h-36 object-cover rounded-lg mb-3" />
                                <h3 className="text-lg font-semibold text-white">{active.title}</h3>
                                <p className="text-sm text-white/80 line-clamp-3">{active.description}</p>
                                <a href={active.link || '#'} target={active.link ? '_blank' : undefined} rel={active.link ? 'noopener noreferrer' : undefined} className="block mt-3 text-sm text-primary underline">Open link</a>
                            </div>
                        </aside>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute inset-x-0 bottom-6 flex items-center justify-between px-6 z-20">
                <div className="flex items-center gap-3">
                    <button onClick={prev} aria-label="Previous" className="w-10 h-10 rounded-full glass flex items-center justify-center border border-white/20">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={next} aria-label="Next" className="w-10 h-10 rounded-full glass flex items-center justify-center border border-white/20">
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* indicators with thumbnails */}
                    <div className="hidden sm:flex items-center gap-2 ml-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {slides.map((s: any, i: number) => {
                            const thumb = s.image_url || s.image_path || s.image || '';
                            return (
                                <button key={s.id || i} onClick={() => setCurrent(i)} className={`flex items-center gap-2 p-1 rounded-md border ${current === i ? 'border-primary' : 'border-white/10'} transition-all`}>
                                    <img src={thumb} alt={s.title} className="w-16 h-10 object-cover rounded-md" />
                                    <span className={`hidden md:inline-block text-sm ${current === i ? 'text-primary font-semibold' : 'text-white/80'}`}>{s.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* small pager */}
                <div className="text-sm text-white/80">
                    <span className="font-medium">{current + 1}</span> / <span>{slides.length}</span>
                </div>
            </div>
        </section>
    );
}
