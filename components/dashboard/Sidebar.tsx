"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    Star,
    Calendar,
    Layers,
    GraduationCap,
    ShieldAlert,
    Menu,
    X,
    Zap,
    Image,
    UserRound,
    Info,
    Briefcase,
    MessageSquare,
    Wallet
} from "lucide-react";
import { useAuthStore } from "@/store/auth";

const navItems = {
    super_admin: [
        { label: "نظرة عامة", href: "/dashboard/admin", icon: LayoutDashboard },
        { label: "الدورات", href: "/dashboard/admin/courses", icon: BookOpen },
        { label: "المميزات", href: "/dashboard/admin/features", icon: Zap },
        { label: "السلايدر", href: "/dashboard/admin/slides", icon: Image },
        { label: "المسؤولين", href: "/dashboard/admin/admins", icon: ShieldAlert },
        { label: "المدرسين", href: "/dashboard/admin/teachers", icon: UserRound },
        { label: "معلومات التواصل", href: "/dashboard/admin/contact-settings", icon: Info },
        { label: "الطلاب", href: "/dashboard/admin/students", icon: Users },
        { label: "الوظائف", href: "/dashboard/admin/careers", icon: Briefcase },
        { label: "التصنيفات", href: "/dashboard/admin/categories", icon: Layers },
    ],
    teacher: [
        { label: "نظرة عامة", href: "/dashboard/teacher", icon: LayoutDashboard },
        { label: "الطلاب", href: "/dashboard/teacher/students", icon: Users },
        { label: "الدورات", href: "/dashboard/teacher/courses", icon: BookOpen },
        { label: "التعليقات", href: "/dashboard/teacher/comments", icon: MessageSquare },
        { label: "الميزانية", href: "/dashboard/teacher/budget", icon: Wallet },
    ],
    user: [
        { label: "الرئيسية", href: "/dashboard/student", icon: LayoutDashboard },
        { label: "مساراتي", href: "/dashboard/student/my-learning", icon: GraduationCap },
        { label: "كل الدورات", href: "/courses", icon: BookOpen },
        { label: "المفضلات", href: "/dashboard/student/favorites", icon: Star },
        { label: "الإعدادات", href: "/dashboard/student/settings", icon: Settings },
    ],
};

export default function DashboardSidebar() {
    const [mounted, setMounted] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const { user } = useAuthStore();
    const role = user?.type || "user";
    const items = navItems[role as keyof typeof navItems] || navItems.user;

    if (!mounted) return <aside className="w-72 bg-bg-secondary border-l border-border h-screen sticky top-0" />;

    return (
        <aside className="w-72 bg-bg-secondary border-l border-border h-screen sticky top-0 flex flex-col transition-all duration-300">
            <div className="p-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <GraduationCap className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-black text-gradient">EDU MASAR</span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative ${isActive
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-foreground-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-primary group-hover:scale-110 transition-transform"}`} />
                            <span className="font-bold text-sm">{item.label}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-2 w-1.5 h-6 bg-white/40 rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6">
                <div className="bg-bg-primary/50 border border-border rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                            <ShieldAlert className="w-4 h-4 text-secondary" />
                        </div>
                        <span className="text-xs font-bold">تحتاج مساعدة؟</span>
                    </div>
                    <p className="text-[10px] text-foreground-muted leading-relaxed">
                        تواصل مع الدعم الفني للحصول على المساعدة في إدارة حسابك.
                    </p>
                    <button className="w-full py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold rounded-lg transition-colors">
                        مركز المساعدة
                    </button>
                </div>
            </div>
        </aside>
    );
}
