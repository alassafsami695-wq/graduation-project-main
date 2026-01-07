"use client";

import React, { useState } from "react";
import { Search, UserCheck, UserX, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { toggleUser } from "@/actions/admin/users/toggle-user-status";
import UserRoleToggle from "@/components/admin/UserRoleToggle";

interface UserData {
    id: number;
    name: string;
    email: string;
    is_active: number; // Assuming 1 for active, 0 for inactive
    role?: {
        name: string;
    };
}

interface UserManagerProps {
    initialUsers: UserData[];
    roleTitle: string;
}

export default function UserManager({ initialUsers, roleTitle }: UserManagerProps) {
    const [users, setUsers] = useState(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleStatus = async (userId: number) => {
        setLoadingId(userId);
        try {
            await toggleUser(userId);
            setUsers(prevUsers =>
                prevUsers.map(u =>
                    u.id === userId ? { ...u, is_active: u.is_active === 1 ? 0 : 1 } : u
                )
            );
        } catch (error) {
            console.error("Error toggling user status:", error);
            alert("فشل في تغيير حالة المستخدم");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-secondary p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-foreground">{roleTitle}</h2>
                    <p className="text-sm text-foreground-muted">إدارة {roleTitle} وحالتهم في النظام</p>
                </div>

                <div className="relative flex-1 md:max-w-md">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                    <input
                        type="text"
                        placeholder="بحث بالاسم أو البريد الإلكتروني..."
                        className="w-full h-12 pr-12 pl-4 bg-bg-primary border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredUsers.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-bg-secondary border border-border rounded-2xl p-4 hover:border-primary/30 transition-all duration-300"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${user.is_active === 1 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="text-lg font-black text-foreground truncate">
                                            {user.name}
                                        </h3>
                                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black border ${user.is_active === 1 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.is_active === 1 ? 'bg-green-500' : 'bg-red-500'}`} />
                                            {user.is_active === 1 ? 'نشط' : 'معطل'}
                                        </div>
                                    </div>
                                    <p className="text-sm text-foreground-muted truncate font-medium mt-0.5">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                <UserRoleToggle
                                    userId={user.id}
                                    userName={user.name}
                                    currentRole={roleTitle === 'المعلمين' ? 'teacher' : 'user'} // Infer role from title or prop
                                    onSuccess={() => {
                                        // Optional: refresh logic if needed, but revalidatePath handles server side
                                        // If we want to remove them from the list if they become admin:
                                        // handleRemoveUser(user.id);
                                        // But usually they might just update. 
                                        // For now, let's keep them in the list.
                                    }}
                                />

                                <Button
                                    onClick={() => handleToggleStatus(user.id)}
                                    disabled={loadingId === user.id}
                                    variant="outline"
                                    className={`rounded-xl h-10 px-4 font-black transition-all border flex items-center justify-center gap-2 ${user.is_active === 1
                                        ? 'border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 shadow-sm shadow-red-500/10'
                                        : 'border-green-500/20 text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600 shadow-sm shadow-green-500/10'
                                        }`}
                                >
                                    {loadingId === user.id ? (
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {user.is_active === 1 ? (
                                                <>
                                                    <UserX className="w-4 h-4" />
                                                    <span className="text-xs">تعطيل</span>
                                                </>
                                            ) : (
                                                <>
                                                    <UserCheck className="w-4 h-4" />
                                                    <span className="text-xs">تفعيل</span>
                                                </>
                                            )}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-20 bg-bg-secondary/50 border-2 border-dashed border-border rounded-[3rem]">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-bg-primary border border-border mb-4">
                        <User className="w-8 h-8 text-foreground-muted" />
                    </div>
                    <p className="text-foreground-muted font-bold text-lg">لم يتم العثور على أي {roleTitle} يطابق بحثك</p>
                </div>
            )}
        </div>
    );
}
