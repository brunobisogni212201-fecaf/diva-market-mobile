'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

import { recordConsent } from '@/lib/actions/consent'
import { ROLES } from '@/lib/auth/rbac'

export type SignupState = {
  errors?: {
    email?: string[];
    password?: string[];
    fullName?: string[];
    terms?: string[];
  };
  message?: string | null;
}

// Updated signature to match direct call from page.tsx
export async function signup(formData: FormData): Promise<SignupState> {
  const supabase = createClient()

  const email = formData.get('email') as string | null
  const password = formData.get('password') as string | null
  const fullName = formData.get('fullName') as string | null
  const agreedToTerms = formData.get('agreedToTerms') === 'true'

  // Basic Validation
  const errors: SignupState['errors'] = {}

  if (!email || !email.includes('@')) {
    errors.email = ['Please enter a valid email address.']
  }
  if (!password || password.length < 6) {
    errors.password = ['Password must be at least 6 characters long.']
  }
  if (!fullName || fullName.trim().length < 2) {
    errors.fullName = ['Please enter your full name.']
  }
  if (!agreedToTerms) {
    errors.terms = ['You must agree to the terms.']
  }

  if (Object.keys(errors).length > 0) {
    return { errors, message: 'Please correct the errors below.' }
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // 1. Create User
  const { data, error } = await supabase.auth.signUp({
    email: email!,
    password: password!,
    options: {
      data: {
        full_name: fullName!,
        role: ROLES.USUARIA, // Default role
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { message: error.message }
  }

  // 2. Record Consent (if user created)
  if (data.user) {
    await recordConsent({
      userId: data.user.id,
      role: ROLES.USUARIA,
      version: 'v1.0',
      marketing: true, // Defaulting for 'usuaria' based on requirements
      dataProcessing: false,
      locationTracking: false
    });
  }

  revalidatePath('/', 'layout')
  redirect('/')
}