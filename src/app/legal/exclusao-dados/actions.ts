'use server'

import { db } from '@/lib/db'
import { deletionRequests } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import { sendEmail } from '@/lib/mail'
import { adminDeletionRequestTemplate } from '@/lib/emails/deletion-request-admin'
import { userDeletionRequestTemplate } from '@/lib/emails/deletion-request-user'

const deletionSchema = z.object({
    fullName: z.string().min(2, 'Nome muito curto'),
    email: z.string().email('E-mail inválido'),
    reason: z.string().optional(),
    confirmation: z.literal('on', {
        errorMap: () => ({ message: 'Você deve confirmar que entende as consequências.' })
    })
})

export async function requestDataDeletion(prevState: any, formData: FormData) {
    const validatedFields = deletionSchema.safeParse({
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        reason: formData.get('reason'),
        confirmation: formData.get('confirmation'),
    })

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: 'Por favor, corrija os erros abaixo.'
        }
    }

    const { email, reason } = validatedFields.data

    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const headerStore = headers()
        const forwardedFor = headerStore.get('x-forwarded-for')
        const ip = typeof forwardedFor === 'string' ? forwardedFor.split(',')[0] : 'unknown'

        await db.insert(deletionRequests).values({
            userId: user?.id, // Optional, logs if they are currently signed in
            email,
            reason: reason || 'Not specified',
            ipAddress: ip,
            status: 'pending_review'
        })

        // TODO: Send notification to admins (Discord/Email)
        const protocol = crypto.randomUUID()

        // 1. Notify Admin
        await sendEmail({
            to: 'meucnpj@contabilizei.com.br',
            subject: `[LGPD] Nova Solicitação de Exclusão - Protocolo ${protocol}`,
            html: adminDeletionRequestTemplate(protocol, validatedFields.data.fullName, email, cpf || null, reason || 'Not specified', new Date().toLocaleString('pt-BR'))
        })

        // 2. Notify User
        await sendEmail({
            to: email,
            subject: 'Confirmação de Solicitação de Exclusão de Dados',
            html: userDeletionRequestTemplate(protocol, validatedFields.data.fullName)
        })

        return {
            success: true,
            protocol,
            message: 'Solicitação recebida com sucesso. Verifique seu e-mail.'
        }

    } catch (error) {
        console.error('Error logging deletion request:', error)
        return {
            message: 'Erro ao processar solicitação. Tente novamente mais tarde.'
        }
    }
}
