'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function registerUser(formData: FormData) {
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    if (!email || !password || !fullName || !role) {
        return { error: 'Todos os campos são obrigatórios.' };
    }

    const supabase = createClient();

    const origin = headers().get('origin');

    console.log("1. Iniciando tentativa de cadastro para:", email);
    console.log("📍 Redirect URL:", `${origin}/auth/callback`);

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                },
                emailRedirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) {
            console.error("❌ ERRO CRÍTICO NO SUPABASE AUTH:");
            console.error("Mensagem:", error.message);
            console.error("Status:", error.status);
            console.error("Nome do Erro:", error.name);

            if (error.code === 'user_already_exists' || error.message.includes('already registered')) {
                return {
                    error: "Este e-mail já está cadastrado. Tente fazer login.",
                    field: "email"
                };
            }
            return { error: error.message };
        }

        console.log("✅ Usuário criado no Auth com ID:", data.user?.id);

        // If signup is successful
        if (data.user) {
            // Check if email confirmation is required (session might be null if so)
            if (!data.session) {
                console.log("ℹ️ Sessão não criada (confirmação de email necessária).");
                return { success: true, message: 'Cadastro realizado! Verifique seu e-mail para confirmar.' };
            }
            console.log("✅ Sessão criada com sucesso via auto-confirm.");
            // If session exists (auto-confirm enabled), redirect to dashboard
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err);
        return { error: 'Ocorreu um erro inesperado.' };
    }

    redirect('/legal');
}
