
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { ROLES } from '@/lib/auth/rbac';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    const role = user.user_metadata?.role;

    if (role !== ROLES.ADMIN) {
        redirect('/unauthorized');
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar for desktop, maybe bottom nav for mobile? 
                DashboardSidebar seems to handle responsive logic in many implementations, 
                let's assume it renders a sidebar. 
            */}
            <DashboardSidebar role={role} />

            <main className="flex-1 w-full overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
