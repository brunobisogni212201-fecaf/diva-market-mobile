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
            // Check for both message content and status code if available
            // 422 Unprocessable Entity often means validation error or exists
            if (createError.message?.includes('already been registered') || createError.status === 422) {
                return {
                    error: "Este e-mail/telefone já possui cadastro. Tente fazer login.",
                    field: "email"
                };
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

        // 3. Send WhatsApp Message via Meta API
        const metaToken = process.env.META_WHATSAPP_TOKEN;
        const phoneId = process.env.META_PHONE_ID;

        if (!metaToken || !phoneId) {
            console.error('Meta API Configuration missing (TOKEN or PHONE_ID).');
            return { error: 'Erro de configuração do servidor (Meta API).' };
        }

        try {
            const response = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${metaToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: sanitizedPhone,
                    type: 'template',
                    template: {
                        name: 'hello_world', // Replace with your actual template name. 'hello_world' is standard sandbox.
                        language: { code: 'pt_BR' }
                        // If template needs components (like the magic link), add them here:
                        // components: [
                        //   {
                        //     type: 'body',
                        //     parameters: [{ type: 'text', text: magicLink }]
                        //   }
                        // ]
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Meta API failed:', data);
                return { error: 'Erro ao enviar mensagem via WhatsApp.' };
            }
        } catch (apiError) {
            console.error('Error calling Meta API:', apiError);
            return { error: 'Erro ao conectar com WhatsApp.' };
        }

    } catch (err: any) {
        console.error('Unexpected error:', err);
        return { error: 'Ocorreu um erro inesperado.' };
    }

    redirect('/register/verify-whatsapp');
}

