'use server'

import { db } from '@/lib/db'
import { profiles, userRoleEnum } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ROLES } from '@/lib/auth/rbac'

export async function updateUserRole(userId: string, newRole: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Verify current user is admin
    const adminProfile = await db.query.profiles.findFirst({
        where: eq(profiles.id, user.id),
        columns: { role: true }
    })

    if (adminProfile?.role !== 'admin') {
        return { error: 'Forbidden: Admin access required' }
    }

    // Validate new role
    if (!Object.values(ROLES).includes(newRole as any)) {
        return { error: 'Invalid role' }
    }

    try {
        // 1. Update Drizzle Profile
        await db.update(profiles)
            .set({ role: newRole as any })
            .where(eq(profiles.id, userId))

        // 2. Sync with Supabase Auth Metadata (Optional/Advanced: requires Service Role key usually)
        // Regular client can't update other user's metadata easily without Edge Functions.
        // We will rely on our 'profiles' table as the source of truth for Role Checks.

        revalidatePath('/admin/users')
        return { success: true }
    } catch (err) {
        console.error('Error updating role:', err)
        return { error: 'Failed to update role' }
    }
}
