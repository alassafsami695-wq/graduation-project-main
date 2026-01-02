import { getStats } from "@/actions/public/get-stats";
import TeacherDashboardClient from "@/components/lists/teacher/TeacherDashboardClient";

export default async function TeacherDashboardPage() {
    const stats = await getStats();

    return (
        <div className="p-8 space-y-8 overflow-y-auto">
            <TeacherDashboardClient stats={stats.stats} />
        </div>
    );
}
