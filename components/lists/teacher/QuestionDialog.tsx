"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Sparkles, Plus, Trash2, CheckCircle2, List, Type, MessageSquare, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { getTeacherCoursesLessons } from "@/actions/teacher/get-course-lessons";
import { generateQuestionsAction, storeQuestionsAction } from "@/actions/teacher/questions";
import { toast } from "sonner";

interface QuestionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: number;
    courseTitle: string;
}

interface Lesson {
    id: number;
    title: string;
}

const QuestionDialog: React.FC<QuestionDialogProps> = ({ isOpen, onClose, courseId, courseTitle }) => {
    const [activeTab, setActiveTab] = useState<"manual" | "ai">("manual");
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLessonId, setSelectedLessonId] = useState<number | "">("");
    const [isLoadingLessons, setIsLoadingLessons] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // AI State
    const [aiText, setAiText] = useState("");
    const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

    // Manual State
    const [manualQuestions, setManualQuestions] = useState<any[]>([
        { type: "mcq", question: "", options: "", answer: "" }
    ]);

    useEffect(() => {
        if (isOpen && courseId) {
            fetchLessons();
        }
    }, [isOpen, courseId]);

    const fetchLessons = async () => {
        setIsLoadingLessons(true);
        try {
            const res = await getTeacherCoursesLessons(courseId);
            setLessons(Array.isArray(res) ? res : res.data || []);
        } catch (error) {
            console.error("Failed to fetch lessons:", error);
            toast.error("فشل في تحميل الدروس");
        } finally {
            setIsLoadingLessons(false);
        }
    };

    const handleAddManualQuestion = () => {
        setManualQuestions([...manualQuestions, { type: "mcq", question: "", options: "", answer: "" }]);
    };

    const handleRemoveManualQuestion = (index: number) => {
        setManualQuestions(manualQuestions.filter((_, i) => i !== index));
    };

    const handleManualChange = (index: number, field: string, value: string) => {
        const updated = [...manualQuestions];
        updated[index][field] = value;
        setManualQuestions(updated);
    };

    const handleGenerateAI = async () => {
        if (!selectedLessonId) return toast.error("يرجى اختيار درس أولاً");
        if (!aiText.trim()) return toast.error("يرجى إدخال نص للتوليد");

        setIsSubmitting(true);
        try {
            const res = await generateQuestionsAction(Number(selectedLessonId), aiText) as any;
            // Process the weird nested response from the controller
            const mcqs = res.questions?.multiple_choice?.questions?.map((q: any) => ({ ...q, type: "mcq" })) || [];
            const tfs = res.questions?.true_false?.questions?.map((q: any) => ({ ...q, type: "true_false" })) || [];
            setGeneratedQuestions([...mcqs, ...tfs]);
            toast.success("تم توليد الأسئلة بنجاح! يمكنك مراجعتها وحفظها");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveManual = async () => {
        if (!selectedLessonId) return toast.error("يرجى اختيار درس أولاً");
        if (manualQuestions.some(q => !q.question || !q.answer)) {
            return toast.error("يرجى إكمال جميع نص الأسئلة والإجابات");
        }

        setIsSubmitting(true);
        try {
            await storeQuestionsAction(Number(selectedLessonId), manualQuestions);
            toast.success("تم حفظ الأسئلة بنجاح");
            onClose();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl bg-bg-secondary border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-border flex items-center justify-between bg-bg-primary/50 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Plus className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black">إضافة أسئلة للدورة</h2>
                                <p className="text-xs text-foreground-muted font-bold">{courseTitle}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-xl transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content Scrollable */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                        {/* Lesson Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-black flex items-center gap-2 px-1">
                                <List className="w-4 h-4 text-primary" />
                                اختر الدرس
                            </label>
                            <select
                                value={selectedLessonId}
                                onChange={(e) => setSelectedLessonId(Number(e.target.value))}
                                className="w-full bg-bg-primary border border-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold appearance-none cursor-pointer"
                            >
                                <option value="">اختر من القائمة...</option>
                                {lessons.map((lesson) => (
                                    <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                                ))}
                            </select>
                            {isLoadingLessons && <p className="text-[10px] text-primary animate-pulse font-bold mr-2">جاري تحميل الدروس...</p>}
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1.5 bg-bg-primary border border-border rounded-2xl w-fit mx-auto">
                            <button
                                onClick={() => setActiveTab("manual")}
                                className={`px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === "manual" ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "text-foreground-muted hover:text-foreground"}`}
                            >
                                <Type className="w-4 h-4" />
                                إدخال يدوي
                            </button>
                            <button
                                onClick={() => setActiveTab("ai")}
                                className={`px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === "ai" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-foreground-muted hover:text-foreground"}`}
                            >
                                <Sparkles className="w-4 h-4" />
                                توليد بالذكاء الاصطناعي
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[300px]">
                            {activeTab === "manual" ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-black flex items-center gap-2">
                                            <div className="w-2 h-8 bg-secondary rounded-full" />
                                            الأسئلة اليدوية
                                        </h3>
                                        <Button onClick={handleAddManualQuestion} variant="outline" className="rounded-xl border-secondary/20 text-secondary hover:bg-secondary/10 flex items-center gap-2">
                                            <Plus className="w-4 h-4" />
                                            إضافة سؤال
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {manualQuestions.map((q, idx) => (
                                            <div key={idx} className="p-6 bg-bg-primary/50 border border-border rounded-3xl relative group">
                                                <button
                                                    onClick={() => handleRemoveManualQuestion(idx)}
                                                    className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="md:col-span-2 space-y-2">
                                                        <label className="text-xs font-black text-foreground-muted mr-1">نص السؤال</label>
                                                        <input
                                                            value={q.question}
                                                            onChange={(e) => handleManualChange(idx, "question", e.target.value)}
                                                            className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 font-bold"
                                                            placeholder="اكتب السؤال هنا..."
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black text-foreground-muted mr-1">نوع السؤال</label>
                                                        <select
                                                            value={q.type}
                                                            onChange={(e) => handleManualChange(idx, "type", e.target.value)}
                                                            className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 font-bold"
                                                        >
                                                            <option value="mcq">اختيار من متعدد (MCQ)</option>
                                                            <option value="true_false">صح / خطأ</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black text-foreground-muted mr-1">الإجابة الصحيحة</label>
                                                        <input
                                                            value={q.answer}
                                                            onChange={(e) => handleManualChange(idx, "answer", e.target.value)}
                                                            className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 font-bold"
                                                            placeholder="الإجابة الصحيحة..."
                                                        />
                                                    </div>
                                                    {q.type === "mcq" && (
                                                        <div className="md:col-span-2 space-y-2">
                                                            <label className="text-xs font-black text-foreground-muted mr-1 flex items-center gap-2">
                                                                الخيارات
                                                                <span className="text-[10px] font-normal italic">(افصل بين الخيارات بفاصلة ,)</span>
                                                            </label>
                                                            <input
                                                                value={q.options}
                                                                onChange={(e) => handleManualChange(idx, "options", e.target.value)}
                                                                className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 font-bold"
                                                                placeholder="خيار 1, خيار 2, خيار 3..."
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-black flex items-center gap-2">
                                            <div className="w-2 h-8 bg-primary rounded-full" />
                                            توليد بالذكاء الاصطناعي
                                        </h3>
                                        <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex items-start gap-3">
                                            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <p className="text-xs font-bold text-primary/80 leading-relaxed">
                                                أدخل محتوى الدرس النصي أدناه وسيقوم النظام بتحليله وتوليد مجموعة من الأسئلة المناسبة (اختيار من متعدد وصح/خطأ) بشكل تلقائي.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-foreground-muted px-1">نص الدرس / المحتوى</label>
                                        <textarea
                                            value={aiText}
                                            onChange={(e) => setAiText(e.target.value)}
                                            rows={8}
                                            className="w-full bg-bg-primary border border-border rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold leading-relaxed custom-scrollbar"
                                            placeholder="الصق هنا محتوى الدرس الذي تريد توليد أسئلة منه..."
                                        />
                                    </div>

                                    <Button
                                        onClick={handleGenerateAI}
                                        disabled={isSubmitting || !aiText.trim()}
                                        className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg gap-3 shadow-xl shadow-primary/20"
                                    >
                                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                            <>
                                                <Sparkles className="w-6 h-6" />
                                                توليد الأسئلة الآن
                                            </>
                                        )}
                                    </Button>

                                    {generatedQuestions.length > 0 && (
                                        <div className="space-y-6 pt-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-black text-foreground">الأسئلة المولدة ({generatedQuestions.length})</h4>
                                                <div className="flex items-center gap-2 text-[10px] text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    جاهز للحفظ
                                                </div>
                                            </div>
                                            <div className="grid gap-4">
                                                {generatedQuestions.map((q, idx) => (
                                                    <div key={idx} className="p-5 bg-green-500/5 border border-green-500/10 rounded-2xl space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] font-black bg-white border border-green-500/20 text-green-600 px-2 py-0.5 rounded uppercase">
                                                                {q.type}
                                                            </span>
                                                            <p className="text-sm font-bold text-foreground">{q.question}</p>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-foreground-muted pr-10">الإجابة: {q.answer}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-center text-foreground-muted italic">
                                                ملاحظة: عند الضغط على حفظ في الأسفل، سيتم تخزين هذه الأسئلة في بنك الأسئلة للدرس المختار.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-border bg-bg-primary/50 flex gap-4 shrink-0">
                        <Button
                            onClick={handleSaveManual}
                            disabled={isSubmitting || !selectedLessonId || (activeTab === "manual" && manualQuestions.length === 0) || (activeTab === "ai" && generatedQuestions.length === 0)}
                            className={`flex-1 h-14 rounded-2xl text-white font-black text-lg shadow-xl ${activeTab === "manual" ? "bg-secondary shadow-secondary/20" : "bg-primary shadow-primary/20"}`}
                        >
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "حفظ الأسئلة"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-14 rounded-2xl font-black text-lg border-border"
                        >
                            إلغاء
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default QuestionDialog;
