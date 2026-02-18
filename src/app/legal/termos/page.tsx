'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { acceptTerms } from '../actions'
import { useRouter } from 'next/navigation'


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
                            <CardTitle>Política de Privacidade e Tratamento de Dados (LGPD)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 p-4 bg-gray-50 rounded-md text-sm text-gray-700">
                                <p><strong>Controladora:</strong> BRUNO DE A BISOGNI LTDA (OCEANO AZUL DESENVOLVIMENTO E TECNOLOGIA)</p>
                                <p><strong>CNPJ:</strong> 62.402.533/0001-57</p>
                                <p><strong>Endereço:</strong> R Benjamin Constant, 1287, Apt 102 Andar 10, Centro, Campinas - SP, CEP 13010-140</p>
                                <p><strong>Contato:</strong> meucnpj@contabilizei.com.br</p>
                            </div>
                            <ScrollArea className="h-[60vh] rounded-md border p-4 text-sm leading-relaxed text-gray-700">
                                <h3 className="font-bold text-lg mb-2">1. Quais Dados Coletamos?</h3>
                                <p className="mb-4">Para viabilizar o funcionamento do marketplace e melhorar continuamente nossos serviços, coletamos as seguintes categorias de dados:</p>

                                <h4 className="font-bold text-md mb-1">1.1. Dados de Identificação (Para Todas as Usuárias)</h4>
                                <ul className="list-disc pl-5 mb-4 space-y-1">
                                    <li>Nome completo, CPF, E-mail, Número de Celular e Senha criptografada.</li>
                                    <li>Foto de Perfil (Avatar).</li>
                                </ul>

                                <h4 className="font-bold text-md mb-1">1.2. Dados de Geolocalização e Rastreamento (GPS)</h4>
                                <p className="mb-2"><strong>ATENÇÃO:</strong> Para o funcionamento essencial do aplicativo, coletamos sua localização precisa (GPS) e aproximada (Rede/Wi-Fi):</p>
                                <ul className="list-disc pl-5 mb-4 space-y-1">
                                    <li><strong>Em Primeiro Plano:</strong> Enquanto você usa o app para mostrar lojas próximas e calcular frete.</li>
                                    <li><strong>Em Segundo Plano (Background):</strong> Especificamente para <strong>Entregadoras</strong>, rastreamos o trajeto da entrega em tempo real para segurança e transparência para a Compradora.</li>
                                    <li><strong>Para Melhoria do Sistema:</strong> Utilizamos o histórico de localização para criar mapas de calor, otimizar rotas logísticas e analisar áreas de maior demanda.</li>
                                </ul>

                                <h4 className="font-bold text-md mb-1">1.3. Dados Financeiros e Transacionais</h4>
                                <ul className="list-disc pl-5 mb-4 space-y-1">
                                    <li>Histórico de pedidos e compras.</li>
                                    <li>Dados bancários ou chaves PIX (exclusivo para Vendedoras e Entregadoras receberem seus repasses).</li>
                                    <li><em>Nota: Não armazenamos números completos de cartão de crédito. Estes são processados por gateways de pagamento seguros.</em></li>
                                </ul>

                                <h4 className="font-bold text-md mb-1">1.4. Dados de Dispositivo e Navegação</h4>
                                <ul className="list-disc pl-5 mb-4 space-y-1">
                                    <li>Endereço IP, modelo do aparelho, sistema operacional e versão do app.</li>
                                    <li>Logs de acesso e consentimento (data e hora do aceite destes termos).</li>
                                </ul>

                                <h3 className="font-bold text-lg mb-2">2. Para Que Usamos Seus Dados?</h3>
                                <p className="mb-2">Tratamos seus dados com as seguintes finalidades legais:</p>
                                <ol className="list-decimal pl-5 mb-4 space-y-1">
                                    <li><strong>Execução de Contrato:</strong> Processar pedidos, calcular <em>Split</em> de pagamentos e realizar entregas.</li>
                                    <li><strong>Legítimo Interesse:</strong> Analisar o comportamento de uso para desenvolver novas funcionalidades (Analytics), prevenção à fraude e segurança da plataforma, e melhoria da UX.</li>
                                    <li><strong>Proteção da Vida e Segurança:</strong> Monitoramento em tempo real das entregas.</li>
                                    <li><strong>Cumprimento Legal:</strong> Guarda de logs de internet por 6 meses (Marco Civil da Internet) e dados fiscais por 5 anos.</li>
                                </ol>

                                <h3 className="font-bold text-lg mb-2">3. Compartilhamento de Dados</h3>
                                <p className="mb-4">Não vendemos seus dados. O compartilhamento ocorre apenas quando estritamente necessário:</p>
                                <ul className="list-disc pl-5 mb-4 space-y-1">
                                    <li><strong>Entre Usuárias:</strong> A Vendedora recebe o pedido com nome/endereço da Compradora. A Entregadora recebe o endereço de retirada e entrega.</li>
                                    <li><strong>Parceiros Tecnológicos:</strong> Provedores de nuvem (Supabase), processadores de pagamento e ferramentas de automação (n8n), todos obrigados a manter sigilo e segurança.</li>
                                    <li><strong>Autoridades:</strong> Mediante ordem judicial ou requisição legal.</li>
                                </ul>

                                <h3 className="font-bold text-lg mb-2">4. Seus Direitos (Titular dos Dados)</h3>
                                <p className="mb-4">Conforme o Art. 18 da LGPD, você pode solicitar a qualquer momento: confirmação e acesso aos seus dados, correção de dados, revogação de consentimento (o que pode impedir uso de funções essenciais como entrega), e exclusão de dados (salvo os exigidos por lei).</p>

                                <h3 className="font-bold text-lg mb-2">5. Segurança</h3>
                                <p className="mb-4">Adotamos medidas técnicas robustas, incluindo criptografia de ponta a ponta em trânsito (SSL/TLS), controle de acesso rigoroso e segregação de dados.</p>

                                <h3 className="font-bold text-lg mb-2">6. Contato do Encarregado (DPO)</h3>
                                <p>Para exercer seus direitos ou tirar dúvidas, entre em contato conosco:</p>
                                <ul className="list-none pl-0 mb-4 space-y-1">
                                    <li><strong>Controladora:</strong> BRUNO DE A BISOGNI LTDA</li>
                                    <li><strong>E-mail Jurídico:</strong> meucnpj@contabilizei.com.br</li>
                                    <li><strong>Endereço:</strong> Campinas - SP</li>
                                </ul>
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
