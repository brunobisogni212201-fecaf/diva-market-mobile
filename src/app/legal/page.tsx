'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { recordConsent } from './actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export default function LegalPage() {
    const [loading, setLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setIsAuthenticated(!!session)
        }
        checkAuth()
    }, [])

    const handleAccept = async () => {
        setLoading(true)
        try {
            const result = await recordConsent()

            if (result.success) {
                toast.success('Termos aceitos com sucesso! Bem-vinda ao Diva Market.', {
                    duration: 4000,
                    style: { background: '#10B981', color: 'white' }
                })
                // Redirect to dashboard after short delay to let toast show
                setTimeout(() => {
                    router.push('/dashboard')
                }, 1000)
            } else {
                toast.error('Erro ao registrar consentimento. Tente novamente.', {
                    description: result.error
                })
            }
        } catch (error) {
            toast.error('Ocorreu um erro inesperado.')
        } finally {
            setLoading(false)
        }
    }

    const companyInfo = (
        <div className="mb-4 p-4 bg-pink-50 rounded-md text-sm text-gray-700 border border-pink-100">
            <p className="font-semibold text-pink-700 mb-1">DADOS DA CONTROLADORA</p>
            <p><strong>Razão Social:</strong> BRUNO DE A BISOGNI LTDA (OCEANO AZUL D&T)</p>
            <p><strong>CNPJ:</strong> 62.402.533/0001-57</p>
            <p><strong>Endereço:</strong> R Benjamin Constant, 1287, Apt 102, Centro, Campinas - SP</p>
            <p><strong>Contato:</strong> meucnpj@contabilizei.com.br</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#880E4F] mb-2 tracking-tight">Legal Hub</h1>
                    <p className="text-gray-500 text-center">Transparência e Segurança para você.</p>
                </div>

                <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <Tabs defaultValue="termos" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/50 p-1 rounded-xl">
                                <TabsTrigger
                                    value="termos"
                                    className="data-[state=active]:bg-white data-[state=active]:text-[#E91E63] data-[state=active]:shadow-sm rounded-lg py-3 font-medium transition-all"
                                >
                                    Termos de Uso
                                </TabsTrigger>
                                <TabsTrigger
                                    value="privacidade"
                                    className="data-[state=active]:bg-white data-[state=active]:text-[#E91E63] data-[state=active]:shadow-sm rounded-lg py-3 font-medium transition-all"
                                >
                                    Política de Privacidade
                                </TabsTrigger>
                            </TabsList>

                            {/* --- TAB: TERMOS DE USO --- */}
                            <TabsContent value="termos" className="focus:outline-none">
                                <ScrollArea className="h-[60vh] md:h-[500px] w-full rounded-md border border-gray-100 p-4 md:p-6 bg-white shadow-inner text-sm leading-relaxed text-gray-700">
                                    <div className="prose prose-pink max-w-none">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">Termos e Condições de Uso</h2>
                                        {companyInfo}

                                        <div className="space-y-4">
                                            <div className="bg-blue-50 p-3 rounded text-blue-800 text-xs font-medium">
                                                Última atualização: 18 de Fevereiro de 2026
                                            </div>

                                            <p>Bem-vinda ao <strong>Diva Market</strong>! Estes Termos regulam o acesso e utilização da nossa plataforma.</p>

                                            <h3 className="font-bold text-gray-900">1. O Serviço</h3>
                                            <p>O Diva Market é uma plataforma tecnológica que intermedeia a relação entre Vendedoras, Compradoras e Entregadoras. Atuamos como facilitadores e não vendemos produtos próprios diretamente (salvo indicação).</p>

                                            <h3 className="font-bold text-gray-900">2. Responsabilidades</h3>
                                            <ul className="list-disc pl-5">
                                                <li><strong>Veracidade:</strong> Você garante que seus dados são verdadeiros.</li>
                                                <li><strong>Senha:</strong> É pessoal e intransferível.</li>
                                                <li><strong>Vendedoras:</strong> Responsáveis pela qualidade e origem dos produtos.</li>
                                            </ul>

                                            <h3 className="font-bold text-gray-900">3. Pagamentos (Split)</h3>
                                            <p>O processamento é feito por instituição parceira. Valores são divididos automaticamente (Split) entre Vendedora, Entregadora e Plataforma.</p>

                                            <h3 className="font-bold text-gray-900">4. Geolocalização</h3>
                                            <p>Você autoriza a coleta de GPS para: segurança, cálculo de frete e monitoramento em tempo real de entregas.</p>

                                            <h3 className="font-bold text-gray-900">5. Propriedade Intelectual</h3>
                                            <p>Todo o software e marca "Diva Market" pertencem à BRUNO DE A BISOGNI LTDA.</p>

                                            <h3 className="font-bold text-gray-900">6. Foro</h3>
                                            <p>Fica eleito o foro de Campinas/SP.</p>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </TabsContent>

                            {/* --- TAB: PRIVACIDADE --- */}
                            <TabsContent value="privacidade" className="focus:outline-none">
                                <ScrollArea className="h-[60vh] md:h-[500px] w-full rounded-md border border-gray-100 p-4 md:p-6 bg-white shadow-inner text-sm leading-relaxed text-gray-700">
                                    <div className="prose prose-pink max-w-none">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">Política de Privacidade (LGPD)</h2>
                                        {companyInfo}

                                        <div className="space-y-4">
                                            <div className="bg-green-50 p-3 rounded text-green-800 text-xs font-medium">
                                                Versão 1.0 - Em conformidade com a Lei nº 13.709/2018
                                            </div>

                                            <h3 className="font-bold text-gray-900">1. Coleta de Dados</h3>
                                            <ul className="list-disc pl-5">
                                                <li><strong>Identificação:</strong> Nome, CPF, E-mail, Celular, Senha.</li>
                                                <li><strong>Financeiro:</strong> Dados bancários (para repasse) e histórico.</li>
                                                <li><strong>Geolocalização:</strong> GPS preciso (Foreground/Background) para entregas.</li>
                                                <li><strong>Dispositivo:</strong> IP, Modelo, Logs.</li>
                                            </ul>

                                            <h3 className="font-bold text-gray-900">2. Finalidade</h3>
                                            <p>Execução de contrato, prevenção à fraude, segurança e cumprimento legal.</p>

                                            <h3 className="font-bold text-gray-900">3. Seus Direitos</h3>
                                            <p>Você pode solicitar seus dados, corrigir informações ou revogar consentimento (sujeito à impossibilidade de uso de certas funções).</p>

                                            <h3 className="font-bold text-gray-900">4. Segurança</h3>
                                            <p>Uso de criptografia SSL/TLS e Rigoroso Controle de Acesso (RLS).</p>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>

                        {isAuthenticated && (
                            <div className="mt-8 flex flex-col items-center gap-4">
                                <Button
                                    size="lg"
                                    onClick={handleAccept}
                                    disabled={loading}
                                    className="w-full md:w-auto min-w-[300px] bg-gradient-to-r from-[#D81B60] to-[#880E4F] hover:from-[#AD1457] hover:to-[#6A1B9A] text-white font-bold py-6 rounded-full shadow-lg transform transition hover:scale-[1.02] active:scale-95"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Registrando Aceite...
                                        </span>
                                    ) : (
                                        "LI, COMPREENDI E ACEITO OS TERMOS"
                                    )}
                                </Button>

                                <p className="text-xs text-gray-400 text-center max-w-sm">
                                    Ao clicar, registramos seu IP, data e hora para fins de auditoria jurídica e segurança conforme a LGPD.
                                </p>
                            </div>
                        )}

                        {!isAuthenticated && (
                            <div className="mt-8 flex flex-col items-center gap-4">
                                <p className="text-sm text-gray-500 text-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    Este documento é público. Para aceitar os termos e usar a plataforma, faça login ou cadastre-se.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
