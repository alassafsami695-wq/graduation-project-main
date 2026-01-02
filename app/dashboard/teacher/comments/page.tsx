import { getTeacherComments } from "@/actions/teacher/get-comments";
import TeacherCommentsClient from "@/components/lists/teacher/TeacherCommentsClient";

export default async function TeacherCommentsPage() {
    const commentsResponse = await getTeacherComments();
    const comments = commentsResponse?.data || commentsResponse || [];

    return (
        <div className="p-8 space-y-8">
            <div className="space-y-4">
                <h2 className="text-3xl font-black italic">
                    قائمة <span className="text-secondary">التعليقات</span>
                </h2>
                <p className="text-foreground-muted font-medium">
                    هنا يمكنك متابعة والرد على تعليقات الطلاب في دوراتك.
                </p>
            </div>
            <TeacherCommentsClient data={comments} />
        </div>
    );
}
