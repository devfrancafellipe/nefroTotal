document.querySelector('.back-arrow').addEventListener('click', () => {
    const simuladoId = new URLSearchParams(window.location.search).get('id');
    window.location.href = `./detalhes.html?id=${simuladoId}`;
});

// BUSCAR DADOS DA QUESTÃO
async function buscarDadosQuestao(questaoId) {
    const apiKey = localStorage.getItem('apiKey');
    const url = `https://nefropapersapi.com/questoes/${questaoId}`;
    try {
        const resposta = await fetch(url, { headers: { 'X-API-KEY': apiKey } });
        if (!resposta.ok) throw new Error(`Erro ao buscar os dados da questão (ID: ${questaoId}).`);
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error(`Erro em buscarDadosQuestao (ID: ${questaoId}):`, erro.message);
        throw erro;
    }
}

// OBTENÇÃO DOS PARÂMETROS DA URL
function obterIdsDaUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('testId');
    const questionId = urlParams.get('questionId');

    console.log("Test ID:", testId, "Question ID:", questionId);

    if (!testId || !questionId) {
        console.error('Parâmetros testId ou questionId ausentes ou inválidos.');
        return null;
    }

    return { testId, questionId };
}

// INICIALIZAR A PÁGINA


function atualizarHTML(dados) {
    if (!dados || !dados.pergunta || !dados.opcao_a || !dados.opcao_b) {
        console.error('Os dados da questão são inválidos:', dados);
        throw new Error('Erro ao atualizar o HTML: Dados da questão inválidos.');
    }

    document.querySelector('.question-number h2').textContent = `Questão`;

    document.querySelector('.question-body p').textContent = dados.pergunta;
    document.querySelector('#expand-popup .question-body p').textContent = dados.pergunta;

    const containerRespostas = document.querySelector('.answers');
    containerRespostas.innerHTML = '';

    const respostas = [
        { letra: 'A', texto: dados.opcao_a },
        { letra: 'B', texto: dados.opcao_b },
        { letra: 'C', texto: dados.opcao_c },
        { letra: 'D', texto: dados.opcao_d },
        { letra: 'E', texto: dados.opcao_e },
    ];

    respostas.forEach((resposta) => {
        if (resposta.texto) {
            const opcaoHTML = `
                <div class="answer">
                    <button class="option-button" data-option="${resposta.letra}">${resposta.letra}</button>
                    <p>${resposta.texto}</p>
                </div>
            `;
            containerRespostas.insertAdjacentHTML('beforeend', opcaoHTML);
        }
    });

    const imageButton = document.querySelector('.image-button');
    const popupImage = document.getElementById('popup-image');
    const popupImg = document.querySelector('.popup-img');

    // Configurar botão de imagem
    if (dados.imagem_url) { 
        imageButton.style.display = 'flex';
        imageButton.addEventListener('click', () => {
            popupImg.src = dados.imagem_url; 
            popupImage.style.display = 'flex'; 
        });

        popupImage.addEventListener('click', (e) => {
            if (e.target === popupImage) {
                popupImage.style.display = 'none';
            }
        });
    } else {
        imageButton.style.display = 'none';
    }
}

async function carregarQuestaoAtual() {
    const ids = obterIdsDaUrl();

    if (!ids) {
        alert('Erro ao carregar a questão. Redirecionando para os detalhes do teste.');
        redirecionarParaDetalhes(new URLSearchParams(window.location.search).get('testId'));
        return;
    }

    try {
        const { questionId, testId } = ids;
        const dadosQuestao = await buscarDadosQuestao(questionId);
        atualizarHTML(dadosQuestao);

        const progresso = JSON.parse(localStorage.getItem('progressoTeste')) || {};
        const respostaSalva = progresso[questionId]?.resposta;

        if (respostaSalva) {
            const respostaCorreta = dadosQuestao.resposta_correta.replace("opcao_", "").toUpperCase();
            const botoes = document.querySelectorAll('.option-button');

            botoes.forEach(botao => {
                const opcao = botao.getAttribute("data-option");

                if (opcao === respostaSalva) {
                    botao.style.backgroundColor = opcao === respostaCorreta ? "#00C851" : "#FF4444";
                    botao.style.color = "white";
                }

                if (opcao === respostaCorreta) {
                    botao.style.backgroundColor = "#00C851";
                    botao.style.color = "white";
                }

                botao.disabled = true; 
            });

            const submitButton = document.querySelector('.submit-button');
            if (submitButton) {
                submitButton.disabled = true;
            }
        }

        configurarNavegacao();
    } catch (erro) {
        console.error('Erro ao carregar a questão:', erro.message);
        alert('Erro ao carregar a questão. Redirecionando para os detalhes do teste.');
        redirecionarParaDetalhes(ids.testId);
    }
}

function redirecionarParaDetalhes(testId) {
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
    const testDetailsPath = `${basePath}/detalhes.html?id=${testId}`;
    window.location.href = testDetailsPath;
}

function configurarNavegacao() {
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    const idsQuestoes = JSON.parse(localStorage.getItem('idsQuestoes'));
    const currentQuestionId = new URLSearchParams(window.location.search).get('questionId');

    if (!idsQuestoes || !currentQuestionId) {
        console.error('IDs de questões ou ID da questão atual não encontrados.');
        return;
    }

    const currentIndex = idsQuestoes.indexOf(currentQuestionId);

    if (currentIndex > 0) {
        prevButton.addEventListener('click', () => {
            const prevQuestionId = idsQuestoes[currentIndex - 1];
            redirecionarParaQuestao(prevQuestionId);
        });
        prevButton.disabled = false;
        prevButton.classList.remove('disabled');
    } else {
        prevButton.disabled = true;
        prevButton.classList.add('disabled');
    }

    if (currentIndex < idsQuestoes.length - 1) {
        nextButton.addEventListener('click', () => {
            const nextQuestionId = idsQuestoes[currentIndex + 1];
            redirecionarParaQuestao(nextQuestionId);
        });
        nextButton.disabled = false;
        nextButton.classList.remove('disabled');
    } else {
        nextButton.disabled = true;
        nextButton.classList.add('disabled');
    }
}

function redirecionarParaQuestao(questionId) {
    const testId = new URLSearchParams(window.location.search).get('testId');
    window.location.href = `questao.html?testId=${testId}&questionId=${questionId}&navegacaoInterna=true`;
}

async function iniciarTentativaECarregarProgresso() {
    const userId = localStorage.getItem("user_id") || localStorage.getItem("userId");
    const testId = new URLSearchParams(window.location.search).get("testId");

    if (!userId || !testId) {
        console.error("Erro: Parâmetros obrigatórios não encontrados.", { userId, testId });
        exibirToast("Erro: Parâmetros obrigatórios não encontrados.", "erro");
        return;
    }

    try {
        console.log("🧹 Limpando dados antigos da tentativa...");
        
        localStorage.removeItem('tentativa_id');
        localStorage.removeItem('ultima_questao');
        localStorage.removeItem('respostas_salvas');
        localStorage.removeItem('questoes_total');

        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('resposta_')) {
                localStorage.removeItem(key);
            }
        });

        const response = await fetch(`https://nefropapersapi.com/simulados/${testId}/${userId}/iniciar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': localStorage.getItem('apiKey')
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro ao iniciar/retomar tentativa:', errorData.error);
            alert('Erro ao iniciar o teste. Tente novamente.');
            window.location.href = 'index.html';
            return;
        }

        const data = await response.json();

        if (!data || !data.attempt || !data.progress) {
            throw new Error('Dados inválidos recebidos do servidor.');
        }

        localStorage.setItem('tentativa_id', data.attempt.id);

        const progresso = {
            ultimaQuestao: data.progress.ultima_questao || 1,
            respostas: data.progress.respostas || [],
            questoesTotal: data.test.questoesTotal || 0,
            questoesRestantes: data.progress.questoesRestantes || []
        };

        localStorage.setItem("ultima_questao", progresso.ultimaQuestao);
        localStorage.setItem("respostas_salvas", JSON.stringify(progresso.respostas));
        localStorage.setItem("questoes_total", JSON.stringify(progresso.questoesTotal));
        localStorage.setItem("questoes_restantes", JSON.stringify(progresso.questoesRestantes));

        const contadorElemento = document.querySelector('.contador-questao');
        if (contadorElemento) {
            const contador = `${progresso.ultimaQuestao} de ${progresso.questoesTotal}`;
            contadorElemento.innerText = contador;
        }

        if (data.attempt.status === 'em andamento') {
            console.log("🔄 Tentativa já estava em andamento. Retomando...");
        }

        if (progresso.questoesTotal > 0 && progresso.questoesRestantes.length === 0) {
            console.log("✅ Todas as questões foram respondidas. Finalizando teste...");

            const resultado = {
                totalQuestoes: progresso.questoesTotal,
                acertos: progresso.respostas.filter(resposta => resposta.correta).length,
                erros: progresso.respostas.filter(resposta => !resposta.correta).length,
                score: progresso.respostas.filter(resposta => resposta.correta).length
            };

            alert(`Teste concluído! Você acertou ${resultado.acertos} de ${resultado.totalQuestoes} questões.`);
            
            setTimeout(() => {
                window.location.href = `./detalhes.html?id=${testId}`;
            }, 3000);
            return;
        }

        if (progresso.questoesRestantes.length > 0) {
            const proximaQuestaoId = progresso.questoesRestantes[0];
            console.log(`➡️ Redirecionando para a próxima questão: ${proximaQuestaoId}`);
            window.location.href = `./question.html?testId=${testId}&questionId=${proximaQuestaoId}`;
        }
        
    } catch (error) {
        console.error('Erro ao iniciar/retomar tentativa:', error);
        alert('Erro ao conectar ao servidor. Tente novamente mais tarde.');
        window.location.href = 'index.html';
    }
}

async function configurarSelecaoResposta() {
    const containerRespostas = document.querySelector('.answers');
    const submitButton = document.querySelector('.submit-button');
    const gabaritoButton = document.querySelector('.question-button');
    const { testId, questionId } = obterIdsDaUrl();
    const userId = localStorage.getItem('userId') || localStorage.getItem('user_id');
    let tentativaId = localStorage.getItem('tentativa_id');
    
    if (!tentativaId) {
        try {
            console.log('Criando nova tentativa...');
            await iniciarTentativaECarregarProgresso();
            tentativaId = localStorage.getItem('tentativa_id');
            
            if (!tentativaId) {
                throw new Error('Não foi possível criar uma nova tentativa');
            }
        } catch (error) {
            console.error('Erro ao criar tentativa:', error);
            alert('Erro ao iniciar o teste. Por favor, recarregue a página.');
            return;
        }
    }

    console.log("Dados para envio:", { userId, tentativaId, questionId, testId });

    // Verificação mais robusta dos parâmetros obrigatórios
    if (!userId || !tentativaId) {
        console.error('Faltando parâmetros obrigatórios:', { userId, tentativaId });
        alert('Erro ao carregar dados do usuário. Por favor, recarregue a página.');
        return;
    }

    // Verificar se já existe resposta para esta questão
    const respostaSalva = await verificarRespostaQuestao(questionId, testId, tentativaId, userId);
    if (respostaSalva) {
        await exibirResultado(respostaSalva.resposta, questionId);
        return;
    }

    // Configurar seleção de resposta
    let selectedAnswer = null;
    
    containerRespostas.addEventListener('click', (event) => {
        const target = event.target;
        let botao = null;

        if (target.classList.contains('option-button')) {
            botao = target;
        } else if (target.tagName === 'P' && target.parentElement.classList.contains('answer')) {
            botao = target.previousElementSibling;
        }

        if (botao && !botao.disabled) {
            selectedAnswer = botao.getAttribute('data-option');

            document.querySelectorAll('.option-button').forEach(btn => {
                btn.style.backgroundColor = '';
                btn.style.color = '';
            });

            botao.style.backgroundColor = '#007BFF';
            botao.style.color = 'white';

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.style.backgroundColor = '#282828';
                submitButton.style.color = '#FFFFFF';
            }
        }
    });

    if (submitButton) {
        submitButton.addEventListener('click', async () => {
            if (!selectedAnswer) {
                alert('Por favor, selecione uma resposta antes de enviar.');
                return;
            }

            try {
                const apiKey = localStorage.getItem('apiKey');
                if (!apiKey) {
                    throw new Error('Chave API não encontrada');
                }

                // Verificação final dos parâmetros antes do envio
                if (!tentativaId || !questionId || !selectedAnswer || !userId) {
                    throw new Error(`Parâmetros incompletos: 
                        tentativa_id: ${tentativaId}
                        questao_id: ${questionId}
                        resposta: ${selectedAnswer}
                        user_id: ${userId}
                    `);
                }

                const requestBody = {
                    tentativa_id: tentativaId,
                    questao_id: questionId,
                    resposta: selectedAnswer,
                    user_id: userId
                };

                console.log("Enviando para API:", requestBody); // Log para debug

                const response = await fetch(`https://nefropapersapi.com/simulados/${testId}/responder`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-KEY': apiKey
                    },
                    body: JSON.stringify(requestBody)
                });

                const responseData = await response.json();
                
                if (!response.ok) {
                    console.error('Erro detalhado:', responseData);
                    throw new Error(responseData.error || 'Erro ao salvar resposta');
                }

                console.log("Resposta salva com sucesso:", responseData);
                
                // Salvar localmente e atualizar interface
                localStorage.setItem(`resposta_${questionId}`, selectedAnswer);
                await exibirResultado(selectedAnswer, questionId);

                if (submitButton) submitButton.disabled = true;
                if (gabaritoButton) {
                    gabaritoButton.disabled = false;
                    gabaritoButton.style.opacity = '1';
                }

            } catch (erro) {
                console.error('Erro completo:', erro);
                alert(`Erro ao enviar resposta: ${erro.message}`);
                
                // Tentar recuperar o tentativa_id se estiver faltando
                if (erro.message.includes('tentativa_id')) {
                    console.log('Tentando recuperar tentativa_id...');
                    await iniciarTentativaECarregarProgresso();
                }
            }
        });
    }
}

async function verificarRespostaQuestao(questionId, testId, tentativaId, userId) {
    try {
        const respostaSalva = localStorage.getItem(`resposta_${questionId}`);
        if (respostaSalva) {
            return { resposta: respostaSalva };
        }
        const response = await fetch(`https://nefropapersapi.com/simulados/${testId}/${userId}/iniciar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": localStorage.getItem("apiKey"),
            },
        });

        if (!response.ok) {
            console.error("Erro ao carregar progresso:", await response.text());
            return false;
        }

        const data = await response.json();

        if (!data || !data.progress || !data.progress.respostas) {
            console.warn("Nenhuma resposta encontrada para esta tentativa.");
            return false;
        }

        const respostasArray = data.progress.respostas;

        return respostasArray.find(resposta => 
            resposta.questao_id === questionId && 
            resposta.tentativa_id === tentativaId
        );
    } catch (error) {
        console.error("Erro ao verificar resposta da questão:", error);
        return false;
    }
}

async function exibirResultado(respostaSelecionada, questionId) {
    const detalhesQuestao = await buscarDadosQuestao(questionId);
    const respostaCorreta = detalhesQuestao.resposta_correta.replace('opcao_', '').toUpperCase();
    const botoes = document.querySelectorAll('.option-button');

    const respostaSalva = localStorage.getItem(`resposta_${questionId}`) || respostaSelecionada;

    botoes.forEach(botao => {
        const opcao = botao.getAttribute("data-option");

        if (opcao === respostaSalva) {
            botao.style.backgroundColor = opcao === respostaCorreta ? "#00C851" : "#FF4444";
            botao.style.color = "white";
        }

        if (opcao === respostaCorreta) {
            botao.style.backgroundColor = "#00C851";
            botao.style.color = "white";
        }

        botao.disabled = true;
        botao.style.pointerEvents = "none";
    });

    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
        submitButton.disabled = true;
    }

    const gabaritoButton = document.querySelector('.question-button');
    if (gabaritoButton) {
        gabaritoButton.disabled = false;
        gabaritoButton.style.opacity = '1';
    }
}

// Funções auxiliares
function validarAttemptId(testId, userId) {
    // Implementação necessária
    return Promise.resolve(localStorage.getItem('tentativa_id'));
}

function exibirToast(mensagem, tipo) {
    // Implementação necessária
    console.log(`[${tipo}] ${mensagem}`);
}

// Configuração de popups
const questionButton = document.querySelector('.question-button');
const popupGabarito = document.getElementById('popup-gabarito');

questionButton.addEventListener('click', async () => {
    popupGabarito.style.display = 'flex';
    try {
        const questionId = new URLSearchParams(window.location.search).get('questionId');
        const dadosQuestao = await buscarDadosQuestao(questionId);
        const explicacao = dadosQuestao.explicacao;
        const explanationText = popupGabarito?.querySelector('.explanation-content p');

        if (!explicacao) {
            console.error("Explicação não encontrada nos dados da questão.");
            return;
        }

        explanationText.innerText = explicacao;
        popupGabarito.style.display = 'flex'; 
        console.log("Gabarito exibido com sucesso.");
    } catch (erro) {
        console.error("Erro ao exibir o gabarito:", erro.message);
    } 
});

popupGabarito.addEventListener('click', (e) => {
    if (e.target === popupGabarito) {
        popupGabarito.style.display = 'none'; 
    }
});

const expandIcon = document.getElementById('expand-icon');
const expandPopup = document.getElementById('expand-popup');

expandIcon.addEventListener('click', () => {
    expandPopup.style.display = 'flex';
});

expandPopup.addEventListener('click', (e) => {
    if (e.target === expandPopup) {
        expandPopup.style.display = 'none';
    }
});

const popupLarge = document.getElementById('popup-large-image');
const openPopupLargeButton = document.getElementById('detailed-response'); 
const closePopupLargeButton = document.getElementById('close-popup-large'); 
const explicacaoImg = document.querySelector('.gabarito-img');

async function configurarExplicacaoImagem() {
    const questionId = new URLSearchParams(window.location.search).get('questionId');
    const dadosQuestao = await buscarDadosQuestao(questionId);
    const explicacaoUrl = dadosQuestao.imagem_explicacao;

    if (explicacaoUrl) { 
        console.log("Não tem explicacao imagem");
        openPopupLargeButton.style.display = 'flex';
        openPopupLargeButton.addEventListener('click', () => {
            explicacaoImg.src = dadosQuestao.imagem_explicacao; 
            popupLarge.style.display = 'flex';

            explicacaoImg.addEventListener('click', function () {
                this.classList.toggle('zoom');
            });
        });

        closePopupLargeButton.addEventListener('click', () => {
            popupLarge.style.display = 'none'; 
        });
    } else {
        openPopupLargeButton.style.display = 'none';
    }
}

configurarExplicacaoImagem();

// Configuração de link dinâmico
const linkElement = document.getElementById('dynamicLink');
const url = new URL(window.location.href);
const testIdUrl = url.searchParams.get('testId');
if (testIdUrl) {
    linkElement.href = `./detalhes.html?id=${testIdUrl}`;
} else {
    console.error('testId não encontrado na URL');
}

// Barra de progresso
let questaoAtual = 1;
let totalQuestoes = 1;
let questoesIds = [];

async function inicializarProgresso() {   
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('testId');
    const questionId = urlParams.get('questionId');
    
    if (!testId) {
        return;
    }
    
    try {
        const apiKey = localStorage.getItem('apiKey');
        if (!apiKey) {
            alert("Chave de API não encontrada.");
            return;
        }

        const url = `https://nefropapersapi.com/simulados/${testId}/detalhes`;
        
        const resposta = await fetch(url, {
            headers: { 'X-API-KEY': apiKey }
        });

        if (!resposta.ok) throw new Error('Erro ao buscar questões');
        
        const dados = await resposta.json();

        if (dados && Array.isArray(dados.questoesComTopicos) && dados.questoesComTopicos.length > 0) {
            questoesIds = dados.questoesComTopicos.map(q => q.questao_id);
            totalQuestoes = questoesIds.length;
            console.log("IDs das questões armazenados corretamente:", questoesIds);
        } else {
            totalQuestoes = 1;
            console.warn("Nenhuma questão encontrada para o teste.");
        }
        
        if (questionId) {
            const index = questoesIds.findIndex(id => id === questionId);
            if (index !== -1) {
                questaoAtual = index + 1;
                console.log("Questão atual encontrada na posição:", questaoAtual);
            } else {
                questaoAtual = 1;
                console.log("ID da questão não encontrado no array, definindo como padrão:", questaoAtual);
            }
        } else {
            questaoAtual = 1;
        }
        
        atualizarProgresso();
    } catch (erro) {
        console.error("Erro ao inicializar progresso:", erro);
    }
}

function atualizarProgresso() {
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    if (!progressBar || !progressText) {
        console.error("Elementos da barra de progresso não encontrados!");
        return;
    }
    
    progressBar.max = totalQuestoes;
    progressBar.value = questaoAtual;
    progressText.innerText = `${questaoAtual} de ${totalQuestoes}`;

    const progresso = ((questaoAtual - 1) / (totalQuestoes - 1)) * 100;
    progressBar.style.setProperty("--progress-percent", `${progresso}%`);
}

function mudarQuestao(direcao) {
    if (direcao === "next" && questaoAtual < totalQuestoes) {
        questaoAtual++;
    } else if (direcao === "prev" && questaoAtual > 1) {
        questaoAtual--;
    }

    const novoQuestionId = questoesIds[questaoAtual - 1];
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("questionId", novoQuestionId);
    window.history.replaceState({}, "", `${window.location.pathname}?${urlParams}`);

    atualizarProgresso();
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    carregarQuestaoAtual();
    iniciarTentativaECarregarProgresso();
    configurarSelecaoResposta();
    inicializarProgresso();

    const nextButton = document.querySelector(".next-button");
    const prevButton = document.querySelector(".prev-button");
    
    if (nextButton) {
        nextButton.addEventListener("click", () => {
            mudarQuestao("next");
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener("click", () => {
            mudarQuestao("prev");
        });
    }
});

window.addEventListener('popstate', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const newQuestionId = urlParams.get("questionId");
    
    if (newQuestionId) {
        const index = questoesIds.findIndex(id => id === newQuestionId);
        if (index !== -1) {
            questaoAtual = index + 1;
        } else {
            questaoAtual = 1;
        }
    } else {
        questaoAtual = 1;
    }
    
    atualizarProgresso();
});