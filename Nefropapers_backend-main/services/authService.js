const nodemailer = require('nodemailer');
const env = require('../env/index.js');
const { htmlMarketingForUser, htmlNotificationForAdmin } = require('../helpers/marketing-email');


exports.sendConfirmationEmail = async (email, token) => {
    const htmlEmail = await htmlMarketingForUser(email, token);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: env.GMAIL_USER,
            pass: env.GMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false  
        }
    });

    const mailOptions = {
        from: env.GMAIL_USER,
        to: email,
        subject: 'Confirmação de Cadastro',
        html: htmlEmail,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ E-mail de confirmação enviado para: ${email}`);
        console.log(`📩 Status: ${info.response}`);
        console.log(`📨 MessageID: ${info.messageId}`);
    } catch (error) {
        console.error('❌ Erro ao enviar o e-mail de confirmação:', error);
    }
};

exports.sendNotificationToAdmin = async (nome, email) => {
    const htmlEmail = htmlNotificationForAdmin(nome, email);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: env.GMAIL_USER,
            pass: env.GMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false  
        }
    });

    const mailOptions = {
        from: env.GMAIL_USER,
        to: 'nefropapers@nefropapers.com.br',
        subject: 'Novo Cadastro Recebido',
        html: htmlEmail,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Notificação de novo cadastro enviada para o administrador`);
        console.log(`📩 Status: ${info.response}`);
        console.log(`📨 MessageID: ${info.messageId}`);
    } catch (error) {
        console.error('❌ Erro ao enviar notificação ao administrador:', error);
    }
};




exports.sendPasswordResetEmail = async (email, novaSenha) => {
    const emailBody = `
        <p>Olá,</p>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>Sua nova senha temporária é: <strong>${novaSenha}</strong></p>
        <p>Recomendamos que você faça login e altere sua senha imediatamente.</p>
        <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
    `;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: env.GMAIL_USER,
            pass: env.GMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false  
        }
    });

    const mailOptions = {
        from: env.GMAIL_USER,
        to: email,
        subject: 'Redefinição de Senha',
        html: emailBody,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ E-mail de redefinição de senha enviado para: ${email}`);
        console.log(`📩 Status: ${info.response}`);
    } catch (error) {
        console.error('❌ Erro ao enviar o e-mail de redefinição de senha:', error);
    }
};

exports.sendRecoveryEmail = async (email, senha) => {
    const htmlEmail = `
        <p>Olá,</p>
        <p>Seguem abaixo seus dados de acesso:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Senha:</strong> ${senha}</p>
        <p>Atenciosamente,</p>
        <p>Equipe Nefropapers</p>
    `;

    const emailConfig = {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    };

    const transporter = nodemailer.createTransport(emailConfig);

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Recuperação de Senha',
        html: htmlEmail
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail de recuperação enviado para ${email}`);
    } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        throw error;
    }
};

