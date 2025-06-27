const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.listUsers = async (req, res) => {
    try {
        const { data, error } = await supabase.from('usuarios').select('*'); 
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};

exports.saveUserHistory = async (req, res) => {
    const { id_test, correctAnswers, totalQuestions, score } = req.body; 
    const user_id = req.user?.id; 

    if (!user_id || !id_test || correctAnswers == null || totalQuestions == null || score == null) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const { data, error } = await supabase
            .from('user_history')
            .insert([
                {
                    user_id: user_id,
                    id_test: id_test,
                    correct_answers: correctAnswers,
                    total_questions: totalQuestions,
                    score,
                },
            ])
            .select();

        if (error) {
            console.error('[SaveUserHistory] Erro ao salvar histórico:', error);
            return res.status(500).json({
                error: 'Erro ao salvar histórico do usuário.',
                details: error.message || 'Erro não especificado.',
            });
        }

        res.status(201).json({ message: 'Histórico salvo com sucesso!', data });
    } catch (err) {
        console.error('[SaveUserHistory] Erro interno:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor.', details: err.message });
    }
};

exports.getUserPerformance = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        console.log('[GetUserPerformance] Buscando desempenho para userId:', userId);

        const { data: respostas, error: respostasError } = await supabase
            .from('respostas')
            .select('correta')
            .eq('user_id', userId);

        if (respostasError) {
            console.error('[GetUserPerformance] Erro ao buscar respostas:', respostasError);
            return res.status(500).json({ error: 'Erro ao buscar respostas.', details: respostasError });
        }

        const totalQuestions = respostas?.length || 0;
        const totalCorrectAnswers = respostas?.filter((r) => r.correta)?.length || 0;
        const totalErrors = totalQuestions - totalCorrectAnswers;

        const rendimento = totalQuestions ? ((totalCorrectAnswers / totalQuestions) * 100).toFixed(2) : '0';

        const { data: testHistory, error: historyError } = await supabase
            .from('test_history')
            .select('score')
            .eq('user_id', userId)
            .order('score', { ascending: false })
            .limit(1);

        if (historyError) {
            console.error('[GetUserPerformance] Erro ao buscar histórico:', historyError);
            return res.status(500).json({ error: 'Erro ao buscar maior pontuação.', details: historyError });
        }

        const highestScore = testHistory?.[0]?.score || 0;

        res.status(200).json({
            userId,
            rendimento,
            totalResolutions: totalQuestions,
            totalCorrectAnswers,
            totalErrors,
            highestScore,
        });
    } catch (err) {
        console.error('[GetUserPerformance] Erro interno:', err.message);
        res.status(500).json({ error: 'Erro interno.', details: err.message });
    }
};



exports.editUser = async (req, res) => {
    const { id } = req.params; 
    const { nome, imagem_perfil, biografia, uf, cidade } = req.body;

    try {
        const { data: usuarioExistente, error: usuarioErro } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', id)
            .single();

        if (usuarioErro || !usuarioExistente) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const estadosValidos = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
        if (uf && !estadosValidos.includes(uf)) {
            return res.status(400).json({ error: 'UF inválida. Deve ser uma das siglas de estados brasileiros.' });
        }

        const { error: updateError } = await supabase
            .from('usuarios')
            .update({ nome, imagem_perfil, biografia, uf, cidade, atualizado_em: new Date() })
            .eq('id', id);

        if (updateError) {
            console.error('Erro ao atualizar usuário:', updateError);
            return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
        }

        res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro interno ao editar usuário:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor.', detalhes: err.message });
    }
};

// exports.getFinalizedAttempts = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const { data: finalizedAttempts, error } = await supabase
//             .from('test_tentativas')
//             .select('id, test_id, user_id, tentativa_num, status, score, accuracy, created_at')
//             .eq('status', 'finalizado')
//             .eq('user_id', userId)
//             .order('created_at', { ascending: false });

//         if (error) {
//             return res.status(500).json({ error: 'Erro ao buscar tentativas finalizadas.', detalhes: error.message });
//         }

//         if (!finalizedAttempts || finalizedAttempts.length === 0) {
//             return res.status(404).json({ message: 'Nenhuma tentativa finalizada encontrada para este usuário.' });
//         }

//         return res.status(200).json({ finalizedAttempts });
//     } catch (err) {
//         console.error('Erro ao buscar tentativas finalizadas:', err.message);
//         return res.status(500).json({ error: 'Erro interno ao buscar tentativas finalizadas.', detalhes: err.message });
//     }
// };
exports.getFinalizedAttempts = async (req, res) => {
    const { userId } = req.params;

    try {
        const { data: finalizedAttempts, error } = await supabase
            .from('test_tentativas')
            .select('id, test_id, user_id, tentativa_num, status, score, accuracy, created_at')
            .eq('status', 'finalizado')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(500).json({ error: 'Erro ao buscar tentativas finalizadas.', detalhes: error.message });
        }

        if (!finalizedAttempts || finalizedAttempts.length === 0) {
            return res.status(404).json({ message: 'Nenhuma tentativa finalizada encontrada para este usuário.' });
        }

        return res.status(200).json({ finalizedAttempts });
    } catch (err) {
        console.error('Erro ao buscar tentativas finalizadas:', err.message);
        return res.status(500).json({ error: 'Erro interno ao buscar tentativas finalizadas.', detalhes: err.message });
    }
};



exports.getUserTestHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const { data: userHistory, error } = await supabase
            .from('user_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar histórico de testes do usuário:', error);
            return res.status(500).json({ error: 'Erro ao buscar histórico de testes do usuário.', detalhes: error.message });
        }

        if (!userHistory || userHistory.length === 0) {
            return res.status(404).json({ message: 'Nenhum histórico de testes encontrado para este usuário.' });
        }

        for (let history of userHistory) {
            const { data: testeDetalhes } = await supabase
                .from('testes')
                .select('*')
                .eq('id', history.test_id)
                .single();

            if (testeDetalhes) {
                history.nomeTeste = testeDetalhes.nome;
                history.descricaoTeste = testeDetalhes.descricao;
            } else {
                history.nomeTeste = 'Teste não encontrado';
                history.descricaoTeste = 'Descrição não disponível';
            }

            history.mediaAcertos = (history.respostas_corretas / history.total_questoes) * 100;

            if (!history.mediaAcertos) {
                history.mediaAcertos = 0;
            }
        }

        return res.status(200).json({ userHistory });

    } catch (err) {
        console.error('Erro interno ao buscar histórico de testes do usuário:', err.message);
        return res.status(500).json({ error: 'Erro interno ao buscar histórico de testes do usuário.', detalhes: err.message });
    }
};

