import React from "react";
import SliderManager from "@/components/lists/admin/sliders/SliderManager";
import { getAds } from "@/actions/public/slides/get-slides";

export default async function AdminSlidersPage() {
    const ads = await getAds();

    return (
        <div className="p-8 space-y-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-black text-foreground">إدارة السلايدرز</h2>
                    <p className="text-foreground-muted mt-2">قم بإدارة الإعلانات والسلايدرز التي تظهر في الصفحة الرئيسية.</p>
                </div>

                <SliderManager initialSlides={ads} />
            </div>
        </div>
    );
}
