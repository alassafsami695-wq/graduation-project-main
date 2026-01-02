"use client";

import { Career } from "@/types/career.types";
import { motion } from "framer-motion";
import { Briefcase, CircleDollarSign, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CareerCardProps {
    career: Career;
    index: number;
}

export const CareerCard = ({ career, index }: CareerCardProps) => {
    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="card-modern glass flex flex-col h-full group"
        >
            <Link href={`/careers/${career.id}`}>
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <Briefcase size={24} />
                    </div>
                    {career.salary && (
                        <div className="flex items-center gap-1.5 text-secondary font-semibold bg-secondary/10 px-3 py-1 rounded-full text-sm">
                            <CircleDollarSign size={16} />
                            <span>{career.salary} $</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1 mb-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                        {career.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground-muted">
                        <span>{career.company_name}</span>
                        <span className="w-1 h-1 bg-border rounded-full" />
                        <span>{career.job_type}</span>
                    </div>
                </div>

                <p className="text-foreground-muted line-clamp-3 mb-6 flex-1">
                    {career.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div className="flex items-center gap-2 text-sm text-foreground-muted">
                        <Clock size={16} />
                        <span>{career.created_at ? new Date(career.created_at).toLocaleDateString('ar-EG') : 'حديثاً'}</span>
                    </div>

                    <motion.button
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 text-primary font-medium group/btn"
                    >
                        تقديم الآن
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>
                </div>
            </Link>
        </motion.div>
    );
};
