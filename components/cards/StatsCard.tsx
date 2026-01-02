"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    color?: "primary" | "secondary" | "indigo" | "rose";
}

export default function StatsCard({ label, value, icon: Icon, trend, color = "primary" }: StatsCardProps) {
    const colors = {
        primary: "text-primary bg-primary/10 border-primary/20",
        secondary: "text-secondary bg-secondary/10 border-secondary/20",
        indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
        rose: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg-secondary border border-border p-6 rounded-3xl group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl border ${colors[color]} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className="text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded-lg">
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm text-foreground-muted font-medium mb-1">{label}</p>
                <h3 className="text-3xl font-black text-foreground tabular-nums">{value}</h3>
            </div>
        </motion.div>
    );
}
