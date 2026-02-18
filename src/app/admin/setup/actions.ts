'use server'

import { db } from '@/lib/db'
import { profiles, userRoleEnum } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function claimAdmin(formData: FormData) {
    const masterKey = formData.get('masterKey') as string
    const envMasterKey = process.env.MASTER_SECRET_KEY

    if (!envMasterKey) {
        return { error: 'System configuration error: MASTER_SECRET_KEY not set.' }
    }

    if (masterKey !== envMasterKey) {
        return { error: 'Invalid Master Key.' }
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in.' }
    }

    // Double check if admin already exists
    const existingAdmins = await db.select().from(profiles).where(eq(profiles.role, 'admin'))

    if (existingAdmins.length > 0) {
        // In strict mode, we should fail. But for dev/recovery, maybe just ensuring current user is admin is enough?
        // The requirement says "If an admin exists -> Render 'System already initialized'.
        // So here we should probably block it too.
        return { error: 'System already initialized. Admin already exists.' }
    }

    try {
        // 1. Update Drizzle Profile
        await db.update(profiles)
            .set({ role: 'admin' })
            .where(eq(profiles.id, user.id))

        // 2. Sync with Supabase Auth Metadata (Best Practice)
        await supabase.auth.updateUser({
            data: { role: 'admin' }
        })

        revalidatePath('/admin/setup')
        revalidatePath('/admin/dashboard')

    } catch (err) {
        console.error('Error promoting admin:', err)
        return { error: 'Database update failed.' }
    }

    redirect('/admin/dashboard')
}
