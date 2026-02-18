'use server'

import { db } from '@/lib/db'
import { consentLogs } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function acceptTerms() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const headerStore = headers()
    const ip = headerStore.get('x-forwarded-for') || 'unknown'

    try {
        await db.insert(consentLogs).values({
            profileId: user.id,
            consentType: 'termos_privacidade_combinados',
            version: '1.0',
            ipAddress: ip as string,
            acceptedAt: new Date().toISOString()
        })

        return { success: true }
    } catch (error) {
        console.error('Error logging consent:', error)
        return { error: 'Failed to record consent' }
    }
}
