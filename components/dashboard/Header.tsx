"use client";

import React from "react";
import { Bell, Search, Menu } from "lucide-react";
import UserDropdown from "@/components/ui/UserDropdown";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface HeaderProps {
    title: string;
}

export default function DashboardHeader({ title }: HeaderProps) {
    return (
        <header className="h-20 bg-bg-primary/80 backdrop-blur-md border-b border-border sticky top-0 z-40 px-8 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-black text-foreground">{title}</h1>
            </div>

            <div className="flex items-center gap-6">
                {/* Quick Search */}
                <div className="hidden md:flex relative group">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="البحث السريع..."
                        className="w-64 bg-bg-secondary border border-border rounded-xl pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button className="relative p-2.5 bg-bg-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all group">
                        <Bell className="w-5 h-5 text-foreground-muted group-hover:text-primary" />
                        <span className="absolute top-2.5 left-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-primary" />
                    </button>
                    <ThemeToggle />
                    <div className="h-6 w-px bg-border mx-2" />
                    <UserDropdown />
                </div>
            </div>
        </header>
    );
}
