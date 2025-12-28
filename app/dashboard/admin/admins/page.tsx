import { getAdmins } from "@/actions/admin/users/get-admins";
import { User, Shield, Mail, Calendar } from "lucide-react";
import React from "react";

export default async function AdminsPage() {
    const admins = await getAdmins();

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="w-8 h-8 text-primary" />
                    إدارة المسؤولين
                </h1>
                {/* Potentially add 'Add Admin' button here later */}
            </div>

            <div className="bg-bg-secondary rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-bg-primary/50 border-b border-border">
                            <tr>
                                <th className="p-4 text-sm font-bold text-foreground-muted whitespace-nowrap">المسؤول</th>
                                <th className="p-4 text-sm font-bold text-foreground-muted whitespace-nowrap">البريد الإلكتروني</th>
                                <th className="p-4 text-sm font-bold text-foreground-muted whitespace-nowrap">تاريخ الانضمام</th>
                                {/* <th className="p-4 text-sm font-bold text-foreground-muted whitespace-nowrap">الإجراءات</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {admins && admins.length > 0 ? (
                                admins.map((admin: any) => (
                                    <tr
                                        key={admin.id}
                                        className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    {admin.photo ? (
                                                        <img src={admin.photo} alt={admin.name} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        <User className="w-5 h-5 text-primary" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{admin.name}</p>
                                                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                                        مسؤول
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-foreground-muted">
                                                <Mail className="w-4 h-4" />
                                                <span className="text-sm font-medium ltr">{admin.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-foreground-muted">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-sm font-medium">
                                                    {new Date(admin.created_at).toLocaleDateString("ar-EG")}
                                                </span>
                                            </div>
                                        </td>
                                        {/* <td className="p-4">
                      Actions like Edit/Delete could go here
                    </td> */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-foreground-muted">
                                        لا يوجد مسؤولين حالياً
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
