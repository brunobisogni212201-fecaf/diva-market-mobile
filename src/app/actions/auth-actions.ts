'use server';

import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Server Action to create session - Legacy/Wrapper for Supabase
export async function createSession(idToken: string) {
  // Supabase handles session creation on login (signInWithPassword etc)
  // This function might be redundant if the client follows Supabase auth flow
  // For migration compatibility, we might just redirect.

  // NOTE: If the client is sending a FIREBASE idToken, we can't use it here with Supabase easily.
  // We assume the auth flow is updated to use Supabase login directly.

  console.log('createSession called (Legacy wrapper)');
  redirect('/');
}

// Server Action to get current session
export async function getSession() {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Map Supabase user to a shape compatible with what the app expects, if needed
    // Or just return the user object (it has email, id, etc)
    return {
      uid: user.id,
      email: user.email,
      email_verified: user.confirmed_at != null,
      // Add other props if your app relies on custom claims
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Server Action to logout (revoke session)
export async function logout() {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/login');
  } catch (error) {
    console.error('Error during logout:', error);
    redirect('/login');
  }
}

// Server Action to check if user is admin
export async function isAdmin() {
  const session = await getSession();
  return session?.email === 'bruno@oceanoazul.dev.br';
}

// Server Action to get user info from cookie
export async function getUserInfo() {
  return getSession();
}

// Server Action to refresh session
export async function refreshSession() {
  // Supabase middleware handles refresh automatically
  return getSession();
}
