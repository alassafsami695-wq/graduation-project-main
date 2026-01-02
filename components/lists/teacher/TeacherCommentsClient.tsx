"use client";

import React, { useState, useTransition } from "react";
import { MessageSquare, BookOpen, User, Calendar, Send, Trash2, Reply, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { postComment } from "@/actions/public/comments/post-comment";
import { deleteComment } from "@/actions/public/comments/delete-comment";
import { toast } from "sonner";

interface TeacherCommentsClientProps {
    data: any[];
}

const TeacherCommentsClient: React.FC<TeacherCommentsClientProps> = ({ data }) => {
    const [isPending, startTransition] = useTransition();
    const [replyingTo, setReplyingTo] = useState<{ lessonId: number; commentId: number | null } | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
    const [localData, setLocalData] = useState(data);

    const safeData = Array.isArray(localData) ? localData : [];

    const groupedData = safeData.reduce((acc: any, item: any) => {
        const courseTitle = item.title || "دورة غير معروفة";
        const lessonData = item.lessons;

        if (!acc[courseTitle]) {
            acc[courseTitle] = {
                title: courseTitle,
                lessons: {}
            };
        }

        if (Array.isArray(lessonData)) {
            lessonData.forEach((lesson: any) => {
                const lessonKey = `${courseTitle}-${lesson.id || lesson.title}`;
                const lessonTitle = lesson.title || "درس غير مسمى";
                const lessonId = lesson.id;
                if (!acc[courseTitle].lessons[lessonKey]) {
                    acc[courseTitle].lessons[lessonKey] = {
                        title: lessonTitle,
                        id: lessonId,
                        comments: []
                    };
                }
                const comments = Array.isArray(lesson.comments) ? lesson.comments : (lesson.comments ? [lesson.comments] : []);
                comments.forEach((c: any) => {
                    if (c?.body) acc[courseTitle].lessons[lessonKey].comments.push(c);
                });
            });
        }
        else if (lessonData && typeof lessonData === 'object') {
            const lessonKey = `${courseTitle}-${lessonData.id || lessonData.title}`;
            const lessonTitle = lessonData.title || "درس غير مسمى";
            const lessonId = lessonData.id;
            if (!acc[courseTitle].lessons[lessonKey]) {
                acc[courseTitle].lessons[lessonKey] = {
                    title: lessonTitle,
                    id: lessonId,
                    comments: []
                };
            }
            const comment = lessonData.comments;
            if (comment && comment.body) {
                acc[courseTitle].lessons[lessonKey].comments.push(comment);
            }
        }

        return acc;
    }, {});

    const courses = Object.values(groupedData);

    const toggleLesson = (lessonKey: string) => {
        setExpandedLessons(prev => {
            const newSet = new Set(prev);
            if (newSet.has(lessonKey)) {
                newSet.delete(lessonKey);
            } else {
                newSet.add(lessonKey);
            }
            return newSet;
        });
    };

    const handleReply = (lessonId: number, commentId: number | null = null) => {
        setReplyingTo({ lessonId, commentId });
        setReplyContent("");
    };

    const handleSubmitReply = () => {
        if (!replyContent.trim() || !replyingTo) return;

        startTransition(async () => {
            const res: any = await postComment({
                lesson_id: replyingTo.lessonId,
                body: replyContent,
                parent_id: replyingTo.commentId
            });

            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success("تم إضافة الرد بنجاح");
                setReplyContent("");
                setReplyingTo(null);
                // Refresh page to get updated comments
                window.location.reload();
            }
        });
    };

    const handleDelete = (commentId: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا التعليق؟")) return;

        startTransition(async () => {
            const res: any = await deleteComment(commentId);
            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success("تم حذف التعليق بنجاح");
                // Refresh page to get updated comments
                window.location.reload();
            }
        });
    };

    return (
        <div className="space-y-16">
            {courses.length > 0 ? (
                courses.map((course: any, courseIdx: number) => (
                    <div key={courseIdx} className="space-y-8">
                        {/* Course Identity */}
                        <div className="flex items-center gap-6 border-b border-border pb-6">
                            <div className="w-16 h-16 rounded-[2rem] bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-foreground mb-1">{course.title}</h2>
                                <div className="flex items-center gap-2 text-foreground-muted text-sm font-medium">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>{Object.values(course.lessons).length} دروس تحتوي على تعليقات</span>
                                </div>
                            </div>
                        </div>

                        {/* Lessons List */}
                        <div className="space-y-6 pr-4 md:pr-8">
                            {Object.entries(course.lessons).map(([lessonKey, lesson]: [string, any], lessonIdx: number) => {
                                const isExpanded = expandedLessons.has(lessonKey);

                                return (
                                    <div key={lessonIdx} className="space-y-4 relative">
                                        {/* Connection Line */}
                                        <div className="absolute right-[-24px] top-0 bottom-0 w-px bg-border" />

                                        {/* Lesson Header - Clickable */}
                                        <div
                                            className="flex items-center gap-4 relative cursor-pointer hover:bg-bg-secondary/50 p-3 rounded-xl -mr-3 transition-colors"
                                            onClick={() => toggleLesson(lessonKey)}
                                        >
                                            <div className="absolute right-[-28px] w-2 h-2 rounded-full bg-secondary ring-4 ring-bg-primary" />
                                            <div className="flex-1 flex items-center gap-3">
                                                <h3 className="text-xl font-black text-secondary/80 flex items-center gap-2">
                                                    <span className="opacity-40 italic">الدرس:</span>
                                                    <span className="text-foreground">{lesson.title}</span>
                                                </h3>
                                                <span className="text-[10px] font-bold bg-bg-secondary border border-border px-2 py-1 rounded-lg">
                                                    {lesson.comments.length} تعليق
                                                </span>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-foreground-muted" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-foreground-muted" />
                                            )}
                                        </div>

                                        {/* Comments List - Collapsible */}
                                        {isExpanded && (
                                            <div className="grid gap-4 animate-in slide-in-from-top-2">
                                                {lesson.comments.map((comment: any, commentIdx: number) => (
                                                    <div
                                                        key={commentIdx}
                                                        className="bg-bg-secondary/40 border border-border p-6 rounded-3xl group"
                                                    >
                                                        <div className="flex gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-bg-primary border border-border flex items-center justify-center shrink-0 overflow-hidden">
                                                                {comment.user?.photo ? (
                                                                    <img src={comment.user.photo} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <User className="w-6 h-6 text-foreground-muted" />
                                                                )}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-sm font-black truncate">
                                                                        {comment.user?.name || "طالب الأكاديمية"}
                                                                    </span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] text-foreground-muted flex items-center gap-1">
                                                                            <Calendar className="w-3.5 h-3.5" />
                                                                            {comment.created_at ? new Date(comment.created_at).toLocaleDateString('ar-EG') : 'الآن'}
                                                                        </span>
                                                                        {/* Action Buttons */}
                                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <button
                                                                                onClick={() => handleReply(lesson.id, comment.id)}
                                                                                className="p-1.5 text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                                                title="رد على التعليق"
                                                                            >
                                                                                <Reply className="w-4 h-4" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDelete(comment.id)}
                                                                                className="p-1.5 text-foreground-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                                title="حذف التعليق"
                                                                                disabled={isPending}
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm text-foreground-muted leading-relaxed">
                                                                    {comment.body}
                                                                </p>

                                                                {/* Replies */}
                                                                {comment.replies && comment.replies.length > 0 && (
                                                                    <div className="mt-4 pr-4 border-r-2 border-primary/20 space-y-3">
                                                                        {comment.replies.map((reply: any, replyIdx: number) => (
                                                                            <div key={replyIdx} className="flex gap-3 items-start">
                                                                                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                                                    {reply.user?.photo ? (
                                                                                        <img src={reply.user.photo} alt="" className="w-full h-full object-cover rounded-xl" />
                                                                                    ) : (
                                                                                        <User className="w-4 h-4 text-primary" />
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center gap-2 mb-1">
                                                                                        <span className="text-xs font-bold">{reply.user?.name || "المعلم"}</span>
                                                                                        <span className="text-[9px] text-foreground-muted">
                                                                                            {reply.created_at ? new Date(reply.created_at).toLocaleDateString('ar-EG') : ''}
                                                                                        </span>
                                                                                    </div>
                                                                                    <p className="text-xs text-foreground-muted">{reply.body}</p>
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => handleDelete(reply.id)}
                                                                                    className="p-1 text-foreground-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                    title="حذف الرد"
                                                                                    disabled={isPending}
                                                                                >
                                                                                    <Trash2 className="w-3 h-3" />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {/* Reply Form */}
                                                                {replyingTo?.lessonId === lesson.id && replyingTo?.commentId === comment.id && (
                                                                    <div className="mt-4 flex gap-2 items-center">
                                                                        <input
                                                                            type="text"
                                                                            value={replyContent}
                                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                                            placeholder="اكتب ردك هنا..."
                                                                            className="flex-1 px-4 py-2 bg-bg-primary border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
                                                                            autoFocus
                                                                        />
                                                                        <button
                                                                            onClick={handleSubmitReply}
                                                                            disabled={isPending || !replyContent.trim()}
                                                                            className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                                                                        >
                                                                            {isPending ? (
                                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                            ) : (
                                                                                <Send className="w-4 h-4" />
                                                                            )}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setReplyingTo(null)}
                                                                            className="p-2 text-foreground-muted hover:text-foreground transition-colors"
                                                                        >
                                                                            إلغاء
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Add New Comment for Lesson */}
                                                {replyingTo?.lessonId === lesson.id && replyingTo?.commentId === null && (
                                                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl">
                                                        <h4 className="text-sm font-bold mb-3">إضافة تعليق جديد</h4>
                                                        <div className="flex gap-2 items-center">
                                                            <input
                                                                type="text"
                                                                value={replyContent}
                                                                onChange={(e) => setReplyContent(e.target.value)}
                                                                placeholder="اكتب تعليقك هنا..."
                                                                className="flex-1 px-4 py-3 bg-bg-primary border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={handleSubmitReply}
                                                                disabled={isPending || !replyContent.trim()}
                                                                className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                                                            >
                                                                {isPending ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <>
                                                                        <Send className="w-4 h-4" />
                                                                        إرسال
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => setReplyingTo(null)}
                                                                className="px-4 py-3 text-foreground-muted hover:text-foreground transition-colors"
                                                            >
                                                                إلغاء
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Add Comment Button */}
                                                {(!replyingTo || replyingTo.lessonId !== lesson.id || replyingTo.commentId !== null) && (
                                                    <button
                                                        onClick={() => handleReply(lesson.id, null)}
                                                        className="w-full py-3 border-2 border-dashed border-border hover:border-primary text-foreground-muted hover:text-primary rounded-2xl transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <MessageSquare className="w-4 h-4" />
                                                        إضافة تعليق جديد
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-bg-secondary/20 border border-dashed border-border rounded-[3rem] text-center">
                    <MessageSquare className="w-12 h-12 text-foreground-muted mb-4 opacity-20" />
                    <h3 className="text-xl font-black mb-1">لا يوجد تعليقات حالياً</h3>
                    <p className="text-sm text-foreground-muted">سيتم عرض جميع تعليقات الطلاب هنا فور وصولها.</p>
                </div>
            )}
        </div>
    );
};

export default TeacherCommentsClient;
