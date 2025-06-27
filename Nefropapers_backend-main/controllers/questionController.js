const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// LISTAR QUESTÕES POR TÓPICO
exports.listQuestionsByTopic = async (req, res) => {
    const { idModulo } = req.params;

    try {
        const { data: questoesRelacionadas, error: errorRelacao } = await supabase
            .from('questao_topicos')
            .select('questao_id')
            .eq('topico_id', idModulo);

        if (errorRelacao) {
            return res.status(500).json({ error: 'Erro ao buscar questões relacionadas.', details: errorRelacao });
        }

        const questaoIds = questoesRelacionadas.map(q => q.questao_id);

        const { data: questoes, error: errorQuestoes } = await supabase
            .from('questoes')
            .select('*')
            .in('id', questaoIds);

        if (errorQuestoes) {
            return res.status(500).json({ error: 'Erro ao buscar questões.', details: errorQuestoes });
        }

        res.status(200).json(questoes);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor.', details: err.message });
    }
};

// CRIAR QUESTÃO
exports.createQuestion = async (req, res) => {
    const { 
        pergunta, 
        opcao_a, 
        opcao_b, 
        opcao_c, 
        opcao_d, 
        opcao_e, 
        resposta_correta, 
        explicacao,
        imagem_url, 
        imagem_explicacao,
        video_url, 
        topicos 
    } = req.body;

    if (!pergunta || !opcao_a || !opcao_b || !opcao_c || !opcao_d || !opcao_e || !resposta_correta || !topicos || topicos.length === 0) {
        return res.status(400).json({ error: 'Preencha todos os campos obrigatórios e selecione pelo menos um tópico.' });
    }

    if (new Set([opcao_a, opcao_b, opcao_c, opcao_d, opcao_e]).size !== 5) {
        return res.status(400).json({ error: 'As alternativas não podem ser iguais.' });
    }

    const respostas = { opcao_a, opcao_b, opcao_c, opcao_d, opcao_e };
    let respostas_erradas = Object.keys(respostas).filter(key => key !== resposta_correta);

    try {
        const { data: questionData, error: questionError } = await supabase
            .from('questoes')
            .insert([{
                pergunta,
                opcao_a,
                opcao_b,
                opcao_c,
                opcao_d,
                opcao_e,
                resposta_correta,
                respostas_erradas: JSON.stringify(respostas_erradas),
                explicacao,
                imagem_url,
                imagem_explicacao,
                video_url
            }])
            .select();

        if (questionError) {
            console.error('Erro na criação da questão:', questionError);
            return res.status(500).json({ error: 'Erro ao criar a questão, tente novamente.' });
        }

        const questaoId = questionData[0].id;

        for (const topicoId of topicos) {
            const { error: topicError } = await supabase
                .from('questao_topicos')
                .insert({ questao_id: questaoId, topico_id: topicoId });

            if (topicError) {
                console.error('Erro ao vincular tópico:', topicError);
                throw topicError; 
            }
        }

        const { data: topicosAssociados, error: topicosError } = await supabase
            .from('topicos')
            .select('nome')
            .in('id', topicos);

        if (topicosError) {
            console.error('Erro ao recuperar tópicos:', topicosError);
            return res.status(500).json({ error: 'Erro ao recuperar os tópicos da questão.' });
        }

        res.status(201).json({
            message: 'Questão criada com sucesso!',
            questao: {
                ...questionData[0],
                topicos: topicosAssociados.map(t => t.nome)
            }
        });

    } catch (error) {
        console.error('Erro ao criar a questão:', error);
        res.status(500).json({ error: 'Erro ao criar questão.' });
    }
};


//EDITAR UMA QUESTÃO
exports.updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { 
        pergunta, 
        opcao_a, 
        opcao_b, 
        opcao_c, 
        opcao_d, 
        opcao_e, 
        resposta_correta, 
        explicacao,
        imagem_url, 
        imagem_explicacao,
        video_url, 
        topicos 
    } = req.body;

    if (!pergunta || !opcao_a || !opcao_b || !opcao_c || !opcao_d || !opcao_e || !resposta_correta || !topicos || topicos.length === 0) {
        return res.status(400).json({ error: 'Preencha todos os campos obrigatórios e selecione pelo menos um tópico.' });
    }

    if (new Set([opcao_a, opcao_b, opcao_c, opcao_d, opcao_e]).size !== 5) {
        return res.status(400).json({ error: 'As alternativas não podem ser iguais.' });
    }

    const respostas = { opcao_a, opcao_b, opcao_c, opcao_d, opcao_e };
    let respostas_erradas = Object.keys(respostas).filter(key => key !== resposta_correta);

    try {
        const { data: questionData, error: questionError } = await supabase
            .from('questoes')
            .update({
                pergunta,
                opcao_a,
                opcao_b,
                opcao_c,
                opcao_d,
                opcao_e,
                resposta_correta,
                respostas_erradas: JSON.stringify(respostas_erradas),
                explicacao,
                imagem_url,
                imagem_explicacao,
                video_url
            })
            .match({ id })
            .select();

        if (questionError) {
            console.error('Erro ao atualizar a questão:', questionError);
            return res.status(500).json({ error: 'Erro ao atualizar a questão, tente novamente.' });
        }

        const { data: topicosAssociados, error: topicosError } = await supabase
            .from('topicos')
            .select('nome')
            .in('id', topicos);

        if (topicosError) {
            console.error('Erro ao recuperar tópicos:', topicosError);
            return res.status(500).json({ error: 'Erro ao recuperar os tópicos da questão.' });
        }

        res.status(200).json({
            message: 'Questão atualizada com sucesso!',
            questao: {
                ...questionData[0],
                topicos: topicosAssociados.map(t => t.nome) 
            }
        });

    } catch (error) {
        console.error('Erro ao atualizar a questão:', error);
        res.status(500).json({ error: 'Erro ao atualizar questão.' });
    }
};


//DELETAR UMA QUESTÃO
exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;

    try {
        const { error: deleteTestQuestionsError } = await supabase
            .from('test_questoes')
            .delete()
            .match({ id_questao: id });

        if (deleteTestQuestionsError) {
            console.error('Erro ao deletar registros de test_questoes:', deleteTestQuestionsError);
            return res.status(500).json({ error: 'Erro ao deletar registros de testes associados à questão.' });
        }

        const { error: deleteTopicError } = await supabase
            .from('questao_topicos')
            .delete()
            .match({ questao_id: id });

        if (deleteTopicError) {
            console.error('Erro ao deletar tópicos associados:', deleteTopicError);
            return res.status(500).json({ error: 'Erro ao deletar tópicos associados à questão.' });
        }

        const { error: deleteQuestionError } = await supabase
            .from('questoes')
            .delete()
            .match({ id });

        if (deleteQuestionError) {
            console.error('Erro ao deletar a questão:', deleteQuestionError);
            return res.status(500).json({ error: 'Erro ao deletar a questão, tente novamente.' });
        }

        res.status(200).json({ message: 'Questão deletada com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar a questão:', error);
        res.status(500).json({ error: 'Erro ao deletar questão.' });
    }
};



//LISTAR TODAS AS QUESTÕES
exports.listAllQuestions = async (req, res) => {
    try {
        const { data: questoes, error: erroQuestao } = await supabase
            .from('questoes')
            .select('*');

        if (erroQuestao) {
            return res.status(500).json({ error: 'Erro ao buscar todas as questões.', details: erroQuestao });
        }

        const questoesComTopicos = await Promise.all(questoes.map(async (questao) => {
            const { data: questaoTopicos, error: erroTopico } = await supabase
                .from('questao_topicos')
                .select('topico_id')
                .eq('questao_id', questao.id);

            if (erroTopico) {
                return { ...questao, topicos: [] };
            }

            const topicoIds = questaoTopicos.map(qt => qt.topico_id);
            const { data: topicos, error: erroDetalhesTopicos } = await supabase
                .from('topicos')
                .select('nome')
                .in('id', topicoIds);

            if (erroDetalhesTopicos) {
                return { ...questao, topicos: [] };
            }

            return { ...questao, topicos: topicos.map(t => t.nome) };
        }));

        res.status(200).json(questoesComTopicos);
        
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};


// OBTER QUESTÃO POR ID
exports.getQuestionById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'O ID da questão é obrigatório.' });
    }

    try {
        console.log("Buscando a questão com ID:", id);

        const { data: question, error } = await supabase
            .from('questoes')
            .select('id, pergunta, opcao_a, opcao_b, opcao_c, opcao_d, opcao_e, resposta_correta, imagem_url, explicacao, imagem_explicacao')
            .eq('id', id)
            .single();

        if (error || !question) {
            console.error("Erro ao buscar a questão:", error);
            return res.status(404).json({ error: 'Questão não encontrada.' });
        }

        const { data: topicosAssociados, error: topicosError } = await supabase
            .from('questao_topicos')
            .select('topico_id')
            .eq('questao_id', id);

        if (topicosError) {
            console.error('Erro ao buscar tópicos associados:', topicosError);
            return res.status(500).json({ error: 'Erro ao recuperar os tópicos associados à questão.' });
        }

        const topicoIds = topicosAssociados.map(t => t.topico_id);
        const { data: topicos, error: topicosNomesError } = await supabase
            .from('topicos')
            .select('nome')
            .in('id', topicoIds);

        if (topicosNomesError) {
            console.error('Erro ao recuperar nomes dos tópicos:', topicosNomesError);
            return res.status(500).json({ error: 'Erro ao recuperar os nomes dos tópicos.' });
        }

        res.status(200).json({
            id: question.id,
            pergunta: question.pergunta,
            opcao_a: question.opcao_a,
            opcao_b: question.opcao_b,
            opcao_c: question.opcao_c,
            opcao_d: question.opcao_d,
            opcao_e: question.opcao_e,
            resposta_correta: question.resposta_correta,
            imagem_url: question.imagem_url,
            explicacao: question.explicacao,
            imagem_explicacao: question.imagem_explicacao,
            topicos: topicos.map(t => t.nome)
        });
    } catch (err) {
        console.error('Erro no servidor ao tentar buscar questão:', err.message);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
};


// BUSCAR QUESTÕES DO TESTE
exports.getQuestionsForTest = async (req, res) => {
    const { testId } = req.params;

    if (!testId) {
        return res.status(400).json({ error: 'O ID do teste é obrigatório.' });
    }

    try {
        const { data: questoes, error: questoesError } = await supabase
            .from('test_questoes')
            .select('id_questao')
            .eq('id_test', testId);

        if (questoesError) {
            return res.status(500).json({ error: 'Erro ao buscar questões do teste.' });
        }

        const questaoIds = questoes.map(q => q.id_questao);

        const { data: questoesDetalhadas, error: questoesDetalhadasError } = await supabase
            .from('questoes')
            .select('id, pergunta, opcao_a, opcao_b, opcao_c, opcao_d, opcao_e, resposta_correta, explicacao, imagem_url, imagem_explicacao')
            .in('id', questaoIds);

        if (questoesDetalhadasError) {
            return res.status(500).json({ error: 'Erro ao buscar os detalhes das questões.' });
        }

        const questoesComTopicos = await Promise.all(questoesDetalhadas.map(async (questao) => {
            const { data: topicosAssociados, error: topicosError } = await supabase
                .from('questao_topicos')
                .select('topico_id')
                .eq('questao_id', questao.id);

            if (topicosError) {
                console.error('Erro ao buscar tópicos da questão:', topicosError);
                return res.status(500).json({ error: 'Erro ao recuperar os tópicos da questão.' });
            }

            const topicoIds = topicosAssociados.map(t => t.topico_id);
            const { data: topicos, error: topicosNomesError } = await supabase
                .from('topicos')
                .select('nome')
                .in('id', topicoIds);

            if (topicosNomesError) {
                console.error('Erro ao recuperar os nomes dos tópicos:', topicosNomesError);
                return res.status(500).json({ error: 'Erro ao recuperar os nomes dos tópicos.' });
            }

            return {
                ...questao,
                topicos: topicos.map(t => t.nome)
            };
        }));

        res.status(200).json(questoesComTopicos);
    } catch (err) {
        console.error('Erro ao buscar questões do teste:', err.message);
        res.status(500).json({
            error: 'Erro interno do servidor.',
            detalhes: err.message,
        });
    }
};

