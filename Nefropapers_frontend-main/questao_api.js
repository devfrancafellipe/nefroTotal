async function buscarQuestaoIdsPorTeste(testId) {
    try {
        const resposta = await fetch(`https://nefropapersapi.com/questoes/teste/${testId}`);
        if (resposta.ok) {
            const dados = await resposta.json();
            console.log("IDs das questões:", dados); 
            return dados.map(questao => ({ id: questao.id }));
        } else {
            alert("Erro ao carregar as questões do teste.");
            return [];
        }
    } catch (erro) {
        console.error("Erro ao buscar IDs das questões:", erro);
        alert("Erro ao carregar as questões.");
        return [];
    }
}

async function enviarResposta(questaoId, resposta) {
    if (!tentativaAtual?.id || !tentativaAtual?.testId || !tentativaAtual?.userId) {
        tentativaAtual = {
            id: localStorage.getItem('tentativaId'),
            testId: localStorage.getItem('testId'),
            userId: localStorage.getItem('userId'),
            questoesRespondidas: tentativaAtual?.questoesRespondidas || {}
        };
    
        if (!tentativaAtual.userId) {
            throw new Error("Sessão expirada. Por favor, reinicie o teste.");
        }
    }
    
    const respostaParaBackend = resposta.toUpperCase();
    
    const payload = {
        tentativa_id: tentativaAtual.id,
        questao_id: questaoId,
        user_id: tentativaAtual.userId,
        resposta: respostaParaBackend
    };
    
    console.log("Enviando dados para o servidor:", payload);
    
    try {
        const response = await fetch(`https://nefropapersapi.com/simulados/${tentativaAtual.id}/responder`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify(payload)
        });
    
        const contentType = response.headers.get('content-type');
        if (!contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Resposta inválida do servidor: ${text}`);
        }
    
        const data = await response.json();
    
        if (!response.ok) {
            throw new Error(data.error || `Erro ${response.status} ao enviar resposta`);
        }
    
        return {
            finalizado: data.status === 'finalizado',
            correto: data.correct || data.correta || false,
            dados: data
        };
    
    } catch (error) {
        console.error('Erro detalhado:', {
            endpoint: `simulados/${tentativaAtual.id}/responder`,
            payload,
            error: error.message
        });
        throw new Error(`Falha ao enviar resposta: ${error.message}`);
    }
}
async function verificarProgresso() {
    const userId = localStorage.getItem('userId') || tentativaAtual.userId;
    
    if (!userId) {
        console.error('User ID não disponível');
        return null;
    }

    try {
        const response = await fetch(`https://nefropapersapi.com/simulados//tentativas/${tentativaAtual.id}/${userId}/progresso`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Erro ao verificar progresso');
        
        return await response.json();

    } catch (error) {
        console.error('Erro ao verificar progresso:', error);
        return null;
    }
}

async function carregarQuestao(idQuestao) {
    console.log(`Carregando questão ${idQuestao}`);
    
    if (questoesCarregadas[idQuestao]) {
        exibirQuestao(questoesCarregadas[idQuestao]);
        aplicarFeedbackPermanente(idQuestao);
        return;
    }

    try {
        const resposta = await fetch(`https://nefropapersapi.com/questoes/${idQuestao}`);
        if (resposta.ok) {
            const dadosQuestao = await resposta.json();
            questoesCarregadas[idQuestao] = dadosQuestao;
            exibirQuestao(dadosQuestao);
            aplicarFeedbackPermanente(idQuestao);
        }
    } catch (erro) {
        console.error("Erro ao carregar questão:", erro);
    }
}

async function carregarRespostasExistentes() {
    if (!tentativaAtual.id) return;

    try {
        const response = await fetch(
            `https://nefropapersapi.com/simulados/tentativas/${tentativaAtual.id}/respostas`
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Falha ao carregar respostas (${response.status})`);
        }

        const { respostas } = await response.json();

        if (respostas && respostas.length > 0) {
            tentativaAtual.respostasEnviadas = {};
            tentativaAtual.respostasCorretas = {};
            tentativaAtual.questoesRespondidas = {};
            
            respostas.forEach(resposta => {
                tentativaAtual.respostasEnviadas[resposta.questao_id] = resposta.resposta;
                tentativaAtual.respostasCorretas[resposta.questao_id] = resposta.correta;
                tentativaAtual.questoesRespondidas[resposta.questao_id] = true;
            });
        }
    } catch (erro) {
        console.error("Erro ao carregar respostas:", erro);
    }
}

async function calcularResultados() {
    try {
        if (!tentativaAtual?.id || !tentativaAtual?.userId) {
            throw new Error('IDs da tentativa ou usuário não disponíveis');
        }

        console.log(`Buscando progresso para tentativa ${tentativaAtual.id} e usuário ${tentativaAtual.userId}`);
        
        const response = await fetch(
            `https://nefropapersapi.com/simulados/tentativas/${tentativaAtual.id}/${tentativaAtual.userId}/progresso`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            }
        );
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao calcular progresso: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Dados recebidos da API:', data);
        
        return {
            total_questions: data.totalQuestions || data.total_questions || 0,
            correct_answers: data.correct || data.correct_answers || 0,
            incorrect_answers: data.incorrect || data.incorrect_answers || 0,
            score: data.score || 0,
            accuracy: data.accuracy || 0
        };
        
    } catch (error) {
        console.error('Erro ao calcular resultados:', error);
        throw error;
    }
}

async function finalizarTentativa() {
    try {
        if (!tentativaAtual.id || !tentativaAtual.userId) {
            throw new Error('IDs da tentativa ou usuário não disponíveis');
        }

        console.log('Iniciando finalização da tentativa:', tentativaAtual.id);

        const response = await fetch(`https://nefropapersapi.com/simulados/tentativas/${tentativaAtual.id}/finalizar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                userId: tentativaAtual.userId
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao finalizar tentativa');
        }

        const resultado = await response.json();
        console.log('Tentativa finalizada com sucesso:', resultado);
        
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 2000);
        
        return resultado;

    } catch (error) {
        console.error('Falha ao finalizar tentativa:', {
            error: error.message,
            tentativaId: tentativaAtual.id,
            userId: tentativaAtual.userId
        });
        throw error;
    }
}

// Mantemos todas as funções existentes e adicionamos as necessárias do antigo
async function buscarDadosQuestao(questaoId) {
    const apiKey = localStorage.getItem('apiKey');
    const url = `https://nefropapersapi.com/questoes/${questaoId}`;
    try {
        const resposta = await fetch(url, { headers: { 'X-API-KEY': apiKey } });
        if (!resposta.ok) throw new Error(`Erro ao buscar os dados da questão (ID: ${questaoId}).`);
        return await resposta.json();
    } catch (erro) {
        console.error(`Erro em buscarDadosQuestao (ID: ${questaoId}):`, erro.message);
        throw erro;
    }
}

async function iniciarTentativaECarregarProgresso(testId) {
    const userId = localStorage.getItem('user_id') || localStorage.getItem('userId');
    
    if (!userId || !testId) {
        console.error("Erro: Parâmetros obrigatórios não encontrados.", { userId, testId });
        return null;
    }

    try {
        const response = await fetch(`https://nefropapersapi.com/simulados/${testId}/${userId}/iniciar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': localStorage.getItem('apiKey')
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao iniciar tentativa');
        }

        const data = await response.json();
        localStorage.setItem('tentativa_id', data.attempt.id);
        
        return {
            tentativaId: data.attempt.id,
            ultimaQuestao: data.progress.ultima_questao || 1,
            respostas: data.progress.respostas || []
        };
    } catch (error) {
        console.error('Erro ao iniciar/retomar tentativa:', error);
        throw error;
    }
}

