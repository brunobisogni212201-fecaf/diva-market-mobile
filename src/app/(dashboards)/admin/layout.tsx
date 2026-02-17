import { ROLES } from '@/lib/auth/rbac';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50">
            <DashboardSidebar role={ROLES.ADMIN} />
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
