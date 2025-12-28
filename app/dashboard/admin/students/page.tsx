import { getStudents } from "@/actions/admin/users/get-students";
import UserManager from "@/components/dashboard/admin/users/UserManager";

export default async function Page() {
    const studentsResponse = await getStudents();

    // The apiFetch returns json.data ?? json, so we need to handle both
    const students = studentsResponse?.data || studentsResponse || [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-black text-foreground tracking-tight">إدارة الطلاب</h1>
                <p className="text-lg text-foreground-muted max-w-2xl font-medium">
                    هنا يمكنك عرض جميع الطلاب المسجلين في النظام والتحكم في حالة حساباتهم.
                </p>
            </div>

            <UserManager
                initialUsers={Array.isArray(students) ? students : []}
                roleTitle="الطلاب"
            />
        </div>
    );
}
