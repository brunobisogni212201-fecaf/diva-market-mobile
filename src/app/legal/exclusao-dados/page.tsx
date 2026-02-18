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
                <Card className="max-w-lg w-full border-green-200 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-green-800 mb-2 justify-center">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-center text-green-900 text-xl">Solicitação Recebida</CardTitle>
                        <CardDescription className="text-center">
                            Seu pedido foi registrado em nosso sistema de conformidade.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-6 bg-green-50 rounded-lg border border-green-100 text-green-900 flex flex-col items-center">
                            <p className="font-bold text-xs uppercase tracking-wider mb-2 text-green-700">Protocolo de Rastreabilidade</p>
                            <p className="text-2xl font-mono tracking-widest">{state.protocol}</p>
                        </div>
                        <div className="text-sm text-gray-600 space-y-2 text-justify">
                            <p>
                                A <strong>BRUNO DE A BISOGNI LTDA</strong> (Controladora) iniciará o processo de análise.
                                Conforme o Art. 18 da LGPD, o prazo para resposta é de até <strong>15 dias</strong>.
                            </p>
                            <p>
                                Fique atento ao e-mail informado ({state.email}) para eventuais confirmações de segurança necessárias para evitar fraudes de identidade.
                            </p>
                        </div>
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
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="container mx-auto max-w-3xl">
                <Card className="shadow-xl border-neutral-200">
                    <CardHeader className="border-b border-gray-100 bg-white pb-8">
                        <div className="flex flex-col items-center mb-4">
                            <div className="h-12 w-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="h-6 w-6 text-pink-700" />
                            </div>
                            <CardTitle className="text-3xl font-serif text-gray-900 text-center">Exclusão de Dados Pessoais</CardTitle>
                            <CardDescription className="text-center mt-2 text-gray-500">
                                Formulário de Solicitação de Exercício de Direitos (LGPD/GDPR)
                            </CardDescription>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2 border border-gray-100">
                            <span><strong>Controladora:</strong> BRUNO DE A BISOGNI LTDA</span>
                            <span><strong>CNPJ:</strong> 62.402.533/0001-57</span>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-8">
                        <Alert className="mb-8 bg-amber-50 border-amber-200 text-amber-900">
                            <AlertCircle className="h-4 w-4 text-amber-700" />
                            <AlertTitle className="font-semibold text-amber-800">Aviso Legal: Retenção de Dados</AlertTitle>
                            <AlertDescription className="text-sm mt-2 leading-relaxed text-amber-900/90 text-justify">
                                Informamos que, mesmo após a solicitação de exclusão, a <strong>BRUNO DE A BISOGNI LTDA</strong> é obrigada por lei a manter determinados dados (como notas fiscais, registros de transações financeiras e logs de acesso à aplicação) pelo prazo prescricional de <strong>5 anos</strong>, para cumprimento de obrigações fiscais, cíveis e regulatórias (Marco Civil da Internet e Código Tributário Nacional). A exclusão será efetivada para dados de marketing, perfil público e preferências de navegação.
                            </AlertDescription>
                        </Alert>

                        <form action={formAction} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Nome Completo</Label>
                                    <Input id="fullName" name="fullName" placeholder="Nome Civil Completo" className="bg-white" required />
                                    {state?.error?.fullName && <p className="text-red-500 text-xs">{state.error.fullName}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cpf">CPF / CNPJ</Label>
                                    <Input id="cpf" name="cpf" placeholder="000.000.000-00" className="bg-white" required />
                                    <p className="text-[10px] text-gray-400">Necessário para validação inequívoca da titularidade.</p>
                                    {state?.error?.cpf && <p className="text-red-500 text-xs">{state.error.cpf}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail Cadastrado na Plataforma</Label>
                                <Input id="email" name="email" type="email" placeholder="seu@email.com" className="bg-white" required />
                                {state?.error?.email && <p className="text-red-500 text-xs">{state.error.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reason">Motivo da Solicitação (Opcional)</Label>
                                <Select name="reason" onValueChange={setReason}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Selecione o motivo principal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="privacy">Preocupações com privacidade</SelectItem>
                                        <SelectItem value="not_using">Não utilizo mais o serviço</SelectItem>
                                        <SelectItem value="revocation">Revogação de consentimento</SelectItem>
                                        <SelectItem value="other">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                                {reason === 'other' && (
                                    <Textarea
                                        name="reason_details"
                                        placeholder="Descreva brevemente..."
                                        className="mt-2 bg-white"
                                    />
                                )}
                            </div>

                            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-start space-x-3">
                                    <Checkbox id="confirmation" name="confirmation" required className="mt-1" />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="confirmation" className="text-sm font-semibold text-gray-900">
                                            Declaração de Ciência e Solicitação
                                        </Label>
                                        <p className="text-xs text-gray-600 leading-relaxed text-justify">
                                            Declaro que sou o titular dos dados acima informados e solicito formalmente a exclusão da minha conta e das minhas informações pessoais da base de dados da Diva Market, ciente de que esta ação é <strong>irreversível</strong> e que perderei acesso ao histórico de compras, vendas e carteira digital. Entendo as limitações legais de retenção descritas no aviso acima.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {state?.error?.confirmation && <p className="text-red-500 text-xs text-center">{state.error.confirmation}</p>}

                            {state?.message && !state?.success && (
                                <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded border border-red-100">{state.message}</p>
                            )}

                            <SubmitButton />

                            <p className="text-[10px] text-center text-gray-400 mt-4">
                                DPO / Encarregado de Dados: meucnpj@contabilizei.com.br
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
