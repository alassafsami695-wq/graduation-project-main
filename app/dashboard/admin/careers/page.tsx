import React from "react";
import CareerManager from "@/components/lists/admin/careers/CareerManager";
import { getCareers } from "@/actions/public/careers/get-careers";

export default async function AdminCareersPage() {
    const careers = await getCareers();

    return (
        <div className="p-8 space-y-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-black text-foreground">إدارة الوظائف</h2>
                    <p className="text-foreground-muted mt-2">قم بإضافة وتعديل الفرص الوظيفية المتاحة في الأكاديمية.</p>
                </div>

                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <CareerManager initialCareers={(careers as any)?.data || careers || []} />
            </div>
        </div>
    );
}
