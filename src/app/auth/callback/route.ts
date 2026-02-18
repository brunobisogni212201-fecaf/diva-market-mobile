import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/dashboard";

    console.log("🔹 Auth Callback Triggered");
    console.log("   Code present:", !!code);
    console.log("   Origin:", origin);
    console.log("   Next path:", next);

    if (code) {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        );

        console.log("   Submitting code exchange...");
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            console.log("✅ Code exchange successful! Session created.");
            const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development';

            if (isLocalEnv) {
                console.log("   Redirecting to (local):", `${origin}${next}`);
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                console.log("   Redirecting to (fwd):", `https://${forwardedHost}${next}`);
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                console.log("   Redirecting to (origin):", `${origin}${next}`);
                return NextResponse.redirect(`${origin}${next}`);
            }
        } else {
            console.error("❌ Code exchange failed:", error.message);
        }
    } else {
        console.warn("⚠️ No code found in URL parameters.");
    }

    // return the user to an error page with instructions
    console.log("   Redirecting to error page.");
    return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
