function toggleExpand(element) {
    const questionItem = element.parentElement; // Acessa a questão principal
    const expandedContent = questionItem.nextElementSibling; // Seleciona o conteúdo para expandir

    questionItem.classList.toggle('expanded'); // Adiciona a classe 'expanded' para girar a seta

    if (expandedContent.style.maxHeight) {
        expandedContent.style.maxHeight = null;
        expandedContent.style.opacity = 0;
    } else {
        expandedContent.style.maxHeight = expandedContent.scrollHeight + 'px';
        expandedContent.style.opacity = 1;
    }
}

// Função editar texto
document.getElementById('edit-icon').addEventListener('click', function() {
    const nomeTeste = document.getElementById('nome-teste');
    const isEditable = nomeTeste.contentEditable === "true";

    nomeTeste.contentEditable = !isEditable;
    nomeTeste.focus();
    this.textContent = isEditable ? 'edit' : '✔️'; // Troca ícone entre editar e confirmar
});

// Função Pop-up
// const testsButton = document.querySelector('.tests-button');
// const popupQuestion = document.getElementById('popup');

// testsButton.addEventListener('click', () => {
//     popupQuestion.style.display = 'flex'; 
// });

// popupQuestion.addEventListener('click', (e) => {
//     if (e.target === popupQuestion) {
//         popupQuestion.style.display = 'none'; 
//     }
// });

// document.getElementById('generateQuestionsBtn').addEventListener('click', function () {
//     const tagSelect = document.getElementById('tagSelect');
//     const questionCountInput = document.getElementById('questionCount');
//     const questionContainer = document.querySelector('.question-list'); // Div onde as questões serão adicionadas

//     const selectedTag = tagSelect.options[tagSelect.selectedIndex].text; // Texto da tag selecionada
//     const questionCount = parseInt(questionCountInput.value, 10);

//     // Verificar se os inputs são válidos
//     if (!selectedTag || isNaN(questionCount) || questionCount <= 0) {
//         alert('Por favor, selecione uma tag válida e insira um número de questões maior que zero.');
//         return;
//     }

//     // Verificar se a tag já existe na lista
//     const existingItem = Array.from(questionContainer.children).find(item => {
//         const title = item.querySelector('.question-title');
//         return title && title.textContent === selectedTag; // Comparar o título da tag
//     });

//     if (existingItem) {
//         // Atualizar a quantidade de questões se a tag já existir
//         const description = existingItem.querySelector('p');
//         description.textContent = `${questionCount} questõe${questionCount > 1 ? 's' : ''}`;
//     } else {
//         // Criar a div para a nova questão se ela ainda não existir
//         const questionItem = document.createElement('div');
//         questionItem.classList.add('question-item'); // Adiciona a classe para estilização

//         const questionData = document.createElement('div');
//         questionData.classList.add('question-data');

//         const checkbox = document.createElement('input');
//         checkbox.type = 'checkbox';
//         checkbox.classList.add('custom-checkbox');

//         const questionInfo = document.createElement('div');
//         questionInfo.classList.add('question-info');

//         const questionTitle = document.createElement('h3');
//         questionTitle.classList.add('question-title');
//         questionTitle.textContent = selectedTag;

//         const questionDescription = document.createElement('p');
//         questionDescription.textContent = `${questionCount} questõe${questionCount > 1 ? 's' : ''}`;

//         // Construir os elementos na hierarquia correta
//         questionInfo.appendChild(questionTitle);
//         questionInfo.appendChild(questionDescription);
//         questionData.appendChild(checkbox);
//         questionData.appendChild(questionInfo);
//         questionItem.appendChild(questionData);

//         // Adicionar o novo item ao container
//         questionContainer.appendChild(questionItem);
//     }
// });


// Função para mudar imagem

const editIcon = document.getElementById('edit-icon-img');
const imageUpload = document.getElementById('imageUpload');
const testImage = document.getElementById('testImage');
const backButton = document.querySelector(".back-button")

editIcon.addEventListener('click', function() {
    imageUpload.click(); 
});

imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0]; 

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            testImage.src = e.target.result; 
            testImage.style.borderRadius = "10px";
        }

        reader.readAsDataURL(file); 
    } else {
        alert('Por favor, selecione um arquivo de imagem válido.');
    }
});


// -*-*--*-*-*--*-**-*-*-*-*-*-**-**-*-*-*-*-*-*--*-*-*-*-*-*-*-*--*-*      INTEGRAÇÃO

async function carregarTopicos() {
    const url = 'https://nefropapersapi.com/modulos/todos';

    try {
        console.log(`Fazendo requisição para: ${url}`);
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Tópicos carregados com sucesso:', data);

        const selectTag = document.getElementById('tagSelect');

        if (!selectTag) {
            console.error('Elemento selectTag não encontrado');
            return;
        }

        let optionsHTML = '<option value="">Selecione uma Tag</option>';
        data.forEach(topico => {
            optionsHTML += `<option value="${topico.id}">${topico.nome}</option>`;
        });

        selectTag.innerHTML = optionsHTML;

        console.log('Tópicos exibidos no select com sucesso.');
    } catch (err) {
        console.error('Erro ao carregar tópicos:', err);
        alert(`Erro ao carregar tópicos: ${err.message}`);
    }
}

document.addEventListener("DOMContentLoaded", carregarTopicos);

const btnGerarQuestoes = document.getElementById('generateQuestionsBtn');
const selectTag = document.getElementById('tagSelect');
const inputQuantidade = document.getElementById('questionCount');



async function gerarQuestoes() {
    const topico = document.getElementById('tagSelect').value;
    const quantidade = parseInt(document.getElementById('questionCount').value);

    if (!topico || isNaN(quantidade) || quantidade <= 0) {
        alert('Selecione um tópico e insira uma quantidade válida de questões.');
        return;
    }

    const url = `https://nefropapersapi.com/simulados/${topico}/gerar-questoes-aleatorias`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                quantidade: quantidade, 
                idtopico: topico 
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao gerar questões');
        }

        const responseData = await response.json();
        
        // Modificação principal aqui:
        if (!responseData.questions || !Array.isArray(responseData.questions)) {
            throw new Error('Formato de resposta inválido da API');
        }

        console.log('Resposta completa:', responseData);
        console.log('Questões recebidas:', responseData.questions);
        
        // Modificado para enviar o array correto
        salvarQuestoesNoLocalStorage(responseData.questions.map(id => ({
            id: id,
            pergunta: `Questão ${id}`, // Adicione mais campos se necessário
            topico_id: topico
        })));
        
        alert(`${responseData.questions.length} questões geradas com sucesso!`);

    } catch (err) {
        console.error('Erro ao gerar questões:', err);
        alert(err.message || 'Erro ao gerar questões');
    }
}


function salvarQuestoesNoLocalStorage(questoes) {
    try {
        if (!questoes || !Array.isArray(questoes)) {
            throw new Error('Dados de questões inválidos');
        }

        const questoesExistentes = JSON.parse(localStorage.getItem('questoesGeradas')) || [];
        const novasQuestoes = [];

        questoes.forEach(questao => {
            if (!questao || !questao.id) {
                console.warn('Questão inválida ignorada:', questao);
                return;
            }

            const questaoExistente = questoesExistentes.find(q => q.id === questao.id);
            if (!questaoExistente) {
                novasQuestoes.push({
                    id: questao.id,
                    pergunta: questao.pergunta || 'Pergunta sem texto',
                    topico_id: questao.topico_id || null,
                    alternativas: questao.alternativas || []
                });
            }
        });

        if (novasQuestoes.length > 0) {
            const todasQuestoes = [...questoesExistentes, ...novasQuestoes];
            localStorage.setItem('questoesGeradas', JSON.stringify(todasQuestoes));
        }

    } catch (err) {
        console.error('Erro ao salvar questões:', err);
        throw err;
    }
}

function exibirQuestoes() {
    const questoes = JSON.parse(localStorage.getItem('questoesGeradas')) || [];

    const tópicos = {};
    questoes.forEach(questao => {
        if (!tópicos[questao.topico]) {
            tópicos[questao.topico] = 0;
        }
        tópicos[questao.topico] += 1;
    });

    const listaTópicos = document.querySelector('.tópicos-list');

    if (!listaTópicos) {
        console.error('Elemento listaTópicos não encontrado no DOM');
        return;
    }

    listaTópicos.innerHTML = '';

    for (let topico in tópicos) {
        const div = document.createElement('div');
        div.innerHTML = `${topico} - ${tópicos[topico]} questões`;
        listaTópicos.appendChild(div);
    }

    console.log('Tópicos e quantidades exibidos no frontend:', tópicos);
}

async function salvarQuestoesNoTeste(testId) {
    try {
        const questoes = JSON.parse(localStorage.getItem('questoesGeradas')) || [];
        
        console.log('Questões encontradas no localStorage:', questoes);

        if (questoes.length === 0) {
            throw new Error("Nenhuma questão encontrada para adicionar ao teste");
        }

        const questions = [...new Set(questoes.map(q => q.id))];
        const topicosMap = {};

        questoes.forEach(questao => {
            if (!questao.topico_id) {
                console.warn('Questão sem topico_id:', questao);
                return;
            }

            if (!topicosMap[questao.topico_id]) {
                topicosMap[questao.topico_id] = [];
            }
            topicosMap[questao.topico_id].push(questao.id);
        });

        console.log('Topicos mapeados:', topicosMap);

        const topicos = Object.entries(topicosMap).map(([idtopico, questionIds]) => ({
            idtopico,
            questionIds
        }));

        const payload = {
            questions,
            topicos
        };

        console.log('Enviando para API:', payload);

        const response = await fetch(`https://nefropapersapi.com/simulados/${testId}/questoes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": localStorage.getItem("apiKey") || ''
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Erro ao adicionar questões');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Operação não foi bem-sucedida');
        }

        localStorage.removeItem('questoesGeradas');
        alert("Teste criado e questões adicionadas com sucesso!");
        window.location.href = `/questao.html?testId=${testId}`;

    } catch (error) {
        console.error('Erro ao salvar questões:', error);
        alert(`Erro: ${error.message}`);
    }
}

async function criarTeste() { 
    const usuarioId = localStorage.getItem("userId");
    const IMAGEM_PADRAO_URL = 'https://cksxobvyqatzegoohqru.supabase.co/storage/v1/object/public/test_pictures/Test4.jpg';

    if (!usuarioId) {
        alert("ID do usuário não encontrado. Por favor, faça login novamente.");
        return null;
    }

    const tituloElement = document.querySelector("#nome-teste");
    if (!tituloElement || !tituloElement.innerText.trim()) {
        alert("Preencha o título do teste.");
        return null;
    }

    const titulo = tituloElement.innerText.trim();
    const descricaoElement = document.querySelector("textarea");
    const descricao = descricaoElement && descricaoElement.value.trim() ? descricaoElement.value.trim() : "Sem descrição";

    const testImageInput = document.getElementById('imageUpload');
    const testImageFile = testImageInput?.files[0];

    try {
        let imagemUrl = IMAGEM_PADRAO_URL;
        
        if (testImageFile) {
            const normalizedFileName = testImageFile.name
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '_')
                .replace(/[^a-zA-Z0-9_.-]/g, '');

            const SUPABASE_URL = 'https://cksxobvyqatzegoohqru.supabase.co';
            const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrc3hvYnZ5cWF0emVnb29ocXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NjEyOTcsImV4cCI6MjA1MzMzNzI5N30.8v-rEmUQHBnpD6WlbJ_gocDlE4dwkg7QKf_ZfcMkLoc';
            const supa = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

            const { data: uploadData, error: uploadError } = await supa.storage
                .from('test_pictures')
                .upload(normalizedFileName, testImageFile);

            if (uploadError) {
                console.error('Erro ao fazer upload:', uploadError);
                throw new Error('Erro ao enviar imagem');
            }

            const { data: publicUrlData } = await supa.storage
                .from('test_pictures')
                .getPublicUrl(uploadData.path);

            imagemUrl = publicUrlData.publicUrl;
        }

        const response = await fetch("https://nefropapersapi.com/simulados", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                titulo, 
                descricao, 
                criado_por: usuarioId,
                imagem_teste: imagemUrl 
            })
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Erro na resposta:', responseData);
            throw new Error(responseData.error || "Erro ao criar teste");
        }

        if (!responseData.testId) {
            throw new Error("ID do teste não recebido");
        }

        const testId = responseData.testId;
        console.log(`Teste criado com sucesso. ID do teste: ${testId}`);
        
        await salvarQuestoesNoTeste(testId);

        window.location.href = `detalhes.html?id=${testId}`;

        return testId;

    } catch (error) {
        console.error("Erro no criarTeste:", error);
        alert(`Erro ao criar teste: ${error.message}`);
        return null;
    }
}

document.querySelector(".save-button")?.addEventListener("click", async () => {
    const testId = await criarTeste();
    if (testId) {
    }
});



btnGerarQuestoes.addEventListener('click', gerarQuestoes);  



async function buscarQuantidadeQuestoesPorTag(topicoId) {
    try {
        const response = await fetch(`https://nefropapersapi.com/modulos/todos`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar tópicos e questões');
        }

        const data = await response.json();

        // Filtra o tópico específico pelo ID
        const topicoEncontrado = data.find(topico => topico.id === topicoId);

        if (!topicoEncontrado) {
            console.warn('Tópico não encontrado.');
            return 0;
        }

        return topicoEncontrado.questaoCount || 0;
    } catch (error) {
        console.error('Erro ao buscar quantidade de questões:', error);
        document.getElementById('questoesDisponiveis').textContent = 
            'Erro ao buscar quantidade de questões disponíveis';
        return null;
    }
    
}

document.getElementById('generateQuestionsBtn').addEventListener('click', async function () {
    const tagSelect = document.getElementById('tagSelect');
    const questionCountInput = document.getElementById('questionCount');
    const questionContainer = document.querySelector('.question-list');
    const messageContainer = document.getElementById('errorMessage'); // Criar um elemento para mensagens de erro

    const selectedTag = tagSelect.options[tagSelect.selectedIndex].text;
    const selectedTagId = tagSelect.value; // ID da tag selecionada
    const questionCount = parseInt(questionCountInput.value, 10);

    // Reset da mensagem de erro
    messageContainer.textContent = '';

    // Verificar se os inputs são válidos
    if (!selectedTag || isNaN(questionCount) || questionCount <= 0) {
        messageContainer.textContent = 'Por favor, selecione uma tag válida e insira um número de questões maior que zero.';
        return;
    }

    // Buscar a quantidade de questões disponíveis para a tag
    const quantidadeDisponivel = await buscarQuantidadeQuestoesPorTag(selectedTagId);

//  Se a quantidade solicitada for maior que a disponível, ajustar para o máximo possível
    let adjustedQuestionCount = questionCount;

    if (questionCount > quantidadeDisponivel) {
        adjustedQuestionCount = quantidadeDisponivel;
        messageContainer.textContent = `Quantidade ajustada para ${quantidadeDisponivel} questões, pois não há mais disponíveis.`;
    }

    // Verificar se a tag já existe na lista
    const existingItem = Array.from(questionContainer.children).find(item => {
        const title = item.querySelector('.question-title');
        return title && title.textContent === selectedTag;
    });

    if (existingItem) {
        // Atualizar a quantidade de questões se a tag já existir
        const description = existingItem.querySelector('p');
        description.textContent = `${adjustedQuestionCount} questõe${adjustedQuestionCount > 1 ? 's' : ''}`;
    } else {
        // Criar a div para a nova questão se ela ainda não existir
        const questionItem = document.createElement('div');
        questionItem.classList.add('question-item');

        const questionData = document.createElement('div');
        questionData.classList.add('question-data');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('custom-checkbox');

        const questionInfo = document.createElement('div');
        questionInfo.classList.add('question-info');

        const questionTitle = document.createElement('h3');
        questionTitle.classList.add('question-title');
        questionTitle.textContent = selectedTag;

        const questionDescription = document.createElement('p');
        questionDescription.textContent = `${adjustedQuestionCount} questõe${adjustedQuestionCount > 1 ? 's' : ''}`;

        // Construir os elementos na hierarquia correta
        questionInfo.appendChild(questionTitle);
        questionInfo.appendChild(questionDescription);
        questionData.appendChild(checkbox);
        questionData.appendChild(questionInfo);
        questionItem.appendChild(questionData);

        // Adicionar o novo item ao container
        questionContainer.appendChild(questionItem);
    }
});