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

    // Sanitize phone for Meta: digits only.
    // Example input: +55 19 99540-9950 -> 5519995409950
    const sanitizedPhone = phone.replace(/\D/g, '');
    // Ensure 55 for Brazil if missing, logic can be smarter but keeping it simple as requested:
    // User didn't ask for smart 55 addition here, but typically inputs have it or not.
    // The previous code added +55. Let's ensure we have country code.
    // Assuming mostly BR users, if length is 10 or 11, prepend 55?
    // Let's rely on sanitizedPhone. If input was "+55..." it's "55...".

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
                // Proceed to login existing user
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

        // 3. Send via Meta WhatsApp Cloud API
        const metaUrl = `https://graph.facebook.com/v22.0/${process.env.META_PHONE_ID}/messages`;

        const response = await fetch(metaUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: sanitizedPhone,
                type: "text",
                text: {
                    body: `Olá ${name}! 🌸\n\nBem-vinda ao Diva Market. Toque no link abaixo para entrar:\n\n${magicLink}`
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Meta API Error:', JSON.stringify(errorData, null, 2));
            return { error: 'Erro ao enviar mensagem pelo WhatsApp. Verifique o número.' };
        }

    } catch (err: any) {
        console.error('Unexpected error:', err);
        return { error: 'Ocorreu um erro inesperado.' };
    }

    redirect('/register/verify-whatsapp');
}

