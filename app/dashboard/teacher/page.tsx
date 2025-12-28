import { getStats } from "@/actions/get-stats";
import TeacherDashboardClient from "@/components/dashboard/teacher/TeacherDashboardClient";

export default async function TeacherDashboardPage() {
    const stats = await getStats();

    return (
        <div className="p-8 space-y-8 overflow-y-auto">
            <TeacherDashboardClient stats={stats.stats} />
        </div>
    );
}
