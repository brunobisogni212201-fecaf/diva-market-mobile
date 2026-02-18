export const userDeletionRequestTemplate = (
    protocol: string,
    fullName: string
) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação de Solicitação</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5;">
        <div style="background-color: #be185d; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Diva Market</h1>
        </div>
        
        <div style="padding: 30px;">
            <h2 style="color: #1f2937; margin-top: 0;">Solicitação Recebida</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">Olá, <strong>${fullName}</strong>.</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">Confirmamos o recebimento da sua solicitação de exclusão de dados pessoais e encerramento de conta.</p>
            
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 15px; margin: 20px 0; text-align: center;">
                <p style="color: #166534; font-size: 12px; margin: 0 0 5px 0; text-transform: uppercase; font-weight: bold;">Seu Protocolo</p>
                <p style="color: #166534; font-size: 24px; font-family: monospace; margin: 0;">${protocol}</p>
            </div>

            <p style="color: #374151; font-size: 14px; line-height: 1.5;">
                Conforme o Art. 18 da Lei Geral de Proteção de Dados (LGPD), nossa equipe analisará o pedido e procederá com a exclusão ou anonimização dos seus dados em até <strong>15 dias</strong>.
            </p>
            <p style="color: #374151; font-size: 14px; line-height: 1.5; background-color: #fffbeb; padding: 10px; border-radius: 4px; border: 1px solid #fde68a;">
                <strong>Atenção:</strong> Lembramos que dados fiscais e registros de transações serão mantidos pelo prazo legal de 5 anos para cumprimento de obrigações regulatórias.
            </p>

            <p style="color: #374151; font-size: 14px; margin-top: 20px;">
                Caso seja necessária alguma confirmação adicional de identidade, entraremos em contato por este e-mail.
            </p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="color: #6b7280; font-size: 12px; margin: 5px 0;"><strong>BRUNO DE A BISOGNI LTDA</strong></p>
            <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">CNPJ 62.402.533/0001-57</p>
            <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">Campinas - SP</p>
            <p style="color: #9ca3af; font-size: 11px; margin-top: 10px;">Esta é uma mensagem automática, por favor não responda.</p>
        </div>
    </div>
</body>
</html>
`;
