import React from "react";
import Header from "@/components/dashboard/Header";
import ContactManager from "@/components/dashboard/admin/contact-settings/ContactManager";
import { getContacts } from "@/actions/contact/get-contacts";

export default async function AdminContactSettingsPage() {
    const contacts = await getContacts();

    return (
        <>
            <div className="p-8 space-y-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-foreground">بيانات التواصل</h2>
                        <p className="text-foreground-muted mt-2">قم بإدارة معلومات التواصل التي ستظهر في تذييل الموقع وفي صفحة اتصل بنا.</p>
                    </div>

                    <ContactManager initialContacts={contacts} />
                </div>
            </div>
        </>
    );
}
