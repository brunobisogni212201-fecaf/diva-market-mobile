'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { requestDataDeletion } from './actions'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const initialState = {
    message: '',
    error: {},
    success: false,
    protocol: ''
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={pending}
        >
            {pending ? 'Processando...' : 'Confirmar Solicitação de Exclusão'}
        </Button>
    )
}

export default function DeletionRequestPage() {
    // @ts-ignore - useFormState types can be tricky
    const [state, formAction] = useFormState(requestDataDeletion, initialState)
    const [reason, setReason] = useState('')

    if (state?.success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-lg w-full border-green-200">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                            <CheckCircle2 className="h-6 w-6" />
                            <CardTitle>Solicitação Recebida</CardTitle>
                        </div>
                        <CardDescription>
                            Sua solicitação de exclusão de dados foi registrada.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-green-800">
                            <p className="font-bold text-xs uppercase tracking-wider mb-1">Número de Protocolo</p>
                            <p className="text-xl font-mono">{state.protocol}</p>
                        </div>
                        <p className="text-sm text-gray-600">
                            Nossa equipe de Privacidade (DPO) analisará seu pedido em até 15 dias, conforme previsto na LGPD.
                            Entraremos em contato via e-mail ({state.email}) caso precisemos de mais confirmações.
                        </p>
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => window.location.href = '/'}
                        >
                            Voltar ao Início
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-[#880E4F]">Solicitação de Exclusão de Dados</CardTitle>
                        <CardDescription>
                            Direito ao Esquecimento (LGPD Art. 18 / GDPR)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <AlertTitle>Importante: Retenção Legal</AlertTitle>
                            <AlertDescription className="text-xs mt-1 leading-relaxed">
                                A <strong>BRUNO DE A BISOGNI LTDA</strong> poderá manter certos dados (como notas fiscais, registros de transações financeiras e logs de acesso) por até 5 anos para cumprimento de obrigações legais e regulatórias, mesmo após a exclusão da conta.
                            </AlertDescription>
                        </Alert>

                        <form action={formAction} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Nome Completo</Label>
                                <Input id="fullName" name="fullName" placeholder="Como consta no seu cadastro" required />
                                {state?.error?.fullName && <p className="text-red-500 text-xs">{state.error.fullName}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail Cadastrado</Label>
                                <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
                                {state?.error?.email && <p className="text-red-500 text-xs">{state.error.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reason">Motivo (Opcional)</Label>
                                <Select name="reason" onValueChange={setReason}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um motivo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="privacy">Preocupações com privacidade</SelectItem>
                                        <SelectItem value="not_using">Não utilizo mais o serviço</SelectItem>
                                        <SelectItem value="duplicate">Tenho outra conta</SelectItem>
                                        <SelectItem value="other">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                                {reason === 'other' && (
                                    <Textarea
                                        name="reason_details"
                                        placeholder="Por favor, dê mais detalhes..."
                                        className="mt-2"
                                    />
                                )}
                            </div>

                            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <Checkbox id="confirmation" name="confirmation" required />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="confirmation" className="text-sm font-medium leading-normal text-gray-700">
                                        Entendo que esta ação é irreversível.
                                    </Label>
                                    <p className="text-xs text-gray-500">
                                        Meus dados de perfil, histórico de pedidos e preferências serão apagados ou anonimizados.
                                    </p>
                                </div>
                            </div>
                            {state?.error?.confirmation && <p className="text-red-500 text-xs text-center">{state.error.confirmation}</p>}

                            {state?.message && !state?.success && (
                                <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{state.message}</p>
                            )}

                            <SubmitButton />
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
