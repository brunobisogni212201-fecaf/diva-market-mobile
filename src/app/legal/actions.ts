'use server'

import { db } from '@/lib/db'
import { consentLogs } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function recordConsent() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Você precisa estar logada para aceitar os termos.' }
    }

    try {
        const headerStore = headers()
        const forwardedFor = headerStore.get('x-forwarded-for')
        // Ensure IP is a string, handle potentially multiple IPs or null/undefined
        const ip = typeof forwardedFor === 'string' ? forwardedFor.split(',')[0] : 'unknown'

        await db.insert(consentLogs).values({
            profileId: user.id,
            consentType: 'termos_privacidade_v1',
            version: '1.0',
            ipAddress: ip,
            acceptedAt: new Date().toISOString()
        })

        return { success: true }
    } catch (error) {
        console.error('Error in recordConsent:', error)
        return { error: 'Falha ao registrar consentimento. Por favor, tente novamente.' }
    }
}
