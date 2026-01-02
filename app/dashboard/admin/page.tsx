import { getStats } from "@/actions/admin/get-stats";
import AdminDashboardClient from "@/components/lists/admin/AdminDashboardClient";

export default async function AdminDashboardPage() {
    const stats = await getStats();

    return (
        <div className="p-8 space-y-8 overflow-y-auto">
            <AdminDashboardClient stats={stats.stats} />
        </div>
    );
}
