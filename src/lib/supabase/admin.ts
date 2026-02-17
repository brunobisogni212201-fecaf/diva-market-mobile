import { createClient } from '@supabase/supabase-js'

// WARNING: This client bypasses Row Level Security (RLS).
// Only use this in trusted server-side contexts options (e.g., API routes, Server Actions).
// NEVER expose this client or the service role key to the client-side.

export const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)
