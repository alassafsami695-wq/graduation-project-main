"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Shield,
    Wallet,
    Camera,
    Settings,
    Lock,
    Bell,
    Globe,
    CheckCircle,
    ChevronLeft,
    LogOut,
    Edit3,
    Trash2
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { updateProfile } from "@/actions/public/profile/update-profile";
import ChargeWalletModal from "./ChargeWalletModal";
import UpdateWalletModal from "./UpdateWalletModal";
import WithdrawWalletModal from "./WithdrawWalletModal";

interface ProfileClientProps {
    initialData: any;
}

const ProfileClient: React.FC<ProfileClientProps> = ({ initialData }) => {
    const { user, logout, setAuth, token } = useAuthStore();
    const [activeTab, setActiveTab] = useState("personal");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
    const [isUpdateWalletOpen, setIsUpdateWalletOpen] = useState(false);
    const [isWithdrawWalletOpen, setIsWithdrawWalletOpen] = useState(false);

    // Fallback to initialData if user is not yet populated, though useAuthStore is preferred
    const profile = user || initialData;

    const [formData, setFormData] = useState({
        name: profile?.name || "",
        email: profile?.email || "",
        address: profile?.address || "",
        phone_number: profile?.phone_number || "",
        birth_date: profile?.birth_date || "",
    });

    // Sync form data if profile changes (e.g. initial load)
    React.useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                email: profile.email || "",
                address: profile.address || "",
                phone_number: profile.phone_number || "",
                birth_date: profile.birth_date || "",
            });
        }
    }, [profile]);

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const res = await updateProfile(formData);

            if (res?.data) {
                // @ts-ignore
                setAuth(res.data, token!); // Update store
                toast.success("تم تحديث الملف الشخصي بنجاح");
                setIsEditing(false);
            } else if (res?.id) { // If it returns direct user object
                // @ts-ignore
                setAuth(res, token!);
                toast.success("تم تحديث الملف الشخصي بنجاح");
                setIsEditing(false);
            } else {
                console.log("Update response:", res);
                toast.success("تم التحديث (يرجى تحديث الصفحة لرؤية التغييرات)");
                setIsEditing(false);
                // Force reload if unsure about return type structure
                window.location.reload();
            }

        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ أثناء تحديث البيانات");
        } finally {
            setIsLoading(false);
        }
    };

    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email || 'default'}`;
    const userPhoto = profile?.photo || defaultAvatar;

    const tabs = [
        { id: "personal", label: "المعلومات الشخصية", icon: User },
        { id: "wallet", label: "المحفظة", icon: Wallet, shown: !!profile?.wallet },
    ].filter(tab => tab.shown !== false);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 md:px-0 space-y-12">
            {/* Header / Hero Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-64 md:h-80 rounded-[3rem] overflow-hidden bg-gradient-to-r from-primary via-indigo-600 to-secondary shadow-2xl"
            >
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/30 p-1 backdrop-blur-md shadow-2xl relative">
                            <img
                                src={userPhoto}
                                alt={profile?.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                            <button className="absolute bottom-2 right-2 p-2.5 bg-white text-primary rounded-full shadow-lg hover:scale-110 transition-transform">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black mt-6 tracking-tight">{profile?.name}</h1>
                    <div className="flex items-center gap-2 mt-2 opacity-80">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm font-medium">{profile?.email}</span>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Sidebar Navigation */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="lg:col-span-1 space-y-4"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-between gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === tab.id
                                ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                                : "bg-bg-secondary text-foreground-muted hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon className="w-5 h-5" />
                                <span className="text-sm">{tab.label}</span>
                            </div>
                            <ChevronLeft className={`w-4 h-4 transition-transform ${activeTab === tab.id ? "rotate-[-90deg]" : ""}`} />
                        </button>
                    ))}
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all mt-10"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm">تسجيل الخروج</span>
                    </button>
                </motion.div>

                {/* Main Content Area */}
                <motion.div
                    layout
                    className="lg:col-span-3 bg-bg-secondary/50 backdrop-blur-xl border border-border rounded-[3rem] p-8 md:p-12 shadow-sm"
                >
                    <AnimatePresence mode="wait">
                        {activeTab === "personal" && (
                            <motion.div
                                key="personal"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between pb-6 border-b border-border">
                                    <h2 className="text-2xl font-black">المعلومات الشخصية</h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary/20 transition-all"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            تعديل
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                                            >
                                                إلغاء
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                disabled={isLoading}
                                                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                            >
                                                {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-foreground-muted uppercase tracking-wider">الاسم الكامل</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full p-4 bg-bg-primary border border-border rounded-xl font-bold focus:outline-none focus:border-primary transition-colors"
                                            />
                                        ) : (
                                            <div className="p-4 bg-bg-primary border border-border rounded-xl font-bold">{profile?.name}</div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-foreground-muted uppercase tracking-wider">البريد الإلكتروني</label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full p-4 bg-bg-primary border border-border rounded-xl font-bold focus:outline-none focus:border-primary transition-colors"
                                                />
                                                <CheckCircle className="w-4 h-4 text-green-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-bg-primary border border-border rounded-xl font-bold flex items-center gap-2">
                                                {profile?.email}
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-foreground-muted uppercase tracking-wider">رقم الهاتف</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.phone_number}
                                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                                className="w-full p-4 bg-bg-primary border border-border rounded-xl font-bold focus:outline-none focus:border-primary transition-colors ltr"
                                                placeholder="05xxxxxxxx"
                                            />
                                        ) : (
                                            <div className="p-4 bg-bg-primary border border-border rounded-xl font-bold ltr text-right">{profile?.phone_number || "غير مدخل"}</div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-foreground-muted uppercase tracking-wider">تاريخ الميلاد</label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={formData.birth_date}
                                                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                                className="w-full p-4 bg-bg-primary border border-border rounded-xl font-bold focus:outline-none focus:border-primary transition-colors"
                                            />
                                        ) : (
                                            <div className="p-4 bg-bg-primary border border-border rounded-xl font-bold">{profile?.birth_date || "غير مدخل"}</div>
                                        )}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-black text-foreground-muted uppercase tracking-wider">العنوان</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full p-4 bg-bg-primary border border-border rounded-xl font-bold focus:outline-none focus:border-primary transition-colors"
                                            />
                                        ) : (
                                            <div className="p-4 bg-bg-primary border border-border rounded-xl font-bold">{profile?.address || "غير مدخل"}</div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-foreground-muted uppercase tracking-wider">نوع الحساب</label>
                                        <div className="p-4 bg-bg-primary border border-border rounded-xl font-bold text-secondary capitalize">
                                            {profile?.type?.replace('_', ' ') || "Student"}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-foreground-muted uppercase tracking-wider">تاريخ الانضمام</label>
                                        <div className="p-4 bg-bg-primary border border-border rounded-xl font-bold text-foreground-muted">ديسمبر 2023</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "wallet" && profile?.wallet && (
                            <motion.div
                                key="wallet"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-primary text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                                    <p className="text-lg opacity-80 font-bold mb-2">الرصيد المتاح</p>
                                    <h3 className="text-6xl font-black mb-10">{profile.wallet.balance} <span className="text-2xl opacity-60">ريال</span></h3>
                                    <h3 className="text-2xl font-black mb-10">{profile.wallet.account_number} <span className="text-2xl opacity-60"></span></h3>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <button
                                            onClick={() => setIsChargeModalOpen(true)}
                                            className="px-8 py-3 bg-white text-primary font-black rounded-2xl hover:bg-slate-50 transition-all shadow-lg"
                                        >
                                            شحن الرصيد
                                        </button>
                                        <button
                                            onClick={() => setIsWithdrawWalletOpen(true)}
                                            className="px-8 py-3 bg-primary-dark/20 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition-all"
                                        >
                                            سحب الرصيد
                                        </button>
                                        <button
                                            onClick={() => setIsUpdateWalletOpen(true)}
                                            className="px-8 py-3 bg-primary-dark/20 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition-all"
                                        >
                                            تحديث المحفظة
                                        </button>
                                        <button className="px-8 py-3 bg-primary-dark/20 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition-all">سجل المعاملات</button>
                                    </div>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
            <ChargeWalletModal isOpen={isChargeModalOpen} onClose={() => setIsChargeModalOpen(false)} />
            <UpdateWalletModal isOpen={isUpdateWalletOpen} onClose={() => setIsUpdateWalletOpen(false)} wallet={profile?.wallet} />
            <WithdrawWalletModal isOpen={isWithdrawWalletOpen} onClose={() => setIsWithdrawWalletOpen(false)} wallet={profile?.wallet} />
        </div>
    );
};

export default ProfileClient;
