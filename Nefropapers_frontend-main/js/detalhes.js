// // BUSCAR DETALHES DO TESTE

// async function buscarDetalhesTeste(testId) {
//     const apiKey = localStorage.getItem('apiKey');
//     const userId = localStorage.getItem('userId');

//     if (!apiKey || !userId) {
//         alert('API Key ou User ID não encontrados. Por favor, faça login novamente.');
//         window.location.href = 'index.html#login';
//         return;
//     }

//     const url = `https://nefropapersapi.com/simulados/${testId}/detalhes?userId=${userId}`;

//     console.log("🔍 URL da API:", url); 
//     console.log("User ID:", userId);

//     try {
//         const resposta = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-api-key': apiKey
//             }
//         });

//         if (!resposta.ok) {
//             throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
//         }

//         const dados = await resposta.json();
//         console.log("✅ Dados do teste recebidos:", dados); 
//         return dados;
//     } catch (erro) {
//         console.error("❌ Erro ao buscar detalhes do teste:", erro);
//         alert('Erro ao carregar os detalhes do teste.');
//         return null;
//     }
// }



// function atualizarHTML(dados) {
//     if (!dados) {
//         alert("Erro ao carregar os detalhes do teste.");
//         return;
//     }

//     document.querySelector('header h1').textContent = dados.titulo;
//     document.querySelector('header p').textContent = `${dados.acertoGeral} de acerto`;
//     document.querySelector('.creator-info p').textContent = `Criado por: ${dados.criador}`;

//     const topicsElement = document.querySelector('.topics ul');
//     if (dados.questoesComTopicos && dados.questoesComTopicos.length > 0) {
//         const todosTopicos = dados.questoesComTopicos.flatMap(q => q.topicos);

//         const topicosUnicos = [...new Set(todosTopicos)];

//         topicsElement.innerHTML = topicosUnicos.map(topico => `<li>${topico}</li>`).join('');
//     } else {
//         topicsElement.textContent = 'Sem tópicos disponíveis.';
//     }


//     const itensDesempenho = document.querySelectorAll('.performance-item h3');
//     itensDesempenho[0].textContent = `${dados.acertoGeral}`; 
//     itensDesempenho[1].textContent = `${dados.totalResolucoes} tentativas`; 
//     itensDesempenho[2].textContent = `${dados.minhaMaiorPontuacao} pontos`; 
//     itensDesempenho[3].textContent = `${dados.rating || "N/A"} pontos`; 

//     console.log("Minha maior pontuação:", dados.minhaMaiorPontuacao); 
// }

// // CONFIGURAR BOTÃO "COMEÇAR"
// function configurarBotaoComecar(testId, questoes) {
//     const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
//     const questaoPath = `${basePath}/questao.html`;

//     if (!questoes || questoes.length === 0) {
//         alert('Nenhuma questão encontrada para este teste.');
//         return;
//     }

//     const primeiraQuestaoId = questoes[0].questao_id;
//     console.log("➡️ Redirecionando para:", `${questaoPath}?testId=${testId}&questionId=${primeiraQuestaoId}`);

//     document.querySelector('.start-button').addEventListener('click', () => {
//         window.location.href = `${questaoPath}?testId=${testId}&questionId=${primeiraQuestaoId}`;
//     });
// }

// // OBTER TEST ID DA URL
// function obterTestId() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const testId = urlParams.get('id');

//     console.log("🔍 Test ID obtido:", testId); 

//     if (!testId) {
//         console.error("❌ Test ID não encontrado na URL!");
//     }

//     return testId;
// }

// // INICIALIZAR A PÁGINA
// async function inicializarPagina() {
//     try {
//         const testId = obterTestId();
//         if (!testId) {
//             alert('Teste não encontrado!');
//             window.location.href = 'index.html';
//             return;
//         }

//         const dadosTeste = await buscarDetalhesTeste(testId);

//         if (!dadosTeste) {
//             console.error("❌ Nenhum dado retornado da API.");
//             alert('Erro ao carregar os detalhes do teste.');
//             return;
//         }

//         atualizarHTML(dadosTeste);
//         configurarBotaoComecar(testId, dadosTeste.questoesComTopicos);

//         salvarIdsQuestoes(dadosTeste);
//     } catch (erro) {
//         console.error("❌ Erro inesperado:", erro);
//         alert('Erro ao carregar os detalhes do teste.');
//     }
// }

// inicializarPagina();

// // SALVAR QUESTÕES NO LOCALSTORAGE
// function salvarIdsQuestoes(dados) {
//     if (dados.questoesComTopicos && Array.isArray(dados.questoesComTopicos)) {
//         const ids = dados.questoesComTopicos.map(q => q.questao_id);
//         localStorage.setItem('idsQuestoes', JSON.stringify(ids));
//     } else {
//         console.error('❌ Nenhuma questão encontrada para o teste.');
//     }
// }


// BUSCAR DETALHES DO TESTE
async function buscarDetalhesTeste(testId) {
    const apiKey = localStorage.getItem('apiKey');
    const userId = localStorage.getItem('userId');

    if (!apiKey || !userId) {
        alert('API Key ou User ID não encontrados. Por favor, faça login novamente.');
        window.location.href = 'index.html#login';
        return;
    }

    const url = `https://nefropapersapi.com/simulados/${testId}/detalhes?userId=${userId}`;

    // console.log("🔍 URL da API:", url); 
    // console.log("User ID:", userId);

    try {
        const resposta = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
        }

        const dados = await resposta.json();
        console.log("✅ Dados do teste recebidos:", dados); 
        return dados;
    } catch (erro) {
        console.error("❌ Erro ao buscar detalhes do teste:", erro);
        alert('Erro ao carregar os detalhes do teste.');
        return null;
    }
}

function atualizarHTML(dados) {
    if (!dados) {
        alert("Erro ao carregar os detalhes do teste.");
        return;
    }

    document.querySelector('header h1').textContent = dados.titulo;
    document.querySelector('header p').textContent = `${dados.acertoGeral} de acerto`;
    document.querySelector('.creator-info p').textContent = `Criado por: ${dados.criador}`;

    const topicsElement = document.querySelector('.topics ul');
    if (dados.questoesComTopicos && dados.questoesComTopicos.length > 0) {
        const todosTopicos = dados.questoesComTopicos.flatMap(q => q.topicos);

        const topicosUnicos = [...new Set(todosTopicos)];

        topicsElement.innerHTML = topicosUnicos.map(topico => `<li>${topico}</li>`).join('');
    } else {
        topicsElement.textContent = 'Sem tópicos disponíveis.';
    }


    const itensDesempenho = document.querySelectorAll('.performance-item h3');
    itensDesempenho[0].textContent = `${dados.acertoGeral}`; 
    itensDesempenho[1].textContent = `${dados.totalResolucoes} tentativas`; 
    itensDesempenho[2].textContent = `${dados.minhaMaiorPontuacao} pontos`; 
    itensDesempenho[3].textContent = `${dados.rating || "N/A"} pontos`; 

    console.log("Minha maior pontuação:", dados.minhaMaiorPontuacao); 
}

function atualizarHTMLQuestao(dados) {
    if (!dados || !dados.pergunta || !dados.opcao_a || !dados.opcao_b) {
        console.error('❌ Dados inválidos para a questão:', dados);
        return;
    }

    document.querySelector('.question-number h2').textContent = `Questão 1`;
    document.querySelector('.question-body p').textContent = dados.pergunta;

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

    console.log("✅ Primeira questão renderizada.");
}

// CONFIGURAR BOTÃO "COMEÇAR"
function configurarBotaoComecar(testId, questoes) {
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
    const questaoPath = `${basePath}/questao.html`;

    if (!questoes || questoes.length === 0) {
        alert('Nenhuma questão encontrada para este teste.');
        return;
    }

    const primeiraQuestaoId = questoes[0].questao_id;
    console.log("➡️ Redirecionando para:", `${questaoPath}?testId=${testId}&questionId=${primeiraQuestaoId}`);

    document.querySelector('.start-button').addEventListener('click', () => {
        window.location.href = `${questaoPath}?testId=${testId}&questionId=${primeiraQuestaoId}`;
    });
}

// OBTER TEST ID DA URL
function obterTestId() {
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('id');

    // console.log("🔍 Test ID obtido:", testId); 

    if (!testId) {
        console.error("❌ Test ID não encontrado na URL!");
    }

    return testId;
}

// INICIALIZAR A PÁGINA
async function inicializarPagina() {
    try {
        console.log("🔄 Iniciando carregamento da página...");

        const testId = obterTestId();
        if (!testId) {
            alert('Teste não encontrado!');
            window.location.href = 'index.html';
            return;
        }

        // console.log("✅ Test ID obtido:", testId);
        localStorage.setItem('testId', testId); 

        console.log("🔍 Buscando detalhes do teste...");
        const dadosTeste = await buscarDetalhesTeste(testId);
        if (!dadosTeste) {
            console.error("❌ Nenhum dado retornado da API.");
            alert('Erro ao carregar os detalhes do teste.');
            return;
        }

        console.log("✅ Dados do teste carregados com sucesso.");
        atualizarHTML(dadosTeste);
        salvarIdsQuestoes(dadosTeste);

        console.log("⏳ Iniciando tentativa...");
        try {
            await iniciarTentativaECarregarProgresso(); 
            console.log("✅ Tentativa iniciada com sucesso.");
        } catch (erro) {
            console.error("❌ Erro ao iniciar tentativa:", erro);
            alert("Erro ao iniciar tentativa. Por favor, tente novamente.");
            return;
        }

        console.log("⏳ Carregando primeira questão...");
        try {
            await carregarPrimeiraQuestao(dadosTeste);
            console.log("✅ Primeira questão carregada com sucesso.");
        } catch (erro) {
            console.error("❌ Erro ao carregar primeira questão:", erro);
            alert("Erro ao carregar a primeira questão. Tente novamente.");
            return;
        }

        console.log("⚙️ Configurando botão 'Começar'...");
        configurarBotaoComecar(testId, dadosTeste.questoesComTopicos);
        console.log("✅ Página inicializada com sucesso.");

    } catch (erro) {
        console.error("❌ Erro inesperado na inicialização da página:", erro);
        alert('Erro ao carregar os detalhes do teste.');
    }
}
inicializarPagina();

// SALVAR QUESTÕES NO LOCALSTORAGE
function salvarIdsQuestoes(dados) {
    if (dados.questoesComTopicos && Array.isArray(dados.questoesComTopicos)) {
        const ids = dados.questoesComTopicos.map(q => q.questao_id);
        localStorage.setItem('idsQuestoes', JSON.stringify(ids));
    } else {
        console.error('❌ Nenhuma questão encontrada para o teste.');
    }
}

async function iniciarTentativaECarregarProgresso() {
    let userId = localStorage.getItem("user_id") || localStorage.getItem("userId");
    let testId = new URLSearchParams(window.location.search).get("testId") || localStorage.getItem('testId');

    console.log("🔍 Test ID dentro de iniciarTentativaECarregarProgresso:", testId);
    console.log("🔍 User ID dentro de iniciarTentativaECarregarProgresso:", userId);

    if (!userId || !testId) {
        console.error("❌ Erro: Parâmetros obrigatórios não encontrados.", { userId, testId });
        alert("Erro ao iniciar tentativa: Parâmetros obrigatórios ausentes.");
        return;
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
            console.error('Erro ao iniciar/retomar tentativa:', errorData.error);
            alert('Erro ao iniciar o teste. Tente novamente.');
            return;
        }

        const data = await response.json();
        if (!data || !data.attempt || !data.progress) {
            throw new Error('Dados inválidos recebidos do servidor.');
        }

        localStorage.setItem('tentativa_id', data.attempt.id);
        console.log("✅ Attempt ID salvo:", data.attempt.id);

    } catch (error) {
        console.error('Erro ao iniciar/retomar tentativa:', error);
        alert('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    }
}

async function carregarPrimeiraQuestao(dadosTeste) {
    if (!dadosTeste || !dadosTeste.questoesComTopicos || dadosTeste.questoesComTopicos.length === 0) {
        console.error("❌ Nenhuma questão encontrada.");
        return;
    }

    const primeiraQuestaoId = dadosTeste.questoesComTopicos[0].questao_id;
    console.log("📌 Primeira questão carregada:", primeiraQuestaoId);

    const apiKey = localStorage.getItem('apiKey');
    const url = `https://nefropapersapi.com/questoes/${primeiraQuestaoId}`;

    try {
        const resposta = await fetch(url, { headers: { 'X-API-KEY': apiKey } });
        if (!resposta.ok) throw new Error(`Erro ao buscar os dados da questão (ID: ${primeiraQuestaoId}).`);
        const dadosQuestao = await resposta.json();

        atualizarHTMLQuestao(dadosQuestao);

    } catch (erro) {
        console.error(`❌ Erro ao carregar primeira questão:`, erro.message);
    }
}
