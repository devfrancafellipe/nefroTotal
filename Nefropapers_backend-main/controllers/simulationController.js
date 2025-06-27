const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const ProgressoModel = require('../models/ProgressoModel');


exports.listTests = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ 
            error: 'ID do usuário é obrigatório',
            code: 'MISSING_USER_ID'
        });
    }

    try {
        const responseData = {
            userId,
            ultimoTeste: null,
            meusTestes: [],
            testesDisponiveis: [],
            todosOsTestes: []
        };

        const enriquecerTeste = async (teste) => {
            const { data: questoes } = await supabase
                .from('test_questoes')
                .select('id_questao')
                .eq('id_test', teste.id);

            const questaoIds = questoes?.map(q => q.id_questao) || [];
            
            const { data: questaotopicos } = await supabase
                .from('questao_topicos')
                .select('topico_id')
                .in('questao_id', questaoIds);

            const topicosUnicos = [...new Set(questaotopicos?.map(qt => qt.topico_id) || [])];
            const { data: topicos } = await supabase
                .from('topicos')
                .select('nome')
                .in('id', topicosUnicos);

            const { data: historico } = await supabase
                .from('test_history')
                .select('score, correct_answers, total_questions')
                .eq('test_id', teste.id);

            const totalTentativas = historico?.length || 0;
            const totalCorretas = historico?.reduce((sum, record) => sum + (record.correct_answers || 0), 0) || 0;
            const totalQuestoes = historico?.reduce((sum, record) => sum + (record.total_questions || 0), 0) || 0;
            const acertoGeral = totalQuestoes > 0 ? ((totalCorretas / totalQuestoes) * 100).toFixed(2) : '0%';

            return {
                ...teste,
                userId, 
                questaoIds,
                topicos: topicos?.map(t => t.nome) || [],
                acertoGeral,
                totalQuestions: questaoIds.length 
            };
        };

        const { data: ultimoTesteResolvido } = await supabase
            .from('test_history')
            .select('test_id, attempt_id, pontuacao_med')
            .eq('user_id', userId)
            .eq('status', 'finalizado')
            .order('resolved_at', { ascending: false })
            .limit(1);

        if (ultimoTesteResolvido?.[0]) {
            const { data: testeDetalhes } = await supabase
                .from('testes')
                .select('*')
                .eq('id', ultimoTesteResolvido[0].test_id)
                .single();

            if (testeDetalhes) {
                responseData.ultimoTeste = await enriquecerTeste({
                    ...testeDetalhes,
                    attemptId: ultimoTesteResolvido[0].attempt_id,
                    acertoGeral: ultimoTesteResolvido[0].pontuacao_med || '0%'
                });
            }
        }

        const { data: meusTestes } = await supabase
            .from('testes')
            .select('*')
            .eq('criado_por', userId)
            .order('criado_em', { ascending: false });

        responseData.meusTestes = await Promise.all(
            meusTestes?.map(enriquecerTeste) || []
        );

        const { data: userData } = await supabase
            .from('usuarios')
            .select('nivel_acesso')
            .eq('id', userId)
            .single();

        const isAdmin = userData?.nivel_acesso === 'admin';

        const { data: admins } = await supabase
            .from('usuarios')
            .select('id')
            .eq('nivel_acesso', 'admin');
        
        const adminIds = admins?.map(a => a.id) || [];

        if (isAdmin) {
            const { data: testesAdmin } = await supabase
                .from('testes')
                .select('*')
                .in('criado_por', adminIds)
                .order('criado_em', { ascending: false });

            responseData.testesDisponiveis = await Promise.all(
                testesAdmin?.map(enriquecerTeste) || []
            );

            const { data: todosTestes } = await supabase
                .from('testes')
                .select('*')
                .order('criado_em', { ascending: false });

            responseData.todosOsTestes = await Promise.all(
                todosTestes?.map(enriquecerTeste) || []
            );
        } else {
            const { data: testesAdmin } = await supabase
                .from('testes')
                .select('*')
                .in('criado_por', adminIds)
                .order('criado_em', { ascending: false });

            responseData.testesDisponiveis = await Promise.all(
                testesAdmin?.map(enriquecerTeste) || []
            );
        }

        res.status(200).json(responseData);

    } catch (err) {
        console.error('Erro em listTests:', err);
        res.status(500).json({ 
            error: 'Erro interno no servidor',
            userId, 
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};


const crypto = require('crypto');

exports.createTest = async (req, res) => {
    const { titulo, descricao, criado_por, imagem_teste } = req.body;

    if (!titulo || !descricao || !criado_por) {
        return res.status(400).json({ 
            error: 'Campos obrigatórios faltando: título, descrição e criado_por.' 
        });
    }

    try {
        const { data, error } = await supabase
            .from('testes')
            .insert([{ 
                titulo, 
                descricao, 
                criado_por, 
                imagem_teste: imagem_teste || null,
                hash: null 
            }])
            .select();

        if (error) throw error;

        const testId = data[0]?.id;

        if (!testId) {
            return res.status(500).json({ error: 'ID do teste não recebido' });
        }

        res.status(201).json({
            success: true,
            test: data[0],
            testId,
            message: 'Teste criado com sucesso. Adicione questões para gerar o hash.'
        });

    } catch (err) {
        console.error('Erro ao criar teste:', err);
        res.status(500).json({ 
            error: 'Erro ao criar teste.', 
            details: err.message 
        });
    }
};

exports.generateRandomQuestionsForTest = async (req, res) => {
    const { idtopico, quantidade } = req.body;

    if (!idtopico || !quantidade || quantidade < 1) {
        return res.status(400).json({ 
            error: 'Parâmetros inválidos: idtopico (UUID) e quantidade (número > 0) são obrigatórios.' 
        });
    }

    try {
        const { data: questions, error: questionsError } = await supabase
            .from('questao_topicos')
            .select('questao_id')
            .eq('topico_id', idtopico);

        if (questionsError) throw questionsError;

        const questionIds = [...new Set(questions.map(q => q.questao_id))];
        
        if (questionIds.length === 0) {
            return res.status(404).json({ 
                error: 'Nenhuma questão encontrada para o tópico especificado.' 
            });
        }

        const shuffled = [...questionIds].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(quantidade, questionIds.length));

        const partialHash = crypto
            .createHash('sha256')
            .update(JSON.stringify({
                idtopico,
                questionIds: selected.sort()
            }))
            .digest('hex');

        res.status(200).json({
            success: true,
            questions: selected,
            partialHash,
            message: `${selected.length} questões geradas com sucesso.`
        });

    } catch (err) {
        console.error('Erro ao gerar questões:', err);
        res.status(500).json({ 
            error: 'Erro ao gerar questões.', 
            details: err.message 
        });
    }
};

exports.addQuestionsToTest = async (req, res) => {
    const { testId } = req.params;
    const { questions, topicos } = req.body;

    if (!questions || !topicos) {
        return res.status(400).json({ 
            error: 'Campos obrigatórios faltando.' 
        });
    }

    try {
        const { data: test, error: testError } = await supabase
            .from('testes')
            .select('hash')
            .eq('id', testId)
            .single();

        if (testError || !test) throw new Error('Teste não encontrado');

        const fullHash = crypto.createHash('sha256')
            .update(JSON.stringify({
                topicos: topicos.sort((a,b) => a.idtopico.localeCompare(b.idtopico))
            }))
            .digest('hex');

        const { error: insertError } = await supabase
            .from('test_questoes')
            .insert(questions.map((qId, index) => ({
                id_test: testId,
                id_questao: qId,
                ordem: index + 1
            })));

        if (insertError) throw insertError;

        const { error: updateError } = await supabase
            .from('testes')
            .update({ hash: fullHash })
            .eq('id', testId);

        if (updateError) throw updateError;

        return res.status(200).json({
            success: true,
            hash: fullHash
        });

    } catch (err) {
        console.error('Erro detalhado:', err);
        return res.status(500).json({
            error: 'Falha ao adicionar questões',
            details: err.message
        });
    }
};

exports.searchModules = async (req, res) => {
    const { search } = req.query;

    if (!search) {
        return res.status(400).json({ error: 'O parâmetro de busca é obrigatório.' });
    }

    try {
        const { data, error } = await supabase
            .from('topicos')
            .select('id, name')
            .ilike('name', `%${search}%`)
            .limit(10);

        if (error) {
            console.error('Erro ao buscar módulos:', error);
            return res.status(500).json({ error: 'Erro ao buscar módulos.', details: error });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Erro interno ao buscar módulos:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor.', details: err.message });
    }
};



exports.getTestDetails = async (req, res) => {
    const { testId } = req.params;
    const { userId } = req.query;

    if (!testId) {
        return res.status(400).json({ error: 'O ID do teste é obrigatório.' });
    }

    try {
        console.log("🔍 UserID recebido:", userId);

        const { data: teste, error: testeError } = await supabase
            .from('testes')
            .select('id, titulo, descricao, criado_por, rating')
            .eq('id', testId)
            .single();

        if (testeError || !teste) {
            return res.status(404).json({ error: 'Teste não encontrado.' });
        }

        const { data: allTestHistory } = await supabase
            .from('test_history')
            .select('score, correct_answers, total_questions')
            .eq('test_id', testId);

        const rating = allTestHistory.length > 0
            ? (allTestHistory.reduce((sum, record) => sum + parseFloat(record.score), 0) / allTestHistory.length).toFixed(2)
            : 'Sem avaliação';

        const totalTentativas = allTestHistory.length;
        const totalCorretas = allTestHistory.reduce((sum, record) => sum + (record.correct_answers || 0), 0);
        const totalQuestoes = allTestHistory.reduce((sum, record) => sum + (record.total_questions || 0), 0);
        const acertoGeral = totalQuestoes > 0 ? ((totalCorretas / totalQuestoes) * 100).toFixed(2) : '0%';

        let ultimaTentativa = null;
        let minhaMaiorPontuacao = 0;

        if (userId) {
            const { data: lastUserHistory, error: lastUserHistoryError } = await supabase
                .from('user_history')
                .select('score, respostas_corretas, total_questoes, tempo_total, updated_at')
                .eq('test_id', testId)
                .eq('user_id', userId)
                .order('updated_at', { ascending: false })
                .limit(1)
                .single();

            console.log("🔍 Dados retornados de user_history:", lastUserHistory);
            if (lastUserHistoryError) console.error("🚨 Erro ao buscar última tentativa:", lastUserHistoryError);

            ultimaTentativa = lastUserHistory || null;
        }

        const { data: bestUserHistory, error: bestUserHistoryError } = await supabase
            .from('user_history')
            .select('maior_pontuacao')
            .eq('test_id', testId)
            .eq('user_id', userId)
            .order('maior_pontuacao', { ascending: false })
            .limit(1)
            .single();

        console.log("🔍 Resultado de maior_pontuacao:", bestUserHistory);
        if (bestUserHistoryError) {
            console.error("🚨 Erro na busca de maior_pontuacao:", bestUserHistoryError);
        }

        minhaMaiorPontuacao = bestUserHistory?.maior_pontuacao || 0;

        const { data: criador } = await supabase
            .from('usuarios')
            .select('nome')
            .eq('id', teste.criado_por)
            .single();

        const nomeCriador = criador?.nome || 'Desconhecido';

        const { data: questoes } = await supabase
            .from('test_questoes')
            .select('id_questao')
            .eq('id_test', testId);

        const questaoIds = questoes?.map(q => q.id_questao) || [];
        let questoesComTopicos = [];

        if (questaoIds.length > 0) {
            const { data: questaotopicos } = await supabase
                .from('questao_topicos')
                .select('topico_id, questao_id')
                .in('questao_id', questaoIds);

            const questaoTopicoMap = new Map();
            questaotopicos.forEach(qt => {
                if (!questaoTopicoMap.has(qt.questao_id)) {
                    questaoTopicoMap.set(qt.questao_id, []);
                }
                questaoTopicoMap.get(qt.questao_id).push(qt.topico_id);
            });

            for (let questao of questoes) {
                const topicoIds = questaoTopicoMap.get(questao.id_questao) || [];
                const { data: topicos } = await supabase
                    .from('topicos')
                    .select('nome')
                    .in('id', topicoIds);

                const topicosNome = topicos.map(topico => topico.nome);
                questoesComTopicos.push({
                    questao_id: questao.id_questao,
                    topicos: topicosNome
                });
            }
        }

        res.status(200).json({
            titulo: teste.titulo,
            descricao: teste.descricao || 'Sem descrição disponível.',
            rating,
            acertoGeral,
            totalResolucoes: totalTentativas,
            ultimaTentativa,
            minhaMaiorPontuacao,
            criador: nomeCriador,
            totalQuestoes: questoes?.length || 0,
            questoesComTopicos,
        });
    } catch (err) {
        console.error('Erro ao buscar detalhes do teste:', err.message);
        res.status(500).json({
            error: 'Erro interno do servidor.',
            detalhes: err.message,
        });
    }
};


exports.startTestAttempt = async (req, res) => {
    const { testId, userId } = req.params;

    if (!testId || !userId) {
        return res.status(400).json({ error: 'Os parâmetros testId e userId são obrigatórios.' });
    }

    try {
        const { data: teste, error: testeError } = await supabase
            .from('testes')
            .select('id, titulo, descricao')
            .eq('id', testId)
            .single();

        if (testeError || !teste) {
            return res.status(404).json({ error: 'Teste não encontrado.' });
        }

        const { data: questoes, error: questoesError } = await supabase
            .from('test_questoes')
            .select('id_questao')
            .eq('id_test', testId);

        if (questoesError) {
            console.error('Erro ao buscar questões:', questoesError);
            return res.status(500).json({ error: 'Erro ao buscar questões.' });
        }

        const questoesIds = questoes.map(q => q.id_questao);
        const totalQuestoes = questoesIds.length;

        const { data: activeAttempt, error: activeAttemptError } = await supabase
            .from('test_tentativas')
            .select('id, tentativa_num, status, ultima_questao, tempo_total, score, accuracy')
            .eq('test_id', testId)
            .eq('user_id', userId)
            .eq('status', 'em andamento')
            .single();

        if (activeAttemptError && activeAttemptError.code !== 'PGRST116') {
            console.error('Erro ao buscar tentativa:', activeAttemptError);
            return res.status(500).json({ error: 'Erro ao buscar tentativa.' });
        }

        if (activeAttempt) {
            console.log(`✔ Tentativa encontrada: ${activeAttempt.id}`);

            const { data: respostas, error: respostasError } = await supabase
                .from('respostas')
                .select('questao_id, resposta, correta')
                .eq('tentativa_id', activeAttempt.id);

            if (respostasError) {
                console.error('Erro ao buscar respostas:', respostasError);
                return res.status(500).json({ error: 'Erro ao buscar respostas.' });
            }

            const respostasMap = {};
            respostas.forEach(r => {
                respostasMap[r.questao_id] = {
                    resposta: r.resposta,
                    correta: r.correta
                };
            });

            const totalCorretas = respostas.filter(r => r.correta).length;
            const score = totalQuestoes > 0 ? ((totalCorretas / totalQuestoes) * 100).toFixed(2) : 0;
            const accuracy = respostas.length > 0 ? (totalCorretas / respostas.length) : 0;

            await supabase
                .from('test_tentativas')
                .update({ score, accuracy })
                .eq('id', activeAttempt.id);

            return res.status(200).json({
                message: 'Tentativa em andamento encontrada.',
                userId: userId,
                testId: testId,
                attemptId: activeAttempt.id,
                attempt: activeAttempt,
                test: teste,
                totalQuestoes,
                questoesIds,
                progress: {
                    ultima_questao: activeAttempt.ultima_questao,
                    respostas: respostasMap,
                    score,
                    accuracy
                }
            });
        }

        const { count } = await supabase
            .from('test_tentativas')
            .select('*', { count: 'exact' })
            .eq('test_id', testId)
            .eq('user_id', userId);

        const tentativaNum = (count || 0) + 1;

        const { data: newAttempt, error: createError } = await supabase
            .from('test_tentativas')
            .insert({
                test_id: testId,
                user_id: userId,
                tentativa_num: tentativaNum,
                status: 'em andamento',
                ultima_questao: 1,
                score: 0,
                accuracy: 0
            })
            .select()
            .single();

        if (createError) {
            console.error('Erro ao criar tentativa:', createError);
            return res.status(500).json({ error: 'Erro ao criar tentativa.' });
        }

        return res.status(201).json({
            message: 'Tentativa iniciada com sucesso.',
            userId: userId,
            testId: testId,
            attemptId: newAttempt.id,
            test: teste,
            attempt: newAttempt,
            totalQuestoes,
            questoesIds,
            progress: {
                ultima_questao: 1,
                respostas: {},
                score: 0,
                accuracy: 0
            }
        });

    } catch (err) {
        console.error('Erro inesperado:', err);
        return res.status(500).json({ error: 'Erro inesperado ao iniciar tentativa.' });
    }
};



exports.saveAnswer = async (req, res) => {
    const { tentativa_id, questao_id, user_id, resposta } = req.body;

    if (!tentativa_id || !questao_id || !resposta || !user_id) {
        return res.status(400).json({ error: 'Parâmetros obrigatórios faltando.' });
    }

    try {
        const { data: attempt, error: attemptError } = await supabase
            .from('test_tentativas')
            .select('test_id, user_id, status')
            .eq('id', tentativa_id)
            .eq('user_id', user_id)
            .maybeSingle();

        if (attemptError || !attempt) {
            return res.status(404).json({ error: 'Tentativa não encontrada.' });
        }

        if (attempt.status === "finalizado") {
            return res.status(403).json({ error: 'Tentativa já finalizada.' });
        }

        const { data: testQuestion, error: testQuestionError } = await supabase
            .from('test_questoes')
            .select('ordem')
            .eq('id_test', attempt.test_id)
            .eq('id_questao', questao_id)
            .maybeSingle();

        if (testQuestionError || !testQuestion) {
            return res.status(400).json({ error: 'Questão não pertence ao teste.' });
        }

        const { data: question, error: questionError } = await supabase
            .from('questoes')
            .select('opcao_a, opcao_b, opcao_c, opcao_d, opcao_e, resposta_correta')
            .eq('id', questao_id)
            .maybeSingle();

        if (questionError || !question) {
            return res.status(400).json({ error: 'Questão não encontrada.' });
        }

        const respostaNormalizada = resposta.trim().toUpperCase();
        const opcoesValidas = {
            A: question.opcao_a?.trim(),
            B: question.opcao_b?.trim(),
            C: question.opcao_c?.trim(),
            D: question.opcao_d?.trim(),
            E: question.opcao_e?.trim(),
        };

        if (!opcoesValidas[respostaNormalizada]) {
            return res.status(400).json({ error: 'Resposta inválida.' });
        }

        const { data: existingAnswer } = await supabase
            .from('respostas')
            .select('id')
            .eq('tentativa_id', tentativa_id)
            .eq('questao_id', questao_id)
            .maybeSingle();

        if (existingAnswer) {
            return res.status(403).json({ error: 'Questão já respondida.' });
        }

        const respostaCorretaLetra = Object.keys(opcoesValidas).find(
            key => `opcao_${key.toLowerCase()}` === question.resposta_correta
        );
        const isCorrect = respostaNormalizada === respostaCorretaLetra;

        const { error: insertError } = await supabase
            .from('respostas')
            .insert([{
                tentativa_id,
                questao_id,
                resposta: respostaNormalizada,
                correta: isCorrect,
                user_id
            }]);

        if (insertError) throw insertError;

        await supabase
            .from('test_tentativas')
            .update({ ultima_questao: testQuestion.ordem })
            .eq('id', tentativa_id);

        return res.status(201).json({
            success: true,
            correct: isCorrect,
            correct_answer: respostaCorretaLetra
        });

    } catch (err) {
        console.error('Erro ao salvar resposta:', err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};
exports.getAttemptProgress = async (req, res) => {
    const { attemptId, userId } = req.params;

    try {
        if (!attemptId || !userId) {
            return res.status(400).json({ 
                error: 'ID da tentativa e ID do usuário são obrigatórios.' 
            });
        }

        const { data: attempt, error: attemptError } = await supabase
            .from('test_tentativas')
            .select(`
                id,
                test_id,
                user_id,
                status,
                score,
                accuracy,
                testes:test_id(titulo, descricao)
            `)
            .eq('id', attemptId)
            .single();

        if (attemptError || !attempt) {
            return res.status(404).json({ error: 'Tentativa não encontrada.' });
        }

        if (attempt.user_id !== userId) {
            return res.status(403).json({ error: 'Não autorizado.' });
        }

        const { count: totalQuestions } = await supabase
            .from('test_questoes')
            .select('id_questao', { count: 'exact' })
            .eq('id_test', attempt.test_id);

        const { data: answers, error: answersError } = await supabase
            .from('respostas')
            .select('questao_id, resposta, correta')
            .eq('tentativa_id', attemptId);

        if (answersError) {
            throw answersError;
        }

        const respostasMap = {};
        answers.forEach(a => {
            respostasMap[a.questao_id] = {
                resposta: a.resposta,
                correta: a.correta
            };
        });

        const correctAnswers = answers.filter(a => a.correta).length;
        const isCompleted = answers.length === totalQuestions;

        return res.status(200).json({
            userId: userId,
            testId: attempt.test_id,
            attemptId: attempt.id,
            test: attempt.testes,
            totalQuestions,
            answered: answers.length,
            correct: correctAnswers,
            incorrect: answers.length - correctAnswers,
            remaining: totalQuestions - answers.length,
            is_completed: isCompleted,
            score: attempt.score,
            accuracy: attempt.accuracy,
            respostas: respostasMap
        });

    } catch (err) {
        console.error('Erro ao verificar progresso:', err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};
exports.finalizeAttempt = async (req, res) => {
    const { attemptId } = req.params;
    const user_id = req.body.userId;

    try {
        if (!attemptId) {
            console.error('Tentativa ID está faltando.');
            return res.status(400).json({ error: 'ID da tentativa não fornecido.' });
        }

        console.log('Finalizando tentativa ID:', attemptId);

        const { data: attempt, error: attemptError } = await supabase
            .from('test_tentativas')
            .select('*')
            .eq('id', attemptId)
            .eq('user_id', user_id)
            .maybeSingle();

        if (attemptError || !attempt) {
            console.error('Erro ao encontrar tentativa:', attemptError);
            return res.status(404).json({ error: 'Tentativa não encontrada.', details: attemptError });
        }

        if (attempt.status === "finalizado") {
            console.error('Tentativa já finalizada:', attempt);
            return res.status(403).json({ error: 'Tentativa já finalizada.' });
        }

        const { count: totalQuestions, error: totalQuestionsError } = await supabase
            .from('test_questoes')
            .select('id_questao', { count: 'exact' })
            .eq('id_test', attempt.test_id);

        if (totalQuestionsError) {
            console.error('Erro ao contar questões do teste:', totalQuestionsError);
            throw totalQuestionsError;
        }

        const { count: answeredQuestions, error: answeredQuestionsError } = await supabase
            .from('respostas')
            .select('id', { count: 'exact' })
            .eq('tentativa_id', attemptId);

        if (answeredQuestionsError) {
            console.error('Erro ao contar respostas respondidas:', answeredQuestionsError);
            throw answeredQuestionsError;
        }

        if (answeredQuestions !== totalQuestions) {
            console.error('Teste incompleto:', { totalQuestions, answeredQuestions });
            return res.status(400).json({ 
                error: 'Teste incompleto.',
                required: totalQuestions,
                answered: answeredQuestions
            });
        }

        const createdAt = new Date(attempt.created_at);
        const finalizadoEm = new Date();
        const tempoTotal = ((finalizadoEm - createdAt) / 1000).toFixed(2);

        const { data: answers, error: answersError } = await supabase
            .from('respostas')
            .select('correta')
            .eq('tentativa_id', attemptId);

        if (answersError) {
            console.error('Erro ao obter respostas:', answersError);
            throw answersError;
        }

        const correctAnswers = answers.filter(a => a.correta).length;
        const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);

        const { error: updateError } = await supabase
            .from('test_tentativas')
            .update({ 
                status: 'finalizado',
                tempo_total: tempoTotal,
                score: correctAnswers
            })
            .eq('id', attemptId);

        if (updateError) {
            console.error('Erro ao atualizar tentativa:', updateError);
            throw updateError;
        }

        const historyData = {
            user_id,
            test_id: attempt.test_id,
            attempt_id: attemptId,
            correct_answers: correctAnswers,
            incorrect_answers: totalQuestions - correctAnswers,
            total_questions: totalQuestions,
            accuracy: parseFloat(accuracy),
            score: correctAnswers,
            tempo_total: tempoTotal,
            resolved_at: finalizadoEm.toISOString()
        };

        const { error: historyError } = await supabase
            .from('test_history')
            .insert(historyData);

        if (historyError) {
            console.error('Erro ao registrar histórico:', historyError);
            console.error('Dados que deveriam ser inseridos:', historyData);
            throw historyError;
        }

        return res.status(200).json({
            success: true,
            score: correctAnswers,
            total_questions: totalQuestions,
            accuracy: accuracy,
            time_spent: tempoTotal
        });

    } catch (err) {
        console.error('Erro ao finalizar tentativa:', {
            attemptId: attemptId || 'Desconhecido',
            user_id: user_id || 'Desconhecido',
            correctAnswers: typeof correctAnswers !== 'undefined' ? correctAnswers : 'Indisponível',
            incorrectAnswers: typeof totalQuestions !== 'undefined' && typeof correctAnswers !== 'undefined' ? totalQuestions - correctAnswers : 'Indisponível',
            totalQuestions: typeof totalQuestions !== 'undefined' ? totalQuestions : 'Indisponível',
            accuracy: typeof accuracy !== 'undefined' ? parseFloat(accuracy) : 'Indisponível',
            tempoTotal: typeof tempoTotal !== 'undefined' ? tempoTotal : 'Indisponível',
            resolvedAt: typeof finalizadoEm !== 'undefined' ? finalizadoEm.toISOString() : 'Indisponível',
            errorDetails: err
        });
        return res.status(500).json({ 
            error: 'Erro ao finalizar tentativa.',
            details: err.message || err,
        });
    }
};

exports.getAttempts = async (req, res) => {
    const { userId } = req.params;

    try {
        const { data: tentativas, error } = await supabase
            .from('test_tentativas')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar tentativas do usuário:', error);
            return res.status(500).json({ error: 'Erro ao buscar tentativas do usuário.', detalhes: error.message });
        }

        if (!tentativas || tentativas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma tentativa encontrada para este usuário.' });
        }

        for (let tentativa of tentativas) {
            const { data: testeDetalhes } = await supabase
                .from('testes')
                .select('*')
                .eq('id', tentativa.test_id)
                .single();

            if (testeDetalhes) {
                tentativa.nomeTeste = testeDetalhes.nome;
                tentativa.descricaoTeste = testeDetalhes.descricao;
            } else {
                tentativa.nomeTeste = 'Teste não encontrado';
                tentativa.descricaoTeste = 'Descrição não disponível';
            }

            const { data: questoes } = await supabase
                .from('test_questoes')
                .select('id_questao')
                .eq('id_test', tentativa.test_id);

            const questaoIds = questoes ? questoes.map(q => q.id_questao) : [];

            const { data: questaotopicos } = await supabase
                .from('questao_topicos')
                .select('topico_id')
                .in('questao_id', questaoIds);

            const topicosUnicos = questaotopicos ? [...new Set(questaotopicos.map(qt => qt.topico_id))] : [];

            const { data: topicos } = await supabase
                .from('topicos')
                .select('nome')
                .in('id', topicosUnicos);

            tentativa.topicos = topicos ? topicos.map(t => t.nome) : [];

            const { data: historico } = await supabase
                .from('test_history')
                .select('score')
                .eq('attempt_id', tentativa.id);

            if (historico && historico.length > 0) {
                const totalPontuacao = historico.reduce((sum, record) => sum + parseFloat(record.score), 0);
                tentativa.porcentagemAcerto = `${(totalPontuacao / historico.length).toFixed(2)}%`;
            } else {
                tentativa.porcentagemAcerto = '0%';
            }
        }

        return res.status(200).json({ tentativas });

    } catch (err) {
        console.error('Erro interno ao listar tentativas:', err.message);
        return res.status(500).json({ error: 'Erro interno ao listar tentativas.', detalhes: err.message });
    }
};
exports.getAttemptResponses = async (req, res) => {
    const { attemptId } = req.params;

    try {
        const { data: respostas, error } = await supabase
            .from('respostas')
            .select('questao_id, resposta, correta')
            .eq('tentativa_id', attemptId);

        if (error) throw error;

        return res.status(200).json({ respostas });

    } catch (err) {
        console.error('Erro ao buscar respostas:', err);
        return res.status(500).json({ 
            error: 'Erro ao buscar respostas da tentativa',
            detalhes: err.message
        });
    }
};