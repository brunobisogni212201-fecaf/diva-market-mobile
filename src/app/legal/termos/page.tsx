'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { acceptTerms } from '../actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner' // Assuming sonner or similar is used, or basic alert

export default function LegalPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleAccept = async () => {
        setLoading(true)
        const result = await acceptTerms()
        setLoading(false)

        if (result.error) {
            alert(result.error)
        } else {
            alert('Termos aceitos com sucesso!')
            router.push('/dashboard')
        }
    }

    const companyInfo = (
        <div className="mb-4 p-4 bg-gray-50 rounded-md text-sm text-gray-700">
            <p><strong>Controlador:</strong> BRUNO DE A BISOGNI LTDA (OCEANO AZUL DESENVOLVIMENTO E TECNOLOGIA)</p>
            <p><strong>CNPJ:</strong> 62.402.533/0001-57</p>
            <p><strong>Endereço:</strong> R Benjamin Constant, 1287, Apt 102 Andar 10, Centro, Campinas - SP, CEP 13010-140</p>
            <p><strong>Contato:</strong> meucnpj@contabilizei.com.br</p>
        </div>
    )

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center text-[#880E4F]">Legal & Compliance</h1>

            <Tabs defaultValue="termos" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="termos">Termos de Uso</TabsTrigger>
                    <TabsTrigger value="privacidade">Política de Privacidade</TabsTrigger>
                </TabsList>

                <TabsContent value="termos">
                    <Card>
                        <CardHeader>
                            <CardTitle>Termos de Uso - Diva Market</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {companyInfo}
                            <ScrollArea className="h-[60vh] rounded-md border p-4 text-sm leading-relaxed text-gray-700">
                                <h3 className="font-bold text-lg mb-2">1. Aceitação</h3>
                                <p className="mb-4">Ao utilizar a plataforma Diva Market, você concorda com estes termos. O serviço conecta Vendedoras, Entregadoras e Usuárias (Compradoras).</p>

                                <h3 className="font-bold text-lg mb-2">2. Cadastro e Segurança</h3>
                                <p className="mb-4">
                                    O usuário é responsável pela veracidade dos dados. Senhas e chaves de acesso são pessoais e intransferíveis.
                                    A plataforma adota medidas de segurança como criptografia e controle de acesso (RLS).
                                </p>

                                <h3 className="font-bold text-lg mb-2">3. Regras para Vendedoras</h3>
                                <p className="mb-4">
                                    Devem fornecer produtos lícitos e manter as informações da loja atualizadas. Taxas de serviço da plataforma serão descontadas automaticamente no momento da transação (Split de Pagamento).
                                </p>

                                <h3 className="font-bold text-lg mb-2">4. Entregas e Geolocalização</h3>
                                <p className="mb-4">
                                    Entregadoras concordam com o compartilhamento de sua localização em tempo real APENAS durante a execução de uma entrega ativa, para fins de rastreamento pela compradora.
                                </p>

                                <h3 className="font-bold text-lg mb-2">5. Pagamentos</h3>
                                <p className="mb-4">
                                    O processamento financeiro é realizado por instituição de pagamento parceira. O Diva Market não armazena dados completos de cartão de crédito.
                                </p>

                                <h3 className="font-bold text-lg mb-2">6. Cancelamento e Reembolso</h3>
                                <p className="mb-4">
                                    Pedidos podem ser cancelados conforme regras específicas de cada loja, respeitando o Código de Defesa do Consumidor.
                                </p>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="privacidade">
                    <Card>
                        <CardHeader>
                            <CardTitle>Política de Privacidade (LGPD)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {companyInfo}
                            <ScrollArea className="h-[60vh] rounded-md border p-4 text-sm leading-relaxed text-gray-700">
                                <h3 className="font-bold text-lg mb-2">1. Coleta de Dados</h3>
                                <ul className="list-disc pl-5 mb-4 space-y-1">
                                    <li><strong>Todos:</strong> Nome, E-mail, IP, Logs de acesso.</li>
                                    <li><strong>Vendedoras:</strong> CPF/CNPJ, Endereço da Loja, Dados Bancários (para repasse).</li>
                                    <li><strong>Entregadoras:</strong> CNH, Placa/Modelo do Veículo, Geolocalização em tempo real.</li>
                                    <li><strong>Usuárias:</strong> Endereço de entrega, Histórico de pedidos.</li>
                                </ul>

                                <h3 className="font-bold text-lg mb-2">2. Finalidade do Tratamento</h3>
                                <p className="mb-4">
                                    Os dados são utilizados estritamente para: processar pedidos, permitir a entrega (geolocalização), processar pagamentos (split financeiro) e cumprir obrigações legais.
                                </p>

                                <h3 className="font-bold text-lg mb-2">3. Compartilhamento</h3>
                                <p className="mb-4">
                                    Compartilhamos dados estritamente necessários com: Gateway de Pagamento (processamento financeiro) e Entregadoras (endereço para entrega). Não vendemos dados a terceiros.
                                </p>

                                <h3 className="font-bold text-lg mb-2">4. Seus Direitos (LGPD)</h3>
                                <p className="mb-4">
                                    Você tem direito a: confirmar a existência de tratamento, acessar seus dados, corrigir dados incompletos ou desatualizados, e solicitar anonimização ou exclusão (exceto quando a manutenção for necessária por lei).
                                </p>

                                <h3 className="font-bold text-lg mb-2">5. Segurança</h3>
                                <p className="mb-4">
                                    Utilizamos criptografia em trânsito (SSL) e repouso. O acesso ao banco de dados é segregado via Row Level Security (RLS).
                                </p>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-center">
                <Button
                    size="lg"
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-6 px-12 text-lg rounded-full shadow-lg transition-transform hover:scale-105"
                    onClick={handleAccept}
                    disabled={loading}
                >
                    {loading ? 'Registrando...' : 'Li, Compreendi e ACEITO os Termos'}
                </Button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
                Ao clicar, seu IP e data/hora serão registrados para fins de auditoria legal.
            </p>
        </div>
    )
}
