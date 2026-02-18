'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function registerUser(formData: FormData) {
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    if (!email || !password || !fullName || !role) {
        return { error: 'Todos os campos são obrigatórios.' };
    }

    const supabase = createClient();

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                },
            },
        });

        if (error) {
            console.error('Signup error:', error);
            if (error.code === 'user_already_exists' || error.message.includes('already registered')) {
                return {
                    error: "Este e-mail já está cadastrado. Tente fazer login.",
                    field: "email"
                };
            }
            return { error: error.message };
        }

        // If signup is successful
        if (data.user) {
            // Check if email confirmation is required (session might be null if so)
            if (!data.session) {
                return { success: true, message: 'Cadastro realizado! Verifique seu e-mail para confirmar.' };
            }
            // If session exists (auto-confirm enabled), redirect to dashboard
        }

    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: 'Ocorreu um erro inesperado.' };
    }

    redirect('/dashboard');
}
