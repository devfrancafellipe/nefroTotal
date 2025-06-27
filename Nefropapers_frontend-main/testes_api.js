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
                    <img src="${teste.imagem_teste || 'https://provafacilnaweb.com.br/wp-content/uploads/2020/11/leitor-de-gabarito-de-provas-o-que-e-e-como-funciona-3-2048x1365-1.jpg'}" alt="Imagem do Teste ${teste.titulo}">
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

        if (simulados.meusTestes && simulados.testesDisponiveis) {
            if (simulados.meusTestes.length > 0) {
                exibirMeusTestes(simulados.meusTestes, '#feitos-por-mim .all-histor');
            }

            if (simulados.testesDisponiveis.length > 0) {
                exibirTodosOsTestes(simulados.testesDisponiveis, '#todos-os-testes .all-histor');
            }
        }
    } catch (error) {
        console.error('Erro ao inicializar a página:', error);
    }
}

function configurarFiltroTestes() {
    const filterInput = document.querySelector('.filter-input input');
    const lupaIcon = document.querySelector('.filter-input .lupa');
    
    function filtrarTestesPorTopico(filtro) {
        const todosTestesContainer = document.querySelector('#todos-os-testes .all-histor');
        const meusTestesContainer = document.querySelector('#feitos-por-mim .all-histor');
        
        const todosTestes = todosTestesContainer.querySelectorAll('.boxHome, .historicos');
        const meusTestes = meusTestesContainer.querySelectorAll('.boxHome, .historicos');
        
        const filtroLower = filtro.toLowerCase().trim();
        
        function aplicarFiltro(elementos) {
            let algumVisivel = false;
            
            elementos.forEach(elemento => {
                const topicosElement = elemento.querySelector('.boxHomeTags');
                if (!topicosElement) {
                    elemento.style.display = 'none';
                    return;
                }
                
                const topicosText = topicosElement.textContent.toLowerCase();
                const corresponde = topicosText.includes(filtroLower);
                
                elemento.style.display = corresponde ? '' : 'none';
                if (corresponde) algumVisivel = true;
            });
            
            return algumVisivel;
        }
        
        const algumTesteVisivelTodos = aplicarFiltro(todosTestes);
        const algumTesteVisivelMeus = aplicarFiltro(meusTestes);

        if (!algumTesteVisivelTodos && !algumTesteVisivelMeus) {
            const mensagem = document.createElement('p');
            mensagem.textContent = 'Nenhum teste encontrado com esse tópico.';
            mensagem.style.textAlign = 'center';
            mensagem.style.margin = '20px 0';
            
            todosTestesContainer.appendChild(mensagem);
        } else {
            const mensagens = document.querySelectorAll('.all-histor p');
            mensagens.forEach(msg => {
                if (msg.textContent.includes('Nenhum teste encontrado')) {
                    msg.remove();
                }
            });
        }
        
        const verMaisBtn = document.querySelector('.ver-mais-btn');
        if (verMaisBtn) {
            verMaisBtn.style.display = 'block';
        }
    }
    
    if (filterInput && lupaIcon) {
        filterInput.addEventListener('input', function() {
            filtrarTestesPorTopico(this.value);
        });
        
        lupaIcon.addEventListener('click', function() {
            filtrarTestesPorTopico(filterInput.value);
        });
        
        filterInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filtrarTestesPorTopico(this.value);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    configurarFiltroTestes();
});

function limitarTexto(texto, limite) {
    if (!texto) return '';
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
}

function limitarModulos(topicos, limite = 2) {
    if (!topicos || topicos.length === 0) return '<span class="tag">Sem módulos</span>';

    const topicosUnicos = [...new Set(topicos)];
    const topicosLimitados = topicosUnicos.slice(0, limite = 2);
    const reticencias = topicosUnicos.length > limite ? '...' : '';

    return topicosLimitados.map(topico => `<span class="tag">${topico}</span>`).join('') + reticencias;
}


function toggleModal() {
    const modal = document.querySelector('.modalCreate');
    modal.classList.toggle('show');
}

// BARRA DE NAVEGAÇAO //
const navigation = document.querySelector('.navigation');

let scrollTop = 0

window.addEventListener("scroll", ()=>{
    const scroll = window.pageYOffset || document.documentElement.scroll;
    if(scroll > scrollTop){
        navigation.classList.add("hidden")
    }else{
        navigation.classList.remove("hidden")
    }
    scrollTop = scroll
})

document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll(".navigation ul li");
    const indicator = document.querySelector(".indicador");

    // Mapeia cada página ao seu respectivo ícone
    const pages = {
        "home.html": "house",
        "testes.html": "book",
        "historico.html": "clock"
    };

    // Obtém o nome do arquivo atual
    const path = window.location.pathname.split("/").pop();

    // Verifica se a página atual tem um ícone correspondente
    if (pages[path]) {
        // Remove a classe 'active' de todos os itens
        navItems.forEach(item => item.classList.remove("active"));

        // Encontra o ícone correspondente e adiciona a classe 'active'
        const activeItem = document.querySelector(`.${pages[path]}`);
        if (activeItem) {
            activeItem.classList.add("active");

            // Ajusta a posição do indicador
            updateIndicator(activeItem);
        }
    }

    // Função para atualizar a posição do indicador
    function updateIndicator(activeItem) {
        const navBar = document.querySelector(".navigation ul");
        const activeRect = activeItem.getBoundingClientRect();
        const navRect = navBar.getBoundingClientRect();

        // Calcula a posição exata do indicador
        const leftOffset = activeRect.left - navRect.left + (activeRect.width / 2) - (indicator.offsetWidth / 2);
        indicator.style.left = `${leftOffset}px`;
        indicator.style.transition = "left 0.3s ease-in-out";
    }

    // Atualiza o indicador ao redimensionar a janela
    window.addEventListener("resize", () => {
        const activeItem = document.querySelector(".navigation ul li.active");
        if (activeItem) {
            updateIndicator(activeItem);
        }
    });
});