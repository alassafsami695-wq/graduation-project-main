"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Settings,
    LogOut,
    ChevronDown,
    LayoutDashboard,
    Wallet,
    BookOpen,
    Heart,
    Tv
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { logoutAction } from "@/actions/public/auth";
import { useRouter } from "next/navigation";
import { getFullUrl } from "@/lib/utils";

export default function UserDropdown() {

    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`;
    const userPhoto = user?.photo || defaultAvatar;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logoutAction();
        logout();
        router.push("/auth/login");
    };

    if (!user?.id) {
        return (
            <Link
                href="/auth/login"
                className="btn-primary py-2 px-6 rounded-xl text-sm font-medium"
            >
                تسجيل الدخول
            </Link>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                    <img
                        src={getFullUrl(userPhoto)}
                        alt={user.name || "User"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultAvatar;
                        }}
                    />
                </div>
                <ChevronDown className={`w-4 h-4 text-foreground-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-0 mt-2 w-64 bg-bg-primary rounded-lg shadow-xl z-50 overflow-hidden"
                    >
                        <div className="p-4 bg-bg-secondary/30">
                            <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                            <p className="text-xs text-foreground-muted truncate">{user.email}</p>
                            {user.wallet && (
                                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg w-fit">
                                    <Wallet className="w-3 h-3" />
                                    <span>{user.wallet.balance} ريال</span>
                                </div>
                            )}
                        </div>

                        <div className="p-2">
                            {user.type !== "user" && (
                                <DropdownItem
                                    href={
                                        user.type === "super_admin"
                                            ? "/dashboard/admin"
                                            : "/dashboard/teacher"
                                    }
                                    icon={<LayoutDashboard className="w-4 h-4" />}
                                    label="لوحة التحكم"
                                    onClick={() => setIsOpen(false)}
                                />
                            )}
                            <DropdownItem
                                href="/profile"
                                icon={<User className="w-4 h-4" />}
                                label="الملف الشخصي"
                                onClick={() => setIsOpen(false)}
                            />
                            <DropdownItem
                                href="/wishlist"
                                icon={<Heart className="w-4 h-4" />}
                                label="قائمة المفضلة"
                                onClick={() => setIsOpen(false)}
                            />
                            {user.type === "user" && (
                                <DropdownItem
                                    href="/my-courses"
                                    icon={<BookOpen className="w-4 h-4" />}
                                    label="دوراتي"
                                    onClick={() => setIsOpen(false)}
                                />
                            )}
                        </div>

                        <div className="p-2 bg-bg-secondary/10">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50/50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="font-medium">تسجيل الخروج</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DropdownItem({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground-muted hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
        >
            <span className="text-primary">{icon}</span>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
