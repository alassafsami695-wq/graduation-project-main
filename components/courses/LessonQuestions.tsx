"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, CheckCircle, XCircle, HelpCircle, Trophy, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { getLessonQuestions, submitLessonAnswers } from "@/actions/student/questions";
import { Question, SubmitAnswer, QuizResult } from "@/types";
import { toast } from "sonner";

interface LessonQuestionsProps {
    isOpen: boolean;
    onClose: () => void;
    lessonId: number;
    lessonTitle: string;
}

export default function LessonQuestions({ isOpen, onClose, lessonId, lessonTitle }: LessonQuestionsProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<QuizResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && lessonId) {
            fetchQuestions();
        }
    }, [isOpen, lessonId]);

    const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        setAnswers({});
        try {
            const data = await getLessonQuestions(lessonId);
            console.log("data", data);
            // Parse options - backend returns comma-separated string like "opt1, opt2, opt3"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const parsedQuestions: Question[] = data.map((q: any) => ({
                ...q,
                options: typeof q.options === 'string'
                    ? q.options.split(',').map((opt: string) => opt.trim())
                    : q.options
            }));
            setQuestions(parsedQuestions);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || "فشل في تحميل الأسئلة");
            toast.error("فشل في تحميل الأسئلة");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId: number, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = async () => {
        // Validate all questions answered
        const unanswered = questions.filter(q => !answers[q.id]);
        if (unanswered.length > 0) {
            toast.error(`يرجى الإجابة على جميع الأسئلة (${unanswered.length} سؤال متبقي)`);
            return;
        }

        setSubmitting(true);
        try {
            const submitAnswers: SubmitAnswer[] = Object.entries(answers).map(([questionId, answer]) => ({
                question_id: parseInt(questionId),
                answer
            }));

            const quizResult = await submitLessonAnswers(lessonId, submitAnswers);
            setResult(quizResult);
            toast.success(quizResult.status === 'passed' ? "مبروك! لقد اجتزت الاختبار" : "للأسف لم تجتز الاختبار، حاول مرة أخرى");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.message || "فشل في إرسال الإجابات");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRetry = () => {
        setResult(null);
        setAnswers({});
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="w-8 h-8" />
                                <div>
                                    <h2 className="text-xl font-bold">اختبار الدرس</h2>
                                    <p className="text-indigo-200 text-sm">{lessonTitle}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                                <p className="text-slate-600">جاري تحميل الأسئلة...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <AlertCircle className="w-12 h-12 text-red-500" />
                                <p className="text-red-600">{error}</p>
                                <Button onClick={fetchQuestions} variant="outline">
                                    إعادة المحاولة
                                </Button>
                            </div>
                        ) : result ? (
                            /* Result View */
                            <div className="flex flex-col items-center justify-center py-8 gap-6">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${result.status === 'passed'
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-red-100 text-red-600'
                                    }`}>
                                    {result.status === 'passed'
                                        ? <Trophy className="w-12 h-12" />
                                        : <XCircle className="w-12 h-12" />
                                    }
                                </div>
                                <div className="text-center">
                                    <h3 className={`text-2xl font-bold ${result.status === 'passed' ? 'text-emerald-600' : 'text-red-600'
                                        }`}>
                                        {result.status === 'passed' ? 'مبروك! نجحت في الاختبار' : 'للأسف لم تنجح'}
                                    </h3>
                                    <p className="text-slate-600 mt-2">
                                        النتيجة: {result.correct} من {result.total} ({result.score.toFixed(1)}%)
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Button onClick={handleRetry} variant="outline">
                                        إعادة الاختبار
                                    </Button>
                                    <Button onClick={onClose}>
                                        إغلاق
                                    </Button>
                                </div>
                            </div>
                        ) : questions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <HelpCircle className="w-12 h-12 text-slate-400" />
                                <p className="text-slate-600">لا توجد أسئلة لهذا الدرس</p>
                            </div>
                        ) : (
                            /* Questions List */
                            <div className="space-y-6">
                                {questions.map((question, index) => (
                                    <div
                                        key={question.id}
                                        className="bg-slate-50 rounded-xl p-5 border border-slate-200"
                                    >
                                        <div className="flex items-start gap-3 mb-4">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="font-medium text-slate-900">{question.question}</p>
                                                <span className="text-xs text-slate-500 mt-1 inline-block">
                                                    {question.type === 'mcq' ? 'اختيار متعدد' : 'صح أو خطأ'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mr-11">
                                            {question.type === 'true_false' ? (
                                                /* True/False Options */
                                                ['True', 'False'].map((option) => (
                                                    <label
                                                        key={option}
                                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${answers[question.id] === option
                                                            ? 'border-indigo-600 bg-indigo-50'
                                                            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-100'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value={option}
                                                            checked={answers[question.id] === option}
                                                            onChange={() => handleAnswerChange(question.id, option)}
                                                            className="w-4 h-4 text-indigo-600"
                                                        />
                                                        <span className="text-slate-700">
                                                            {option === 'True' ? 'صح' : 'خطأ'}
                                                        </span>
                                                    </label>
                                                ))
                                            ) : (
                                                /* MCQ Options */
                                                question.options?.map((option: string, optIdx: number) => (
                                                    <label
                                                        key={optIdx}
                                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${answers[question.id] === option
                                                            ? 'border-indigo-600 bg-indigo-50'
                                                            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-100'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value={option}
                                                            checked={answers[question.id] === option}
                                                            onChange={() => handleAnswerChange(question.id, option)}
                                                            className="w-4 h-4 text-indigo-600"
                                                        />
                                                        <span className="text-slate-700">{option}</span>
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {!loading && !error && !result && questions.length > 0 && (
                        <div className="border-t border-slate-200 p-4 bg-slate-50">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-600">
                                    تم الإجابة على {Object.keys(answers).length} من {questions.length} سؤال
                                </p>
                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={onClose}>
                                        إلغاء
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                جاري الإرسال...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                إرسال الإجابات
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
