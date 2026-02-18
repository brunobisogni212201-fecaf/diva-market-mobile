export const adminDeletionRequestTemplate = (
    protocol: string,
    fullName: string,
    email: string,
    cpf: string | null,
    reason: string,
    requestedAt: string
) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Solicitação de Exclusão (LGPD)</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5;">
        <div style="background-color: #be185d; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Solicitação de Exclusão (LGPD)</h1>
        </div>
        
        <div style="padding: 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">Olá DPO,</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">Uma nova solicitação formal de exclusão de dados (Art. 18) foi registrada na plataforma.</p>
            
            <div style="background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 6px; padding: 20px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Protocolo:</strong> <span style="font-family: monospace; background-color: #fff; padding: 2px 4px; border-radius: 4px;">${protocol}</span></p>
                <p style="margin: 5px 0;"><strong>Data:</strong> ${requestedAt}</p>
                <hr style="border: 0; border-top: 1px solid #fbcfe8; margin: 15px 0;">
                <p style="margin: 5px 0;"><strong>Nome:</strong> ${fullName}</p>
                <p style="margin: 5px 0;"><strong>CPF/CNPJ:</strong> ${cpf || 'Não informado'}</p>
                <p style="margin: 5px 0;"><strong>E-mail:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>Motivo:</strong> ${reason}</p>
            </div>

            <p style="color: #374151; font-size: 14px; margin-top: 20px;">
                <strong>Ação Necessária:</strong> Verificar a identidade do titular e processar a anonimização/exclusão dos dados não obrigatórios dentro de 15 dias.
            </p>

            <div style="text-align: center; margin-top: 30px;">
                <a href="#" style="background-color: #be185d; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Acessar Painel Admin</a>
            </div>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="color: #6b7280; font-size: 12px; margin: 5px 0;"><strong>BRUNO DE A BISOGNI LTDA</strong></p>
            <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">CNPJ 62.402.533/0001-57</p>
            <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">Campinas - SP</p>
        </div>
    </div>
</body>
</html>
`;
