async function carregarTestes(userId) {
    try {
        const response = await fetch(`https://nefropapersapi.com/usuarios/${userId}/tentativas/finalizadas`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`Erro na requisição: ${response.status}`);
            return null;
        }

        const dados = await response.json();
        if (!dados.finalizedAttempts) {
            console.error('Resposta da API não contém a lista de tentativas finalizadas');
            return null;
        }
        return dados.finalizedAttempts;
    } catch (error) {
        console.error('Erro ao carregar as tentativas finalizadas:', error);
        return null;
    }
}

async function carregarDetalhesTeste(testId) {
    try {
        const response = await fetch(`https://nefropapersapi.com/simulados/${testId}/detalhes`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`Erro ao carregar detalhes do teste: ${response.status}`);
            return null;
        }

        const dados = await response.json();
        if (!dados || !dados.titulo) {
            console.error('Dados do teste não encontrados');
            return null;
        }
        return dados;
    } catch (error) {
        console.error('Erro ao carregar detalhes do teste:', error);
        return null;
    }
}

async function exibirUltimoTesteFinalizado(userId) {
    const tentativasFinalizadas = await carregarTestes(userId);
    if (!tentativasFinalizadas || tentativasFinalizadas.length === 0) {
        console.error('Nenhuma tentativa finalizada encontrada');
        return;
    }

    console.log('Tentativas finalizadas:', tentativasFinalizadas);

    // Ordena as tentativas pela data de finalização e pega a última
    const ultimaTentativa = tentativasFinalizadas.sort((a, b) => new Date(b.dataFinalizacao) - new Date(a.dataFinalizacao))[0];

    if (ultimaTentativa) {
        const detalhesTeste = await carregarDetalhesTeste(ultimaTentativa.test_id);
        if (detalhesTeste) {
            exibirUltimoTeste(detalhesTeste, '.homeTests .last-teste');
        } else {
            console.error('Não foi possível carregar os detalhes do último teste');
        }
    } else {
        console.log('Nenhuma tentativa finalizada encontrada.');
    }
}
