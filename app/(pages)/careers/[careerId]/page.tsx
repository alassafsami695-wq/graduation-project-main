import { getCareerDetail } from "@/actions/public/careers/get-career-detail";
import { Briefcase, CircleDollarSign, Clock, ArrowRight, CheckCircle2, MapPin, Calendar, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ careerId: string }>;
}

export default async function CareerDetailsPage({ params }: PageProps) {
    const { careerId } = await params;
    const response = await getCareerDetail(Number(careerId));

    const career = response;

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-bg-secondary border-b border-border py-20 px-4">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50" />

                <div className="container mx-auto max-w-5xl relative z-10">
                    <Link
                        href="/careers"
                        className="inline-flex items-center gap-2 text-foreground-muted hover:text-primary transition-colors mb-8 group"
                    >
                        <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                        العودة إلى قائمة الوظائف
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                <Briefcase size={16} />
                                {career.job_type}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-gradient leading-tight">
                                {career.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-foreground-muted">
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} className="text-primary" />
                                    <span>{career.company_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={18} className="text-secondary" />
                                    <span>{career.created_at ? new Date(career.created_at).toLocaleDateString('ar-EG') : 'نشر حديثاً'}</span>
                                </div>
                                {career.salary && (
                                    <div className="flex items-center gap-2">
                                        <CircleDollarSign size={18} className="text-green-500" />
                                        <span className="font-bold text-foreground">{career.salary} $</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button className="btn-primary px-8 py-3 text-lg">
                                قدم الآن
                            </button>
                            <button className="p-3 rounded-xl border-2 border-border text-foreground-muted hover:border-primary hover:text-primary transition-all">
                                <Share2 size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto max-w-5xl px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-primary rounded-full" />
                                وصف الوظيفة
                            </h2>
                            <p className="text-lg text-foreground-muted leading-relaxed whitespace-pre-line bg-bg-secondary p-8 rounded-3xl border border-border">
                                {career.description}
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-secondary rounded-full" />
                                المتطلبات والمسؤوليات
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "خبرة في التقنيات المطلوبة لأكثر من سنتين",
                                    "القدرة على العمل ضمن فريق",
                                    "مهارات تواصل ممتازة",
                                    "التزام بمواعيد التسليم الجودة",
                                ].map((req, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-border glass group hover:border-primary transition-colors">
                                        <CheckCircle2 size={20} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
                                        <span className="text-foreground-muted">{req}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="card-modern glass sticky top-24 space-y-6">
                            <h3 className="text-xl font-bold">معلومات سريعة</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm py-2 border-b border-border/50">
                                    <span className="text-foreground-muted">نوع العمل</span>
                                    <span className="font-bold">{career.job_type}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm py-2 border-b border-border/50">
                                    <span className="text-foreground-muted">اسم الشركة</span>
                                    <span className="font-bold">{career.company_name}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm py-2 border-b border-border/50">
                                    <span className="text-foreground-muted">عدد ساعات العمل</span>
                                    <span className="font-bold">{career.working_hours} ساعة / يوم</span>
                                </div>
                                <div className="flex justify-between items-center text-sm py-2 border-b border-border/50">
                                    <span className="text-foreground-muted">الراتب المتوقع</span>
                                    <span className="font-bold text-primary">{career.salary} $</span>
                                </div>
                                <div className="flex justify-between items-center text-sm py-2 border-b border-border/50">
                                    <span className="text-foreground-muted">تواصل مع الشركة</span>
                                    <span className="font-bold">{career.company_email}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm py-2">
                                    <span className="text-foreground-muted">تاريخ النشر</span>
                                    <span className="font-bold">{career.created_at ? new Date(career.created_at).toLocaleDateString('ar-EG') : 'نشر حديثاً'}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
                                <p className="text-xs text-foreground-muted text-center leading-relaxed">
                                    نحن نبحث عن المواهب التي تريد إحداث فرق حقيقي في التكنولوجيا والتعليم.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
