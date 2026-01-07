import { useState, useTransition, useEffect } from "react";
import { Comment, User } from "@/types/course";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Send, Trash2, User as UserIcon, Reply, CornerDownLeft, X } from "lucide-react";
import { postComment } from "@/actions/public/comments/post-comment";
import { deleteComment } from "@/actions/public/comments/delete-comment";
import { getLessonComments } from "@/actions/public/comments/get-lesson-comments";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming cn utility is available

interface LessonCommentsProps {
    lessonId: number;
    initialComments: Comment[];
    teacherId?: number;
}

const nestComments = (flatComments: Comment[]) => {
    const map = new Map();
    const roots: Comment[] = [];

    // Create a copy to avoid mutating state
    const commentsCopy = flatComments.map(c => ({ ...c, replies: [] }));

    commentsCopy.forEach(comment => {
        map.set(comment.id, comment);
    });

    commentsCopy.forEach(comment => {
        if (comment.parent_id && map.has(comment.parent_id)) {
            const parent = map.get(comment.parent_id);
            if (!parent.replies) parent.replies = [];
            parent.replies.push(comment);
        } else {
            roots.push(comment);
        }
    });

    return roots;
};

export default function LessonComments({ lessonId, initialComments, teacherId }: LessonCommentsProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [content, setContent] = useState("");
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const nestedComments = nestComments(comments);

    const fetchComments = async () => {
        setIsLoadingComments(true);
        try {
            const res: any = await getLessonComments(lessonId);
            if (Array.isArray(res)) {
                setComments(res);
            } else if (res?.data && Array.isArray(res.data)) {
                setComments(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [lessonId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        startTransition(async () => {
            const res: any = await postComment({
                lesson_id: lessonId,
                body: content,
                parent_id: replyingTo?.id || null
            });

            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success(replyingTo ? "تم الرد بنجاح" : "تم إضافة التعليق");
                setContent("");
                setReplyingTo(null);
                fetchComments(); // Re-fetch all to get nested structure correctly
                router.refresh();
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
                toast.success("تم حذف التعليق");
                fetchComments();
                router.refresh();
            }
        });
    };

    const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
        const isTeacher = comment.user?.id === teacherId;

        return (
            <div className={`space-y-4 ${depth > 0 ? "mr-4 md:mr-10 border-r-2 border-slate-100 dark:border-slate-800 pr-4 md:pr-6" : ""}`}>
                <div className="flex gap-4 group">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold shadow-sm transition-transform group-hover:scale-110",
                        isTeacher ? "bg-indigo-600 text-white ring-4 ring-indigo-50" : "bg-indigo-50 border border-indigo-100 text-indigo-600"
                    )}>
                        {comment.user?.photo ? (
                            <img src={comment.user.photo} alt={comment.user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            comment.user?.name?.charAt(0).toUpperCase() || "U"
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className={cn(
                            "bg-white dark:bg-slate-900 border p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300",
                            isTeacher ? "border-indigo-200 dark:border-indigo-900 bg-indigo-50/10" : "border-slate-200 dark:border-slate-800"
                        )}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                                        {comment.user?.name || "مستخدم مجهول"}
                                        {isTeacher && (
                                            <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                المدرب
                                            </span>
                                        )}
                                    </span>
                                    <span className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                        {new Date(comment.created_at).toLocaleDateString('ar-EG')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="حذف"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {comment.body}
                            </p>
                            <div className="mt-4 flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        setReplyingTo(comment);
                                        document.getElementById("comment-input")?.focus();
                                    }}
                                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg"
                                >
                                    <Reply className="w-3.5 h-3.5" />
                                    رد
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {comment.replies && comment.replies.length > 0 && (
                    <div className="space-y-4 mt-2">
                        {comment.replies.map((reply) => (
                            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="mt-12 space-y-8 bg-slate-50/50 dark:bg-slate-900/20 p-6 md:p-10 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 transition-all">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black flex items-center gap-3">
                    المناقشات
                    <span className="text-sm font-bold bg-indigo-600 text-white px-3 py-1 rounded-full shadow-lg shadow-indigo-200 dark:shadow-none">
                        {comments.length}
                    </span>
                </h3>
            </div>

            {/* Comment Form */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

                <AnimatePresence>
                    {replyingTo && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, y: -10 }}
                            animate={{ height: "auto", opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -10 }}
                            className="mb-6 flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/40 px-5 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-800"
                        >
                            <div className="flex items-center gap-3 text-sm text-indigo-700 dark:text-indigo-300">
                                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                                    <CornerDownLeft className="w-4 h-4" />
                                </div>
                                <span className="font-medium">الرد على <strong className="font-black underline underline-offset-4 decoration-indigo-300">{replyingTo.user?.name}</strong></span>
                            </div>
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all hover:rotate-90"
                            >
                                <X className="w-4 h-4 text-indigo-400" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="flex gap-4 items-start relative z-10">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-inner group-focus-within:ring-2 ring-indigo-500/20 transition-all">
                        <UserIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <textarea
                            id="comment-input"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={replyingTo ? "اكتب ردك هنا..." : "شارك برأيك أو اطرح سؤالاً للمدرب..."}
                            className="w-full min-h-[120px] p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-sm font-medium leading-relaxed"
                            disabled={isPending}
                        />
                        <div className="flex justify-end gap-3">
                            {replyingTo && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setReplyingTo(null)}
                                    className="px-6 rounded-xl h-12 font-bold border-slate-200"
                                >
                                    إلغاء
                                </Button>
                            )}
                            <Button
                                type="submit"
                                disabled={isPending || !content.trim()}
                                className="px-10 rounded-xl h-12 font-black bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-3"
                            >
                                {isPending ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {replyingTo ? "نشر الرد" : "إضافة تعليق"}
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-10">
                {isLoadingComments ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-6">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-indigo-600/10 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                        </div>
                        <p className="text-slate-400 font-bold tracking-wide animate-pulse">جاري تحميل النقاشات...</p>
                    </div>
                ) : nestedComments.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-black/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50 group">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                            <Send className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h4 className="font-black text-xl text-slate-900 dark:text-white mb-2">كن أول من يبدأ النقاش!</h4>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">اطرح أسئلتك أو شارك تجربتك مع المدرب والطلاب الآخرين في هذا الدرس.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {nestedComments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
