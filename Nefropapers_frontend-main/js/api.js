    // CHAMANDO FUNÇÕES DE LOGIN & CADASTRO

    // document.querySelector('#form-Regist').addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     const nome = document.querySelector('#name').value.trim();
    //     const email = document.querySelector('#Email').value.trim();
    //     const senha = document.querySelector('#senha').value.trim();
        
    //     if (nome === '' || email === '' || senha === '') {
    //         alert('Por favor, preencha todos os campos antes de continuar.');
    //         return;
    //     }
        
    //     cadastrarUsuario(nome, email, senha);
    // });
    
    // document.querySelector('#form').addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     const email = document.querySelector('#inputEmail').value.trim();
    //     const senha = document.querySelector('#inputPass').value.trim();
        
    //     if (email === '' || senha === '') {
    //         alert('Por favor, preencha seu e-mail e senha.');
    //         return;
    //     }
        
    //     loginUsuario(email, senha);
    //     showScreen("home")
    //     console.log('Dados recebidos da API:', simulados);

    // });
    
    function obterRespostaCorreta() {
        const checkbox = document.querySelector('.question input[type="checkbox"]:checked');
        if (checkbox) {
            return `opcao_${checkbox.value.toLowerCase()}`;
        }
        return null; 
    }

    
        // PÁGINAS "Home" & "Todos os testes"

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

// async function initializePage() {
//     const userId = localStorage.getItem('userId');
//     if (!userId && !window.location.pathname === "/index.html") {
//         window.location.href = 'index.html';
//         return;
//     }

//     try {
//         const simulados = await carregarTestes(userId);
//         if (!simulados) {
//             console.error('Erro ao carregar os dados dos testes');
//             return;
//         }

//         console.log('Dados recebidos da API:', simulados);

//         if (document.querySelector('.userHome')) {
//             exibirUltimoTeste(simulados.ultimoTeste, '.homeTests .last-teste');
//             exibirTodosOsTestes(simulados.testesDisponiveis, '#testes-disponiveis');

//             console.log("Dados recebidos da API:", simulados);
//         }

//         if (document.querySelector('.all-tests')) {
//             exibirMeusTestes(simulados.meusTestes, '#feitos-por-mim .all-histor');
//             exibirTodosOsTestes(simulados.testesDisponiveis, '#todos-os-testes .all-histor');
//         }
//     } catch (error) {
//         console.error('Erro ao inicializar a página:', error);
//     }
// }


// function exibirUltimoTeste(teste, containerSelector) {
//     const containerUltimoTeste = document.querySelector(containerSelector);
//     if (!containerUltimoTeste) {
//         console.error(`Container não encontrado para o seletor: ${containerSelector}`);
//         return;
//     }

//     if (teste) {
//         const tituloLimitado = limitarTexto(teste.titulo, 12);
//         const modulosHTML = limitarModulos(teste.topicos, 3);

//         containerUltimoTeste.innerHTML = `
//             <div class="prime-teste">
//                 <h2>${tituloLimitado || 'Título não disponível'}</h2>
//                 <p>${teste.descricao || 'Descrição não disponível'}</p>
//             </div>
//             <div class="image-teste">
//                 <img src="${teste.imagem_url || 'https://provafacilnaweb.com.br/wp-content/uploads/2020/11/leitor-de-gabarito-de-provas-o-que-e-e-como-funciona-3-2048x1365-1.jpg'}" alt="Imagem do Teste ${teste.titulo}">
//             </div>
//         `;

//         containerUltimoTeste.addEventListener('click', () => {
//             window.location.href = `detalhes.html?id=${teste.id}`;
//         });
//     } else {
//         containerUltimoTeste.innerHTML = `
//             <div class="prime-teste">
//                 <h2>Nenhum teste recente encontrado</h2>
//                 <p>Realize um teste para que ele apareça aqui.</p>
//             </div>
//         `;
//     }
// }


function exibirUltimoTeste(teste, containerSelector) {
    const containerUltimoTeste = document.querySelector(containerSelector);
    if (!containerUltimoTeste) {
        console.error(`Container não encontrado para o seletor: ${containerSelector}`);
        return;
    }

    if (teste && teste.status === "finalizado") {
        // Verifica se teste existe e está finalizado
        const tituloLimitado = teste.titulo ? limitarTexto(teste.titulo, 12) : 'Título não disponível';
        
        containerUltimoTeste.innerHTML = `
            <div class="prime-teste">
                <h2>${tituloLimitado}</h2>
                <p>${teste.descricao || 'Descrição não disponível'}</p>
            </div>
            <div class="image-teste">
                <img src="${teste.imagem_url || 'https://provafacilnaweb.com.br/wp-content/uploads/2020/11/leitor-de-gabarito-de-provas-o-que-e-e-como-funciona-3-2048x1365-1.jpg'}" alt="Imagem do Teste ${tituloLimitado}">
            </div>
        `;

        containerUltimoTeste.addEventListener('click', () => {
            if (teste.id) {
                window.location.href = `detalhes.html?id=${teste.id}`;
            }
        });
    } else {
        containerUltimoTeste.innerHTML = `
            <div class="prime-teste">
                <h2>Nenhum teste finalizado encontrado</h2>
                <p>Realize um teste para que ele apareça aqui.</p>
            </div>
        `;
    }
}

async function initializePage() {
    const userId = localStorage.getItem('userId');
    if (!userId && window.location.pathname !== "/index.html") {
        window.location.href = 'index.html';
        return;
    }

    try {
        console.log("initializePage foi chamada!");
        const simulados = await carregarTestes(userId);
        if (!simulados) {
            console.error('Erro ao carregar os dados dos testes');
            return;
        }

        console.log('Dados recebidos da API:', simulados);

        if (document.querySelector('.userHome')) {
            // Vamos combinar todos os testes em um único array
            let todosTestes = [];
            
            if (simulados.meusTestes && simulados.meusTestes.length > 0) {
                todosTestes = todosTestes.concat(simulados.meusTestes);
            }
            
            if (simulados.testesDisponiveis && simulados.testesDisponiveis.length > 0) {
                todosTestes = todosTestes.concat(simulados.testesDisponiveis);
            }
            
            // Filtra apenas os testes finalizados
            const testesFinalizados = todosTestes.filter(teste => 
                teste.status === "finalizado"
            );
            
            let ultimoTesteExibir = null;
            
            if (testesFinalizados.length > 0) {
                // Ordena pelos testes mais recentes baseado no campo criado_em
                testesFinalizados.sort((a, b) => {
                    return new Date(b.criado_em) - new Date(a.criado_em);
                });
                
                // O primeiro teste após a ordenação é o mais recente
                ultimoTesteExibir = testesFinalizados[0];
                console.log('Último teste finalizado encontrado:', ultimoTesteExibir);
            }
            
            // Passa o último teste encontrado (ou null se não houver) para a função de exibição
            exibirUltimoTeste(ultimoTesteExibir, '.homeTests .last-teste');
            
            if (simulados.testesDisponiveis && simulados.testesDisponiveis.length > 0) {
                exibirTodosOsTestes(simulados.testesDisponiveis, '#testes-disponiveis');
            }
        }

        if (document.querySelector('.all-tests')) {
            exibirMeusTestes(simulados.meusTestes, '#feitos-por-mim .all-histor');
            exibirTodosOsTestes(simulados.testesDisponiveis, '#todos-os-testes .all-histor');
        }
    } catch (error) {
        console.error('Erro ao inicializar a página:', error);
    }
}


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
                <img src="${teste.imagem_url || 'https://provafacilnaweb.com.br/wp-content/uploads/2020/11/leitor-de-gabarito-de-provas-o-que-e-e-como-funciona-3-2048x1365-1.jpg'}" alt="Imagem do Teste ${teste.titulo}">
            </div>
            <div class="boxHomeTexts">
                <h2>${tituloLimitado}</h2>
                <div class="boxHomePorcetagem">
                    <p>${teste.porcentagemAcerto || '0%'} de acerto</p>
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

    console.log(`Testes exibidos em ${containerSelector}`);
}

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
                        <p>${teste.porcentagemAcerto || '0%'} de acerto</p>
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


function limitarModulos(topicos, limite = 2) {
    if (!topicos || topicos.length === 0) return '<span class="tag">Sem módulos</span>';

    const topicosUnicos = [...new Set(topicos)];

    const topicosLimitados = topicosUnicos.slice(0, limite = 2);
    const reticencias = topicosUnicos.length > limite ? '...' : '';

    return topicosLimitados.map(topico => `<span class="tag">${topico}</span>`).join('') + reticencias;
}

function limitarTexto(texto, limite) {
    if (!texto) return '';
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
}

initializePage();







function renderStars(rating = 0) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        starsHTML += `<span><i class="fa-solid fa-star ${i <= rating ? 'select' : ''}" data-value="${i}"></i></span>`;
    }
    return starsHTML;
}

function aplicarFuncionalidadeEstrelasECoracoes() {

    const starsRating = document.querySelectorAll('.fa-star');
    starsRating.forEach((star) => {
        star.addEventListener('click', function () {
            const ratingContainer = this.closest('.stars');
            const starValue = parseInt(this.getAttribute('data-value'), 10);
            ratingContainer.querySelectorAll('.fa-star').forEach((s, index) => {
                s.classList.toggle('select', index < starValue);
            });
            console.log(`Estrelas selecionadas: ${starValue}`);
        });
    });

    const heartRating = document.querySelectorAll('.fa-heart');
    heartRating.forEach((heart) => {
        heart.addEventListener('click', function () {
            const isFavorited = this.classList.contains('select');
            this.classList.toggle('select'); 
            console.log(`Coração clicado. Favorito: ${!isFavorited}`);
        });
    });
}

    // Termina AQUI  
    
function toggleModal() {
    const modal = document.querySelector('.modalCreate');
    if (modal) {
        modal.classList.toggle('active'); 
    } else {
        console.error("Elemento 'modalCreate' não encontrado.");
    }
}
    
document.addEventListener('DOMContentLoaded', () => {
    const creationIcon = document.querySelector('.creationIcon');
    if (creationIcon) {
        creationIcon.addEventListener('click', toggleModal);
    }
});
initializePage();

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


document.addEventListener("DOMContentLoaded", function () {
    const containerFeitosPorMim = document.querySelector("#feitos-por-mim .all-histor");
    const historicos = Array.from(containerFeitosPorMim.querySelectorAll(".historicos"));
    const verMaisBtn = document.createElement("button");
    let itemsVisiveis = 5; 

    function atualizarVisibilidade() {
        historicos.forEach((item, index) => {
            item.style.display = index < itemsVisiveis ? "flex" : "none";
        });

        if (itemsVisiveis >= historicos.length) {
            verMaisBtn.style.display = "none";
        }
    }

    verMaisBtn.textContent = "Ver mais";
    verMaisBtn.style.display = "block";
    verMaisBtn.style.margin = "10px auto";
    verMaisBtn.style.padding = "8px 12px";
    verMaisBtn.style.border = "none";
    verMaisBtn.style.background = "#FF8C00";
    verMaisBtn.style.color = "#FFF";
    verMaisBtn.style.cursor = "pointer";
    verMaisBtn.style.borderRadius = "5px";

    verMaisBtn.addEventListener("click", function () {
        itemsVisiveis += 5;
        atualizarVisibilidade();
    });

    containerFeitosPorMim.appendChild(verMaisBtn);
    atualizarVisibilidade();
});


