'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getDashboardPath, UserRole } from '@/lib/auth/rbac';
import { Loader2 } from 'lucide-react';

export default function RoleRedirect() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkRoleAndRedirect = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            // Fetch user profile to get role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile && profile.role) {
                const dashboardPath = getDashboardPath(profile.role as UserRole);
                router.push(dashboardPath);
            } else {
                // Fallback if no role found (shouldn't happen if properly seeded/registered)
                router.push('/cliente');
            }

            setLoading(false);
        };

        checkRoleAndRedirect();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return null;
}
