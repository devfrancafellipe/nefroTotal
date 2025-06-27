// CARREGAR TESTES
async function carregarTestes(userId) {
    try {
        const response = await fetch(`https://nefropapersapi.com/simulados/${userId}`, {
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
        console.log('Dados carregados com sucesso:', dados);
        return dados;
    } catch (error) {
        console.error('Erro ao carregar os testes:', error);
        return null;
    }
}

// EXIBIR ÚLTIMO TESTE
// function exibirUltimoTeste(teste, containerSelector) {
//     const containerUltimoTeste = document.querySelector(containerSelector);
//     if (!containerUltimoTeste) {
//         console.error(`Container não encontrado para o seletor: ${containerSelector}`);
//         return;
//     }

    
//     if (teste && teste.status === "finalizado") {
//         const tituloLimitado = teste.titulo ? limitarTexto(teste.titulo, 12) : 'Título não disponível';
        
//         containerUltimoTeste.innerHTML = `
//             <div class="prime-teste">
//                 <h2>${tituloLimitado}</h2>
//                 <p>${teste.descricao || 'Descrição não disponível'}</p>
//             </div>
//             <div class="image-teste">
//                 <img src="${teste.imagem_url || 'https://provafacilnaweb.com.br/wp-content/uploads/2020/11/leitor-de-gabarito-de-provas-o-que-e-e-como-funciona-3-2048x1365-1.jpg'}" alt="Imagem do Teste ${tituloLimitado}">
//             </div>
//         `;

//         containerUltimoTeste.addEventListener('click', () => {
//             if (teste.id) {
//                 window.location.href = `detalhes.html?id=${teste.id}`;
//             }
//         });
//     } else {
//         containerUltimoTeste.innerHTML = `
//             <div class="prime-teste">
//                 <h2>Nenhum teste finalizado encontrado</h2>
//                 <p>Realize um teste para que ele apareça aqui.</p>
//             </div>
//         `;
//     }
// }

function exibirMeusTestes(testes, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error(`Container não encontrado para o seletor: ${containerSelector}`);
        return;
    }

    container.innerHTML = '';

    if (!testes || testes.length === 0) {
        container.innerHTML = '<p>Nenhum teste criado por você no momento.</p>';
        return;
    }

    let itemsVisiveis = 5; 
    const totalTestes = testes.length;

    const verMaisBtn = document.createElement('button');
    verMaisBtn.textContent = 'Ver mais';
    verMaisBtn.classList.add('ver-mais-btn');
    verMaisBtn.style.display = totalTestes > itemsVisiveis ? 'block' : 'none'; 

    function renderizarTestes() {
        container.innerHTML = '';

        testes.slice(0, itemsVisiveis).forEach((teste) => {
            const testeElement = document.createElement('div');
            testeElement.classList.add('historicos');

            const tituloLimitado = limitarTexto(teste.titulo, 12);
            const modulosHTML = limitarModulos(teste.topicos, 3);

            testeElement.innerHTML = `
                <div class="imgCurso">
                    <img src="${teste.imagem_url || 'https://provafacilnaweb.com.br/wp-content/uploads/2020/11/leitor-de-gabarito-de-provas-o-que-e-e-como-funciona-3-2048x1365-1.jpg'}" alt="Imagem do Teste ${teste.titulo}">
                </div>
                <div class="texts">
                    <h2>${tituloLimitado}</h2>
                    <div class="porcetagem">
                        <p>${teste.acertoGeral || '0'} % de acerto</p>
                    </div>
                    <div class="boxHomeTags">${modulosHTML}</div>
                </div>
                <div class="iconHeart">
                    <span><i class="fa-solid fa-heart ${teste.favorite ? 'select' : ''}" data-value="${teste.id}"></i></span>
                </div>
            `;

            testeElement.addEventListener('click', () => {
                window.location.href = `detalhes.html?id=${teste.id}`;
            });

            const heartRating = document.querySelectorAll('.fa-heart');
        heartRating.forEach((heart) => {
            heart.addEventListener('click', function (event) {
                event.stopPropagation();
                const isFavorited = this.classList.contains('select');
                this.classList.toggle('select'); 
                console.log(`Coração clicado. Favorito: ${!isFavorited}`);
            });
        });

            container.appendChild(testeElement);
        });

        if (itemsVisiveis < totalTestes) {
            container.appendChild(verMaisBtn);
        }
    }

    verMaisBtn.addEventListener('click', () => {
        itemsVisiveis += 5; 
        renderizarTestes(); 
    });

    renderizarTestes(); 
}


// EXIBIR TODOS OS TESTES
function exibirTodosOsTestes(testes, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error('Container não encontrado:', containerSelector);
        return;
    }

    container.innerHTML = ''; 

    if (!testes || testes.length === 0) {
        container.innerHTML = '<p>Nenhum teste disponível no momento.</p>';
        return;
    }

    testes.forEach((teste) => {
        const testeElement = document.createElement('div');
        testeElement.classList.add('boxHome');

        const tituloLimitado = limitarTexto(teste.titulo, 12);
        const modulosHTML = limitarModulos(teste.topicos, 3);

        testeElement.innerHTML = `
            <div class="imgCurso">
                <img src="${teste.imagem_teste || 'https://provafacilnaweb.com.br/wp-content/uploads/2020/11/leitor-de-gabarito-de-provas-o-que-e-e-como-funciona-3-2048x1365-1.jpg'}" alt="Imagem do Teste ${teste.titulo}">
            </div>
            <div class="boxHomeTexts">
                <h2>${tituloLimitado}</h2>
                <div class="boxHomePorcetagem">
                    <p>${teste.acertoGeral || '0'} % de acerto</p>
                </div>
                <div class="boxHomeTags">${modulosHTML}</div>
            </div>
            <div class="iconHeart">
                <span><i class="fa-solid fa-heart ${teste.favorite ? 'select' : ''}" data-value="${teste.id}"></i></span>
            </div>
        `;

        testeElement.addEventListener('click', () => {
            window.location.href = `detalhes.html?id=${teste.id}`;
        });

        container.appendChild(testeElement);
    });
}


// CARREGAR DESSEMPENHO DO USUÁRIO
async function carregarDesempenhoUsuario(apiKey) {
    try {
        const response = await fetch(`https://nefropapersapi.com/usuarios/desempenho`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao carregar desempenho do usuário. Status: ${response.status}`);
        }

        const desempenho = await response.json();
        console.log('Dados de desempenho carregados:', desempenho);

        document.querySelector('.rendimento .porcentagem').textContent = desempenho.rendimento || '0%';
        document.querySelector('.totalDeQuestoes .porcentagem').textContent = `${desempenho.totalQuestions || 0} Questões`;
        document.querySelector('.totalAcertos .porcentagem').textContent = `${desempenho.totalCorrectAnswers || 0} Questões`;
        document.querySelector('.totalErros .porcentagem').textContent = `${desempenho.totalErrors || 0} Questões`;

    } catch (error) {
        console.error('Erro ao carregar desempenho do usuário:', error.message);
        alert('Erro ao carregar o desempenho do usuário. Tente novamente.');
    }
}

// INICIALIZAR PÁGINA
async function initializePage() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const simulados = await carregarTestes(userId);
        if (!simulados) {
            console.error('Erro ao carregar os dados dos testes');
            return;
        }

        console.log('Dados recebidos da API:', simulados);

        if (document.querySelector('.userHome')) {
            if (simulados.ultimoTeste) {
                exibirUltimoTeste(simulados.ultimoTeste, '.homeTests .last-teste');
            }

            if (simulados.testesDisponiveis && simulados.testesDisponiveis.length > 0) {
                exibirTodosOsTestes(simulados.testesDisponiveis, '#testes-disponiveis');
            }
        }

    } catch (error) {
        console.error('Erro ao inicializar a página:', error);
    }
}



// LIMITE DE TEXTO
function limitarTexto(texto, limite) {
    if (!texto) return '';
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
}

// LIMITE DE MÓDULOS
function limitarModulos(topicos, limite = 2) {
    if (!topicos || topicos.length === 0) return '<span class="tag">Sem módulos</span>';

    const topicosUnicos = [...new Set(topicos)];
    const topicosLimitados = topicosUnicos.slice(0, limite = 2);
    const reticencias = topicosUnicos.length > limite ? '...' : '';

    return topicosLimitados.map(topico => `<span class="tag">${topico}</span>`).join('') + reticencias;
}

// INICIALIZAÇÃO
initializePage();
initialize()



async function carregarTestesFinais(userId) {
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

async function initialize() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const tentativasFinalizadas = await carregarTestesFinais(userId);
        if (!tentativasFinalizadas || tentativasFinalizadas.length === 0) {
            console.error('Nenhuma tentativa finalizada encontrada');
            return;
        }

        console.log('Tentativas finalizadas:', tentativasFinalizadas);

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

    } catch (error) {
        console.error('Erro ao inicializar a página:', error);
    }
}


async function carregarTentativasFinalizadas(userId) {
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
function exibirUltimoTeste(teste, containerSelector) {
    const containerUltimoTeste = document.querySelector(containerSelector);
    if (!containerUltimoTeste) {
        console.error(`Container não encontrado para o seletor: ${containerSelector}`);
        return;
    }

    const testeFormatado = {
        id: teste.id,
        titulo: teste.titulo,
        descricao: teste.descricao || 'Descrição não disponível',
        imagem_url: teste.imagem_url || 'https://provafacilnaweb.com.br/wp-content/uploads/2020/11/leitor-de-gabarito-de-provas-o-que-e-e-como-funciona-3-2048x1365-1.jpg',
        status: "finalizado",
        topicos: teste.modulos || [],
        porcentagemAcerto: teste.porcentagemAcerto || '0%'
    };

    const tituloLimitado = testeFormatado.titulo ? limitarTexto(testeFormatado.titulo, 12) : 'Título não disponível';
    
    containerUltimoTeste.innerHTML = `
        <div class="prime-teste">
            <h2>${tituloLimitado}</h2>
            <p>${testeFormatado.descricao}</p>
        </div>
        <div class="image-teste">
            <img src="${testeFormatado.imagem_url}" alt="Imagem do Teste ${tituloLimitado}">
        </div>
    `;

    containerUltimoTeste.addEventListener('click', () => {
        if (testeFormatado.id) {
            window.location.href = `detalhes.html?id=${testeFormatado.id}`;
        }
    });
}