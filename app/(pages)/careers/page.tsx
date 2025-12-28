import { getCareers } from "@/actions/careers/get-careers";
import { CareerCard } from "@/components/careers/CareerCard";
import { Career } from "@/types/career.types";

export default async function CareersPage() {
    const careers: Career[] = await getCareers();

    return (
        <div className="container mx-auto px-4 py-16">
            {/* Header Section */}
            <div className="max-w-3xl mb-16 space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-gradient">
                    انضم إلى فريقنا المبدع
                </h1>
                <p className="text-lg text-foreground-muted leading-relaxed">
                    نحن دائماً نبحث عن المبدعين والمتحمسين للمشاركة في بناء مستقبل التعليم.
                    اكتشف الفرص المتاحة وكن جزءاً من رحلتنا.
                </p>
                <div className="w-24 h-1.5 bg-primary rounded-full"></div>
            </div>

            {/* Grid Section */}
            {careers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {careers.map((career, index) => (
                        <CareerCard key={career.id} career={career} index={index} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 glass rounded-3xl border-dashed border-2">
                    <div className="p-6 rounded-full bg-foreground-muted/10 text-foreground-muted">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">لا توجد وظائف شاغرة حالياً</h2>
                        <p className="text-foreground-muted">يرجى التحقق مرة أخرى في وقت لاحق.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
