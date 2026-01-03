import { useState, useTransition, useEffect } from "react";
import { Comment, User } from "@/types/course";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Send, Trash2, User as UserIcon } from "lucide-react";
import { postComment } from "@/actions/public/comments/post-comment";
import { deleteComment } from "@/actions/public/comments/delete-comment";
import { getLessonComments } from "@/actions/public/comments/get-lesson-comments";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LessonCommentsProps {
    lessonId: number;
    initialComments: Comment[];
    currentUser?: User;
}

export default function LessonComments({ lessonId, initialComments }: LessonCommentsProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [content, setContent] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoadingComments(true);
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const res: any = await getLessonComments(lessonId);
                console.log("res", res);
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

        fetchComments();
    }, [lessonId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        startTransition(async () => {
            // Optimistic update could go here, but let's wait for server response for ID
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await postComment({ lesson_id: lessonId, body: content });

            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success("Comment posted");
                setContent("");
                // Ideally backend returns the new comment. 
                // Since I don't know exact return structure, I'll assume it returns the created comment or I need to re-fetch
                // For now, let's refresh the page data to get new comments or append if res.data is the comment
                // Assuming res is the new comment:
                if (res.id) {
                    setComments([...comments, res as Comment]);
                } else {
                    router.refresh();
                }
            }
        });
    };

    const handleDelete = (commentId: number) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        startTransition(async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res: any = await deleteComment(commentId);
            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success("Comment deleted");
                setComments(comments.filter(c => c.id !== commentId));
                router.refresh();
            }
        });
    }

    return (
        <div className="mt-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
                Comments <span className="text-sm font-normal text-slate-500">({comments.length})</span>
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-6 h-6 text-slate-500" />
                </div>
                <div className="flex-1 flex gap-2">
                    <Input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Ask a question or share your thoughts..."
                        className="flex-1"
                        disabled={isPending}
                    />
                    <Button type="submit" size="icon" disabled={isPending || !content.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {isLoadingComments ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No comments yet. Be the first to start the discussion!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-700 font-bold upper">
                                {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-900">{comment.user?.name || "Unknown User"}</span>
                                        <span className="text-xs text-slate-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete comment"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-slate-700 leading-relaxed text-sm">
                                    {comment.body}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
