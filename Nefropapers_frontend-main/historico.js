let periodoFiltro = 'Todos';
const opcoesPeriodo = {
    'Hoje': 1,
    'Ontem': 2,
    'Há menos de 1 semana': 7,
    'Há mais de 1 semana': 30,
    'Há mais de um mês': 31,
    'Todos': 0
};

// Função para calcular tempo decorrido 
function calcularTempoDecorrido(dataCriacao) {
    const agora = new Date();
    const data = new Date(dataCriacao);
    const diferenca = agora - data;

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    
    if (dias <= 0 ) {
        return "Hoje";
    } else if (dias === 1) {
        return "Ontem";
    } else if (dias < 7) {
        return `Há ${dias} dias`;
    } else if (dias < 30) {
        const semanas = Math.floor(dias / 7);
        return semanas === 1 ? "Há 1 semana" : `Há ${semanas} semanas`;
    } else {
        return "Há mais de um mês";
    }
}

function filtrarPorPeriodo(tentativas) {
    const agora = new Date();
    const hoje = new Date(agora);
    hoje.setHours(0, 0, 0, 0);
    
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    
    const umaSemanaAtras = new Date(hoje);
    umaSemanaAtras.setDate(hoje.getDate() - 7);
    
    const umMesAtras = new Date(hoje);
    umMesAtras.setDate(hoje.getDate() - 30);

    return tentativas.filter(tentativa => {
        const dataTentativa = new Date(tentativa.created_at);
        
        switch(periodoFiltro) {
            case 'Hoje':
                return dataTentativa >= hoje;
            case 'Ontem':
                return dataTentativa >= ontem && dataTentativa < hoje;
            case 'Há menos de 1 semana':
                return dataTentativa >= umaSemanaAtras && dataTentativa < ontem;
            case 'Há mais de 1 semana':
                return dataTentativa >= umMesAtras && dataTentativa < umaSemanaAtras;
            case 'Há mais de um mês':
                return dataTentativa < umMesAtras;
            default: 
                return true;
        }
    });
}

function configurarSearchList() {
    const searchSelect = document.getElementById('search-list');
    
    // Configurar evento de mudança
    searchSelect.addEventListener('change', (e) => {
        periodoFiltro = e.target.value;
        itemsVisiveis = 5;
        exibirTentativasComTestes(localStorage.getItem('userId'));
    });

    searchSelect.value = 'Todos';
}

let tentativasFinalizadas = [];
let itemsVisiveis = 5;

// async function exibirTentativasComTestes(userId) { 
//     if (tentativasFinalizadas.length === 0) {
//         tentativasFinalizadas = await carregarTestes(userId);
//         if (!tentativasFinalizadas) {
//             console.error('Nenhuma tentativa finalizada encontrada.');
//             return;
//         }
        
//         tentativasFinalizadas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//     }

//     const tentativasFiltradas = filtrarPorPeriodo(tentativasFinalizadas);
//     const container = document.querySelector('#historico .textResult'); 

//     if (!container) {
//         console.error('Container de tentativas não encontrado.');
//         return;
//     }

//     container.innerHTML = '';
//     const totalTentativas = tentativasFiltradas.length;

//     async function renderizarTentativas() {
//         container.innerHTML = '';
        
//         const header = document.createElement('div');
//         header.className = 'historico-header';
        
//         const titulo = document.createElement('p');
//         titulo.textContent = 'Últimos testes';
        
//         const filtroInfo = document.createElement('span');
//         filtroInfo.className = 'filtro-info';
//         filtroInfo.textContent = periodoFiltro === 'Todos' ? 'Todos os períodos' : `${periodoFiltro}`;
        
//         header.appendChild(titulo);
//         header.appendChild(filtroInfo);
//         container.appendChild(header);

//         if (totalTentativas === 0) {
//             const semResultados = document.createElement('p');
//             semResultados.className = 'sem-resultados';
//             semResultados.textContent = 'Nenhum resultado encontrado para este período.';
//             semResultados.style.color = 'red'
//             container.appendChild(semResultados);
//             return;
//         }

//         for (let i = 0; i < itemsVisiveis && i < totalTentativas; i++) {
//             const tentativa = tentativasFiltradas[i];
//             const testeDetalhes = await carregarDetalhesTeste(tentativa.test_id);
            
//             if (testeDetalhes) {
//                 const tentativaElement = document.createElement('div');
//                 tentativaElement.classList.add('historicos');

//                 const tituloLimitado = limitarTexto(testeDetalhes.titulo, 12);
//                 const imagemUrl = testeDetalhes.imagem_teste || 'https://provafacilnaweb.com.br/wp-content/uploads/2020/11/leitor-de-gabarito-de-provas-o-que-e-e-como-funciona-3-2048x1365-1.jpg';
//                 const tempoDecorrido = calcularTempoDecorrido(tentativa.created_at);

                
//                 tentativaElement.innerHTML = `
//                     <div class="imgCurso">
//                         <img src="${imagemUrl}" alt="Imagem do Teste ${testeDetalhes.titulo}">
//                     </div>
//                     <div class="texts">
//                         <div class="stars">
//                             <h2>${tituloLimitado}</h2>
//                             <span class="tempo-decorrido">${tempoDecorrido}</span>
//                         </div>
//                         <div class="porcetagem">
//                             <p>${tentativa.porcentagemAcerto || '0%'} de acerto</p>
                            
//                         </div>
//                     </div>
//                     <div class="iconHeart">
//                         <span><i class="fa-solid fa-heart" data-value="${tentativa.id}"></i></span>
//                     </div>
//                 `;

//                 container.appendChild(tentativaElement);
//             }
//         }

//         if (itemsVisiveis < totalTentativas) {
//             const verMaisBtn = document.createElement('button');
//             verMaisBtn.textContent = 'Ver mais';
//             verMaisBtn.classList.add('ver-mais-btn');
//             verMaisBtn.addEventListener('click', () => {
//                 itemsVisiveis += 5;
//                 renderizarTentativas();
//             });
//             container.appendChild(verMaisBtn);
//         }
//     }

//     renderizarTentativas();
// }

async function exibirTentativasComTestes(userId) { 
    if (tentativasFinalizadas.length === 0) {
        tentativasFinalizadas = await carregarTestes(userId);
        if (!tentativasFinalizadas) {
            console.error('Nenhuma tentativa finalizada encontrada.');
            return;
        }
        
        tentativasFinalizadas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const tentativasFiltradas = filtrarPorPeriodo(tentativasFinalizadas);
    const container = document.querySelector('#historico .textResult'); 

    if (!container) {
        console.error('Container de tentativas não encontrado.');
        return;
    }

    container.innerHTML = '';
    const totalTentativas = tentativasFiltradas.length;

    async function renderizarTentativas() {
        container.innerHTML = '';
        
        const header = document.createElement('div');
        header.className = 'historico-header';
        
        const titulo = document.createElement('p');
        titulo.textContent = 'Últimos testes';
        
        const filtroInfo = document.createElement('span');
        filtroInfo.className = 'filtro-info';
        filtroInfo.textContent = periodoFiltro === 'Todos' ? 'Todos os períodos' : `${periodoFiltro}`;
        
        header.appendChild(titulo);
        header.appendChild(filtroInfo);
        container.appendChild(header);

        if (totalTentativas === 0) {
            const semResultados = document.createElement('p');
            semResultados.className = 'sem-resultados';
            semResultados.textContent = 'Nenhum resultado encontrado para este período.';
            semResultados.style.color = 'red'
            container.appendChild(semResultados);
            return;
        }

        for (let i = 0; i < itemsVisiveis && i < totalTentativas; i++) {
            const tentativa = tentativasFiltradas[i];
            const testeDetalhes = await carregarDetalhesTeste(tentativa.test_id);
            
            if (testeDetalhes) {
                const tentativaElement = document.createElement('div');
                tentativaElement.classList.add('historicos');

                const tituloLimitado = limitarTexto(testeDetalhes.titulo, 12);
                const imagemUrl = testeDetalhes.imagem_teste || 'https://provafacilnaweb.com.br/wp-content/uploads/2020/11/leitor-de-gabarito-de-provas-o-que-e-e-como-funciona-3-2048x1365-1.jpg';
                const tempoDecorrido = calcularTempoDecorrido(tentativa.created_at);

                
                tentativaElement.innerHTML = `
                    <div class="imgCurso">
                        <img src="${imagemUrl}" alt="Imagem do Teste ${testeDetalhes.titulo}">
                    </div>
                    <div class="texts">
                        <div class="stars">
                            <h2>${tituloLimitado}</h2>
                            <span class="tempo-decorrido">${tempoDecorrido}</span>
                        </div>
                        <div class="porcetagem">
                            <p>${testeDetalhes.acertoGeral || '0'} % de acerto</p>
                        </div>
                    </div>
                    <div class="iconHeart">
                        <span><i class="fa-solid fa-heart" data-value="${tentativa.id}"></i></span>
                    </div>
                `;

                container.appendChild(tentativaElement);
            }
        }

        if (itemsVisiveis < totalTentativas) {
            const verMaisBtn = document.createElement('button');
            verMaisBtn.textContent = 'Ver mais';
            verMaisBtn.classList.add('ver-mais-btn');
            verMaisBtn.addEventListener('click', () => {
                itemsVisiveis += 5;
                renderizarTentativas();
            });
            container.appendChild(verMaisBtn);
        }
    }

    renderizarTentativas();
}


function limitarTexto(texto, limite) {
    if (!texto) return '';
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
}

function limitarModulos(topicos, limite = 3) {
    if (!topicos || topicos.length === 0) return '<span class="tag">Sem módulos</span>';

    const topicosUnicos = [...new Set(topicos)];
    const topicosLimitados = topicosUnicos.slice(0, limite);
    const reticencias = topicosUnicos.length > limite ? '...' : '';

    return topicosLimitados.map(topico => `<span class="tag">${topico}</span>`).join('') + reticencias;
}

async function initializePage() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'index.html'; 
        return;
    }

    configurarSearchList();
    await exibirTentativasComTestes(userId);
}

const navigation = document.querySelector('.navigation');
let scrollTop = 0;

window.addEventListener("scroll", () => {
    const scroll = window.pageYOffset || document.documentElement.scroll;
    if (scroll > scrollTop) {
        navigation.classList.add("hidden");
    } else {
        navigation.classList.remove("hidden");
    }
    scrollTop = scroll;
});

document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll(".navigation ul li");
    const indicator = document.querySelector(".indicador");

    const pages = {
        "home.html": "house",
        "testes.html": "book",
        "historico.html": "clock"
    };

    const path = window.location.pathname.split("/").pop();

    if (pages[path]) {
        navItems.forEach(item => item.classList.remove("active"));
        const activeItem = document.querySelector(`.${pages[path]}`);
        if (activeItem) {
            activeItem.classList.add("active");
            updateIndicator(activeItem);
        }
    }

    function updateIndicator(activeItem) {
        const navBar = document.querySelector(".navigation ul");
        const activeRect = activeItem.getBoundingClientRect();
        const navRect = navBar.getBoundingClientRect();
        const leftOffset = activeRect.left - navRect.left + (activeRect.width / 2) - (indicator.offsetWidth / 2);
        indicator.style.left = `${leftOffset}px`;
        indicator.style.transition = "left 0.3s ease-in-out";
    }

    window.addEventListener("resize", () => {
        const activeItem = document.querySelector(".navigation ul li.active");
        if (activeItem) {
            updateIndicator(activeItem);
        }
    });
});

// Iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    initializePage();  
});