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

        document.addEventListener("DOMContentLoaded", () => {
            const questionNumber = document.querySelector('.question-number h2');
            const questionBody = document.querySelector('.question-body p');

            if (questionNumber && questionBody) {
                atualizarHTMLQuestao(dadosQuestao);
            } else {
                console.error("❌ Elementos DOM não encontrados para atualizar.");
            }
        });

    } catch (erro) {
        console.error(`❌ Erro ao carregar primeira questão:`, erro.message);
    }
}
