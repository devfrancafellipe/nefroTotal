const supabase = require("../supabase");
exports.htmlMarketingForUser = async (email, token) => {
    // const confirmationLink = `http://localhost:3000/auth/confirm-email?token=${encodeURIComponent(token)}`;

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de Cadastro</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
                <td style="padding: 20px; text-align: center; background-color: #007bff;">
                    <h1 style="color: #ffffff; margin: 0;">Confirmação de Cadastro</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px;">
                    <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0;">
                        Olá, <strong>${email}</strong>!
                    </p>
                    <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0;">
                        Seu cadastro foi recebido com sucesso! 
                    </p>
                    <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0;">
                        Seu acesso será confirmado após a verificação do pagamento pelo administrador.
                    </p>
                    <p style="font-size: 14px; color: #777777; margin: 20px 0 0 0;">
                        Se você tiver alguma dúvida, entre em contato com nosso suporte.
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

exports.htmlNotificationForAdmin = (nome, email) => {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notificação de Novo Cadastro</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
                <td style="padding: 20px; text-align: center; background-color: #28a745;">
                    <h1 style="color: #ffffff; margin: 0;">Novo Cadastro Recebido!</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px;">
                    <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0;">
                        Olá, Admin!
                    </p>
                    <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0;">
                        Um novo usuário se registrou no site com as seguintes informações:
                    </p>
                    <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0;">
                        <strong>Nome:</strong> ${nome} <br />
                        <strong>E-mail:</strong> ${email}
                    </p>
                    <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0;">
                        O cadastro aguarda a verificação de pagamento para ser confirmado.
                    </p>
                    <p style="font-size: 14px; color: #777777; margin: 20px 0 0 0;">
                        Após a verificação, o acesso será liberado.
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

