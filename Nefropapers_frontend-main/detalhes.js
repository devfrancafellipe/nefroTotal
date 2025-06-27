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

function atualizarHTML(dados) {
    if (!dados) {
        alert("Erro ao carregar os detalhes do teste.");
        return;
    }

    const tituloHeader = document.querySelector('header h1');
    const descricaoHeader = document.querySelector('header p');
    const creatorInfo = document.querySelector('.creator-info p');
    const topicsElement = document.querySelector('.topics ul');
    const itensDesempenho = document.querySelectorAll('.performance-item h3');

    if (tituloHeader && descricaoHeader && creatorInfo) {
        tituloHeader.textContent = dados.titulo;
        descricaoHeader.textContent = `${dados.acertoGeral} de acerto`;
        creatorInfo.textContent = `Criado por: ${dados.criador}`;
    } else {
        console.error("Erro ao encontrar elementos DOM para atualizar.");
    }

    if (topicsElement) {
        if (dados.questoesComTopicos && dados.questoesComTopicos.length > 0) {
            const todosTopicos = dados.questoesComTopicos.flatMap(q => q.topicos);
            const topicosUnicos = [...new Set(todosTopicos)];

            topicsElement.innerHTML = topicosUnicos.map(topico => `<li>${topico}</li>`).join('');
        } else {
            topicsElement.textContent = 'Sem tópicos disponíveis.';
        }
    }

    if (itensDesempenho.length > 0) {
        itensDesempenho[0].textContent = `${dados.acertoGeral}`;
        itensDesempenho[1].textContent = `${dados.totalResolucoes} tentativas`;
        itensDesempenho[2].textContent = `${dados.minhaMaiorPontuacao} pontos`;
        itensDesempenho[3].textContent = `${dados.rating || "N/A"} pontos`;
    }
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

// SALVAR QUESTÕES NO LOCALSTORAGE
function salvarIdsQuestoes(dados) {
    if (dados.questoesComTopicos && Array.isArray(dados.questoesComTopicos)) {
        const ids = dados.questoesComTopicos.map(q => q.questao_id);
        localStorage.setItem('idsQuestoes', JSON.stringify(ids));
    } else {
        console.error('❌ Nenhuma questão encontrada para o teste.');
    }
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
