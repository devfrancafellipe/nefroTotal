const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
const crypto = require('crypto');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.register = async (req, res) => {
    const { email, senha, nome, nivel_acesso = 'usuario' } = req.body;

    if (!email || !senha || !nome) {
        return res.status(400).json({ error: 'Email, senha e nome são obrigatórios.' });
    }

    try {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3h' });
        console.log(`🆕 Token Gerado para ${email}:`, token);

        const hashedPassword = await bcrypt.hash(senha, 6);

        const { data: usuarioExistente, error: selectError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email.trim());

        if (selectError) {
            console.error('Erro ao consultar usuário:', selectError);
            return res.status(500).json({ error: 'Erro ao consultar usuário.' });
        }

        console.log('Resultado da consulta ao banco de dados:', usuarioExistente);

        if (usuarioExistente && usuarioExistente.length > 0) {
            console.log('⚠️ Usuário já existe, reenviando o e-mail de confirmação.');
            await authService.sendConfirmationEmail(email, usuarioExistente[0].token_confirmacao);
            return res.status(200).json({ message: 'Usuário já existe, novo e-mail de confirmação enviado.' });
        }

        const { data, error: insertError } = await supabase
            .from('usuarios')
            .insert([{
                email: email.trim(),
                senha: hashedPassword,
                nome,
                nivel_acesso,
                token_confirmacao: token,
                email_confirmado: false,
                criado_em: new Date()
            }]);

        if (insertError) {
            console.error('Erro ao inserir usuário:', insertError);
            return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
        }

        await authService.sendConfirmationEmail(email, token);

        await authService.sendNotificationToAdmin(nome, email);

        res.status(201).json({ message: 'Usuário registrado com sucesso, e-mail de confirmação enviado.', token });

    } catch (err) {
        console.error('Erro interno do servidor durante o registro:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};










exports.confirmEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        console.log('❌ Nenhum token fornecido.');
        return res.status(400).json({ error: 'Token inválido.' });
    }

    try {
        console.log('🔑 Token recebido na URL:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token decodificado:', decoded);

        const { data, error } = await supabase
            .from('usuarios')
            .select('email, token_confirmacao, email_confirmado, criado_em')
            .eq('email', decoded.email)
            .single();

        if (error || !data) {
            console.log('❌ Usuário não encontrado:', error);
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        console.log('✅ Usuário encontrado:', data.email);
        console.log('🗝 Token salvo no banco:', data.token_confirmacao);
        console.log('🕒 Criado em:', data.criado_em);

        if (data.email_confirmado) {
            console.log('🔄 Conta já confirmada anteriormente.');
            // return res.redirect('http://127.0.0.1:5500/Nefropapers_frontend-main/index.html');
            return res.redirect('https://nefropapersapp.com/');
        }

        const timeDiff = new Date() - new Date(data.criado_em);
        const expired = timeDiff > 3 * 60 * 60 * 1000; 

        if (expired) {
            console.log('⏳ Token expirado.');
            return res.status(400).json({ error: 'O link de confirmação expirou. Solicite um novo link.' });
        }

        if (!data.token_confirmacao || data.token_confirmacao !== token) {
            console.log('❌ Token no banco diferente do enviado.');
            return res.status(400).json({ error: 'Token inválido.' });
        }

        await supabase
            .from('usuarios')
            .update({ email_confirmado: true, data_confirmacao: new Date() })
            .eq('email', decoded.email);

        console.log('✅ Conta confirmada com sucesso.');

        // return res.redirect('http://127.0.0.1:5500/Nefropapers_frontend-main/index.html');
        return res.redirect('https://nefropapersapp.com/');

        
    } catch (err) {
        console.error('❌ Erro ao verificar o token:', err);
        return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }
};


exports.resendConfirmationEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email é necessário para reenviar o link de confirmação.' });
    }

    try {
        const { data, error } = await supabase
            .from('usuarios') 
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'Email não encontrado.' });
        }

        if (data.email_confirmado) {
            return res.status(400).json({ error: 'A conta já está confirmada.' });
        }

        const newToken = jwt.sign({ email, nome: data.nome }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await supabase
            .from('usuarios') 
            .update({ token_confirmacao: newToken, data_envio: new Date() })
            .eq('email', email);

        await authService.sendConfirmationEmail(email, newToken); 

        res.status(200).json({ message: 'E-mail de confirmação reenviado com sucesso.' });
    } catch (err) {
        console.error('Erro ao reenviar e-mail de confirmação:', err);
        res.status(500).json({ error: 'Erro interno ao reenviar o e-mail.' });
    }
};

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            console.error('Erro ao buscar usuário:', error);
            return res.status(500).json({ error: 'Erro ao buscar usuário.' });
        }

        if (!data) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const match = await bcrypt.compare(senha, data.senha);

        if (!match) {
            return res.status(401).json({ message: 'Email ou senha incorreta!' });
        }

        if (!data.email_confirmado) {
            return res.status(403).json({ message: 'O e-mail precisa ser confirmado antes de acessar.' });
        }

        res.status(200).json({
            message: 'Login efetuado com sucesso!',
            userId: data.id,
            nome: data.nome,
            email: data.email,
            nivel_acesso: data.nivel_acesso
        });
    } catch (error) {
        console.error('Erro interno no login:', error);
        return res.status(500).json({ error: 'Erro interno no login.' });
    }
};


exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'E-mail é obrigatório.' });
    }

    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, email, email_confirmado')
            .eq('email', email)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        if (!data.email_confirmado) {
            return res.status(400).json({ error: 'A redefinição de senha só pode ser realizada após a confirmação do e-mail.' });
        }

        const novaSenha = crypto.randomBytes(8).toString('hex');

        const hashedPassword = await bcrypt.hash(novaSenha, 6);

        const { error: updateError } = await supabase
            .from('usuarios')
            .update({ senha: hashedPassword })
            .eq('email', email);

        if (updateError) {
            return res.status(500).json({ error: 'Erro ao atualizar a senha.' });
        }

        await authService.sendPasswordResetEmail(data.email, novaSenha);

        return res.status(200).json({ message: 'Nova senha enviada para o seu e-mail.' });
    } catch (err) {
        console.error('Erro ao redefinir a senha:', err);
        return res.status(500).json({ error: 'Erro ao redefinir a senha.' });
    }
};