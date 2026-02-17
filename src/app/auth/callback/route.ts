import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet: { name: string, value: string, options: CookieOptions }[]) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch (error) {
                            // The `set` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        );

        const { error, data } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data?.user) {
            // 2. Retrieve User Role
            // Checks user_metadata first (set during sign-up)
            // Fallback to 'usuaria' if not found, or handle fetching from profiles if needed in future
            const role = data.user.user_metadata?.role;

            // 3. Smart Redirect (Switch Case)
            switch (role) {
                case 'admin':
                    return NextResponse.redirect(`${origin}/admin`);
                case 'vendedora':
                    return NextResponse.redirect(`${origin}/cadastro/vendedora/completar-dados`); // PJ/PF Form
                case 'entregadora':
                    return NextResponse.redirect(`${origin}/cadastro/entregadora/dados-veiculo`);
                case 'usuaria':
                    return NextResponse.redirect(`${origin}/`); // Home
                default:
                    // FALLBACK: If no role or unknown role, redirect to selection
                    return NextResponse.redirect(`${origin}/cadastro/selecao`);
            }
        }
    }

    // 4. ERROR HANDLING
    // If invalid code or error exchanging code
    return NextResponse.redirect(`${origin}/auth/error`);
}
