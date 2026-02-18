'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

export async function recordConsent(version: string = '1.0') {
    const cookieStore = cookies()

    // 1. Initialize Client with Cookies (Crucial for Vercel)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) {
                    // Server Actions can't set cookies easily, but we just need to READ auth here.
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch { }
                },
            },
        }
    )

    // 2. Verify User
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        console.error("Auth Fail:", authError)
        return { success: false, error: 'Usuário não autenticado. Faça login novamente.' }
    }

    // 3. Get Metadata
    const headerList = headers()
    const ip = headerList.get('x-forwarded-for')?.split(',')[0] || 'unknown'

    // 4. Insert into DB using Supabase directly as requested in prompt, 
    // ensuring we use the authenticated client we just created.
    const { error: dbError } = await supabase
        .from('consent_logs')
        .insert({
            profile_id: user.id,
            consent_type: 'termos_privacidade',
            version: version,
            ip_address: ip,
            accepted_at: new Date().toISOString()
        })

    if (dbError) {
        console.error("DB Insert Fail:", dbError)
        return { success: false, error: 'Falha ao registrar consentimento no banco de dados.' }
    }

    return { success: true }
}
