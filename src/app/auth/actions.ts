'use server';

import { adminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';

export async function registerUser(formData: FormData) {
    const name = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const role = formData.get('role') as string || 'usuaria';

    if (!phone || !name) {
        return { error: 'Nome e telefone são obrigatórios.' };
    }

    // Sanitize phone: digits only.
    const sanitizedPhone = phone.replace(/\D/g, '');
    // Construct email to satisfy Supabase's email-based magic link requirements
    const email = `${sanitizedPhone}@whatsapp.divamarket.com`;

    try {
        // 1. Create or Update User
        const { data: user, error: createError } = await adminClient.auth.admin.createUser({
            email: email,
            email_confirm: true,
            phone: `+${sanitizedPhone}`, // Supabase expects E.164 for phone field usually
            phone_confirm: true,
            user_metadata: { full_name: name, role, phone: sanitizedPhone },
        });

        let userId = user?.user?.id;

        if (createError) {
            if (createError.message.includes('already registered')) {
                // Proceed to generate link for existing user
            } else {
                console.error('Error creating user:', createError);
                return { error: 'Erro ao criar cadastro: ' + createError.message };
            }
        }

        // 2. Generate Magic Link
        const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
            type: 'magiclink',
            email: email,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/`,
            }
        });

        if (linkError || !linkData.properties?.action_link) {
            console.error('Error generating link:', linkError);
            return { error: 'Erro ao gerar link de acesso.' };
        }

        const magicLink = linkData.properties.action_link;

        // 3. Trigger n8n Webhook
        // Payload: { email, phone, fullName, role, magicLink }
        const webhookUrl = process.env.N8N_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error('N8N_WEBHOOK_URL is not defined');
            return { error: 'Erro de configuração do servidor.' };
        }

        try {
            // We await to ensure we don't redirect before sending, 
            // but we might not want to block too long if n8n is slow.
            // Vercel limits execution time.
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    phone: sanitizedPhone, // sending raw digits or sanitized
                    fullName: name,
                    role,
                    magicLink
                })
            });

            if (!response.ok) {
                console.error('n8n Webhook failed:', response.statusText);
                // We might still want to redirect even if webhook fails? 
                // Or warn user? "Link generated but sending failed".
                // Detailed error for now.
                return { error: 'Erro ao enviar dados para automação.' };
            }
        } catch (webhookError) {
            console.error('Error calling n8n webhook:', webhookError);
            return { error: 'Erro ao conectar com automação.' };
        }

    } catch (err: any) {
        console.error('Unexpected error:', err);
        return { error: 'Ocorreu um erro inesperado.' };
    }

    redirect('/register/verify-whatsapp');
}

