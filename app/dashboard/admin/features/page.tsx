import FeatureManager from "@/components/lists/admin/features/FeatureManager";
import { getFeatures } from "@/actions/public/get-features";

export default async function AdminFeaturesPage() {
    const features = await getFeatures();

    return (
        <>
            <div className="p-8 space-y-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-foreground">المميزات</h2>
                        <p className="text-foreground-muted mt-2">قم بإدارة المميزات التي تظهر في الصفحة الرئيسية للأكاديمية.</p>
                    </div>

                    <FeatureManager initialFeatures={features} />
                </div>
            </div>
        </>
    );
}
