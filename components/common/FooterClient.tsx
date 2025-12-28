"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ContactSettings {
    id: number;
    location: string | null;
    phone_primary: string | null;
    phone_secondary: string | null;
    email: string | null;
    whatsapp: string | null;
    map_link: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

interface FooterClientProps {
    contacts: { data: ContactSettings };
}

// Helper utilities to normalize phone numbers to E.164 and create wa.me links.
const toE164 = (raw?: string): string | null => {
    if (!raw) return null;
    const trimmed = raw.trim();
    // remove all non-digit and non-plus characters
    const onlyDigits = trimmed.replace(/[^+0-9]/g, "");

    // If it already starts with + and digits -> assume valid
    if (onlyDigits.startsWith("+")) return onlyDigits;

    // If starts with 00 (international prefix), convert to +
    if (onlyDigits.startsWith("00")) return "+" + onlyDigits.slice(2);

    // If starts with 0 -> assume local Syrian format like 09xxxxxxx -> replace leading 0 with +963
    if (onlyDigits.startsWith("0")) return "+963" + onlyDigits.slice(1);

    // If it looks like local without leading zero (9xxxxxxxx)
    if (onlyDigits.length === 9) return "+963" + onlyDigits;

    // Otherwise assume it's a national number with country code (e.g., 963...) -> add plus
    return "+" + onlyDigits;
};

const numberForWhatsapp = (e164?: string | null) => {
    if (!e164) return null;
    return e164.replace(/^\+/, ""); // wa.me expects country-code + number with no +
};

const FooterClient = ({ contacts }: FooterClientProps) => {
    const currentYear = new Date().getFullYear();
    const data = contacts;

    // normalize phones once
    const primaryE164 = toE164(data?.phone_primary ?? undefined);
    const secondaryE164 = toE164(data?.phone_secondary ?? undefined);
    const whatsappE164 = toE164(data?.whatsapp ?? undefined);

    const footerLinks = {
        main: [
            { name: "الرئيسية", href: "/" },
            { name: "الدورات", href: "/courses" },
            { name: "الوظائف", href: "/careers" },
            { name: "من نحن", href: "/about" },
        ],
        support: [
            { name: "مركز المساعدة", href: "/help" },
            { name: "اتصل بنا", href: "/contact" },
            { name: "سياسة الخصوصية", href: "/privacy" },
            { name: "شروط الاستخدام", href: "/terms" },
        ],
    };

    return (
        <footer className="w-full bg-bg-secondary border-t border-border mt-auto transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-primary group-hover:scale-110 transition-transform">
                                <span className="text-primary-foreground font-bold text-xl drop-shadow-sm">E</span>
                            </div>
                            <span className="text-2xl font-bold text-gradient">EDU Masar</span>
                        </div>
                        <p className="text-foreground-muted leading-relaxed">
                            نحن هنا لمساعدتك في رحلة تعلمك. منصة تعليمية متطورة تهدف إلى تمكين المتعلمين وتزويدهم بالمهارات اللازمة لمستقبل تقني مشرق.
                        </p>

                        <div className="flex gap-4">
                            {whatsappE164 && (
                                <Link
                                    href={`https://wa.me/${numberForWhatsapp(whatsappE164)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-foreground-muted hover:text-green-500 hover:border-green-500 transition-all duration-300 shadow-sm glass"
                                    aria-label="Whatsapp"
                                >
                                    <MessageCircle size={20} />
                                </Link>
                            )}

                            {data?.email && (
                                <Link
                                    href={`mailto:${data.email}`}
                                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-foreground-muted hover:text-primary hover:border-primary transition-all duration-300 shadow-sm glass"
                                    aria-label="Email"
                                >
                                    <Mail size={20} />
                                </Link>
                            )}

                            {data?.map_link && (
                                <Link
                                    href={data.map_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-foreground-muted hover:text-secondary hover:border-secondary transition-all duration-300 shadow-sm glass"
                                    aria-label="Google Maps"
                                >
                                    <MapPin size={20} />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-foreground relative inline-block">
                            القائمة الرئيسية
                            <span className="absolute -bottom-1 right-0 w-8 h-1 bg-primary rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            {footerLinks.main.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-foreground-muted hover:text-primary flex items-center gap-2 group transition-colors"
                                    >
                                        <ArrowLeft size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-180" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-foreground relative inline-block">
                            الدعم والمساعدة
                            <span className="absolute -bottom-1 right-0 w-8 h-1 bg-secondary rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-foreground-muted hover:text-primary flex items-center gap-2 group transition-colors"
                                    >
                                        <ArrowLeft size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-180" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-foreground">تواصل معنا</h3>
                        <ul className="space-y-4 text-foreground-muted">
                            {data?.location && (
                                <li className="flex items-start gap-3 group">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <MapPin size={18} />
                                    </div>
                                    <span className="mt-1 flex-1">{data.location}</span>
                                </li>
                            )}

                            {primaryE164 && (
                                <li className="flex items-center gap-3 group">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <Link href={`tel:${primaryE164}`} className="group-hover:text-primary transition-colors" dir="ltr">
                                        {primaryE164}
                                    </Link>
                                </li>
                            )}

                            {secondaryE164 && (
                                <li className="flex items-center gap-3 group">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <Link href={`tel:${secondaryE164}`} className="group-hover:text-primary transition-colors" dir="ltr">
                                        {secondaryE164}
                                    </Link>
                                </li>
                            )}

                            {data?.email && (
                                <li className="flex items-center gap-3 group">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <Link href={`mailto:${data.email}`} className="group-hover:text-primary transition-colors">
                                        {data.email}
                                    </Link>
                                </li>
                            )}
                        </ul>

                        <div className="p-4 rounded-2xl bg-bg-primary border border-border glow flex items-center justify-between overflow-hidden relative">
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-semibold text-primary">الأنظمة متصلة</span>
                            </div>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/5 rounded-full blur-xl" />
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-foreground-muted text-sm px-4 py-2 glass rounded-full border border-border/50">
                        &copy; {currentYear} <span className="font-black text-primary">EDU Masar</span>. جميع الحقوق محفوظة.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-foreground-muted">
                        <span className="hidden sm:inline italic">صنع بكل ❤️ لمستقبل أفضل</span>
                        <div className="flex gap-3">
                            <div className="h-9 w-9 rounded-xl bg-bg-primary border border-border flex items-center justify-center text-[11px] font-black hover:border-primary hover:text-primary transition-all cursor-default shadow-sm">V4</div>
                            <div className="h-9 w-9 rounded-xl bg-bg-primary border border-border flex items-center justify-center text-[11px] font-black hover:border-secondary hover:text-secondary transition-all cursor-default shadow-sm">AI</div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterClient;
