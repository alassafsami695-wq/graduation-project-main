"use client";

import React, { useState } from "react";
import { Course, Lesson } from "@/types/course";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { Clock, Users, Star, PlayCircle, BookOpen, User, CheckCircle, Smartphone, Globe, Lock, HelpCircle } from "lucide-react";
import Image from "next/image";
import { cn, getValidVideoUrl } from "@/lib/utils";
import LessonComments from "./LessonComments";
import LessonQuestions from "./LessonQuestions";

interface CourseViewProps {
    course: Course;
}

export default function CourseView({ course }: CourseViewProps) {
    console.log(course);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [quizLesson, setQuizLesson] = useState<Lesson | null>(null);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm">
                                <span className="bg-indigo-500/20 px-3 py-1 rounded-full">{course.path.title}</span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                    {course.rating} ({course.number_of_students} تقييم)
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold leading-tight">{course.title}</h1>
                            <p className="text-slate-300 text-lg md:text-xl max-w-2xl">
                                {course.description}
                            </p>

                            <div className="flex items-center gap-6 pt-4 text-sm md:text-base text-slate-300">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>بواسطة <span className="text-white font-semibold underline decoration-indigo-500 underline-offset-4">{course.teacher.name}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    <span>آخر تحديث {new Date(course.updated_at).toLocaleDateString('ar-EG')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 md:-mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Video Player Section */}
                        {currentLesson && (
                            <div className="space-y-6 mb-8">
                                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10">
                                    <iframe
                                        src={getValidVideoUrl(currentLesson.video_url)}
                                        className="w-full h-full"
                                        allowFullScreen
                                        title={currentLesson.title}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <CompleteLessonButton
                                        lessonId={currentLesson.id}
                                        isCompleted={false}
                                        onComplete={() => {
                                            // Optional: Update local state if needed
                                        }}
                                    />
                                </div>

                                <LessonComments
                                    key={currentLesson.id} // Re-mount on lesson change
                                    lessonId={currentLesson.id}
                                    initialComments={currentLesson.comments || []}
                                    teacherId={course.teacher.id}
                                />
                            </div>
                        )}

                        {/* Course Overview Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="bg-white/95 backdrop-blur shadow-lg border-none">
                                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-1">
                                    <Clock className="w-6 h-6 text-indigo-600" />
                                    <span className="font-bold text-slate-900">{course.course_duration}</span>
                                    <span className="text-xs text-slate-500">المدة</span>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/95 backdrop-blur shadow-lg border-none">
                                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-1">
                                    <Users className="w-6 h-6 text-indigo-600" />
                                    <span className="font-bold text-slate-900">{course.number_of_students}</span>
                                    <span className="text-xs text-slate-500">طالب</span>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/95 backdrop-blur shadow-lg border-none">
                                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-1">
                                    <BookOpen className="w-6 h-6 text-indigo-600" />
                                    <span className="font-bold text-slate-900">{course.lessons.length}</span>
                                    <span className="text-xs text-slate-500">دروس</span>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/95 backdrop-blur shadow-lg border-none">
                                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-1">
                                    <Smartphone className="w-6 h-6 text-indigo-600" />
                                    <span className="font-bold text-slate-900">جوال</span>
                                    <span className="text-xs text-slate-500">وصول</span>
                                </CardContent>
                            </Card>
                        </div>

                        {/* What you'll learn */}
                        <Card className="border-none shadow-md overflow-hidden">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-xl">محتوى الدورة</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100">
                                    {course.lessons.map((lesson, index) => (
                                        <div
                                            key={lesson.id}
                                            className={cn(
                                                "p-4 transition-colors flex items-start gap-4 group cursor-pointer",
                                                currentLesson?.id === lesson.id ? "bg-indigo-50/50" : "hover:bg-slate-50"
                                            )}
                                            onClick={() => {
                                                if (course.is_enrolled) {
                                                    setCurrentLesson(lesson);
                                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                                }
                                            }}
                                        >
                                            <div className={cn(
                                                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                                                currentLesson?.id === lesson.id
                                                    ? "bg-indigo-600 text-white"
                                                    : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                                            )}>
                                                {currentLesson?.id === lesson.id ? <PlayCircle className="w-4 h-4" /> : index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={cn(
                                                    "font-medium transition-colors",
                                                    currentLesson?.id === lesson.id ? "text-indigo-600" : "text-slate-900 group-hover:text-indigo-600"
                                                )}>
                                                    {lesson.title}
                                                </h3>
                                            </div>
                                            {course.is_enrolled ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setQuizLesson(lesson);
                                                        }}
                                                        className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                                                        title="اختبار الدرس"
                                                    >
                                                        <HelpCircle className="w-4 h-4" />
                                                    </button>
                                                    <div className={cn(
                                                        "transition-colors",
                                                        currentLesson?.id === lesson.id ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-600"
                                                    )}>
                                                        <PlayCircle className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-slate-300">
                                                    <Lock className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Teacher Info */}
                        <Card className="border-none shadow-md">
                            <CardContent className="p-8">
                                <h3 className="text-xl font-bold mb-6">المدرب</h3>
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-2xl font-bold">
                                        {course.teacher.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900">{course.teacher.name}</h4>
                                        <p className="text-indigo-600 font-medium mb-2">{course.teacher.email}</p>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            مدرب خبير في {course.path.title}. ملتزم بمساعدة الطلاب على التعلم وتحقيق أهدافهم المهنية.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">

                            {/* Purchase/Preview Card */}
                            <Card className="border-none shadow-xl overflow-hidden ring-1 ring-slate-900/5">
                                {!currentLesson && (
                                    <div className="aspect-video relative bg-slate-900 flex items-center justify-center overflow-hidden">
                                        {course.photo ? (
                                            <Image
                                                src={(() => {
                                                    if (!course.photo) return "/placeholder-course.png";
                                                    let p = course.photo;
                                                    if (p.includes('http') && p.lastIndexOf('http') > 0) p = p.substring(p.lastIndexOf('http'));
                                                    if (p.startsWith('http')) {
                                                        if (p.includes('/courses/') && !p.includes('/storage/')) return p.replace('/courses/', '/storage/courses/');
                                                        return p;
                                                    }
                                                    return `http://127.0.0.1:8000/storage/${p.startsWith('/') ? p.slice(1) : p}`;
                                                })()}
                                                alt={course.title}
                                                fill
                                                className="object-cover opacity-80"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                                        )}
                                        <div className="relative z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                                            <PlayCircle className="w-10 h-10 text-white fill-indigo-600/50" />
                                        </div>
                                    </div>
                                )}

                                <CardContent className="p-6">
                                    <div className="mb-6">
                                        <span className="text-3xl font-bold text-slate-900 block">
                                            {course.price === 0 ? "مجاني" : `${course.price.toLocaleString()} ل.س`}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {course.is_enrolled ? (
                                            <Button className="w-full text-lg" size="lg" variant="premium">
                                                متابعة التعلم
                                            </Button>
                                        ) : (
                                            <>
                                                <Button className="w-full text-lg" size="lg" variant="default">
                                                    سجل الآن
                                                </Button>
                                                <Button className="w-full" size="lg" variant="outline">
                                                    أضف إلى المفضلة
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            <span>وصول مدى الحياة</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            <span>الوصول على الجوال والكمبيوتر</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            <span>شهادة إتمام</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            {/* Lesson Questions Modal */}
            <LessonQuestions
                isOpen={!!quizLesson}
                onClose={() => setQuizLesson(null)}
                lessonId={quizLesson?.id || 0}
                lessonTitle={quizLesson?.title || ""}
            />
        </div>
    );
}

import { Check } from "lucide-react";
import { completeLessonAction } from "@/actions/student/lessons/complete-lesson";
import { toast } from "sonner";
import { useTransition } from "react";

function CompleteLessonButton({ lessonId, isCompleted, onComplete }: { lessonId: number, isCompleted: boolean, onComplete?: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [completed, setCompleted] = useState(isCompleted);

    const handleComplete = () => {
        if (completed || isPending) return;

        startTransition(async () => {
            const res = await completeLessonAction(lessonId);
            if (res.success) {
                setCompleted(true);
                toast.success("مبروك! أنهيت الدرس");
                onComplete?.();
            } else {
                toast.error(res.error || "حدث خطأ");
            }
        });
    };

    if (completed) {
        return (
            <Button variant="outline" className="gap-2 text-emerald-600 border-emerald-200 bg-emerald-50 pointer-events-none">
                <Check className="w-4 h-4" />
                تم الإكمال
            </Button>
        );
    }

    return (
        <Button
            onClick={handleComplete}
            disabled={isPending}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
            {isPending ? "جاري الحفظ..." : "إكمال الدرس"}
            <CheckCircle className="w-4 h-4" />
        </Button>
    );
}
