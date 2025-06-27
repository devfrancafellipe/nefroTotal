const { createClient } = require('@supabase/supabase-js');

// CONFIGURAÇÃO DO SUPABASE
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// LISTAR TODOS OS TÓPICOS
exports.listAllTopicos = async (req, res) => {
    try {
        const { data: topicos, error: errorTopicos } = await supabase
            .from('topicos')
            .select('*');

        if (errorTopicos) {
            console.log("Erro ao buscar tópicos:", errorTopicos);
            return res.status(500).json({ error: 'Erro ao buscar tópicos.', details: errorTopicos });
        }

        for (let topico of topicos) {
            const { count: questaoCount, error: errorQuestions } = await supabase
                .from('questao_topicos')
                .select('id', { count: 'exact' })
                .eq('topico_id', topico.id);

            if (errorQuestions) {
                return res.status(500).json({ error: 'Erro ao contar questões.', details: errorQuestions });
            }

            topico.questaoCount = questaoCount || 0;
        }

        res.status(200).json(topicos);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor.', details: err.message });
    }
};


exports.getTopicoById = async (req, res) => {
    const { id } = req.params;

    try {
        const { data: topico, error: errorTopico } = await supabase
            .from('topicos')
            .select('*')
            .eq('id', id)
            .single();

        if (errorTopico || !topico) {
            return res.status(404).json({ error: 'Tópico não encontrado.' });
        }

        const { count: questaoCount, error: errorCount } = await supabase
            .from('questao_topicos')
            .select('questao_id', { count: 'exact' })
            .eq('topico_id', id);

        if (errorCount) {
            return res.status(500).json({ error: 'Erro ao contar questões.' });
        }

        topico.questaoCount = questaoCount || 0;

        res.status(200).json(topico);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor.', details: err.message });
    }
};


// CRIAR MÓDULO
exports.createModule = async (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
        return res.status(400).json({ error: 'Os campos nome e descricao são obrigatórios.' });
    }

    try {
        const { data, error } = await supabase
            .from('topicos')
            .insert([{ nome, descricao }])
            .select();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(201).json(data);
    } catch (err) {
        console.error('Erro interno ao criar módulo:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};

// LISTAR MÓDULOS COM CONTAGEM DE QUESTÕES
exports.listModulesWithQuestionCount = async (req, res) => {
    const { idCurso } = req.params;
    try {
        const { data: topicos, error: errorModules } = await supabase
            .from('topicos')
            .select('*')
            .eq('id_curso', idCurso);

        if (errorModules) {
            return res.status(500).json({ error: 'Erro ao buscar módulos.' });
        }

        for (let modulo of topicos) {
            const { count: questaoCount, error: errorQuestions } = await supabase
                .from('questoes')
                .select('id', { count: 'exact' })
                .eq('id_modulo', modulo.id);

            if (errorQuestions) {
                return res.status(500).json({ error: 'Erro ao contar questões.' });
            }

            modulo.questaoCount = questaoCount;
        }

        res.status(200).json(modulos);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};

// BUSCAR MÓDULOS PELO NOME
exports.searchModules = async (req, res) => {
    const { search } = req.query;

    if (!search || search.trim() === '') {
        return res.status(400).json({ error: 'O termo de busca não pode estar vazio.' });
    }

    try {
        const { data: modulos, error } = await supabase
            .from('topicos')
            .select('id, nome')
            .ilike('nome', `%${search}%`);

        if (error) {
            return res.status(500).json({ error: 'Erro ao buscar módulos.', details: error.message });
        }

        res.status(200).json(modulos);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor.', details: err.message });
    }
};
