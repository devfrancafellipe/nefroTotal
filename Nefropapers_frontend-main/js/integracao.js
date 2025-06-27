async function cadastrarUsuario(nome, email, senha) {
    try {
        const response = await fetch('https://nefropapersapi.com/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha })
        });
        const data = await response.json();
        if (data.error) {
            console.error('Erro ao cadastrar:', data.error);
            alert(`Erro ao cadastrar: ${data.error}`);
        } else {
            alert('E-mail de confirmação enviado. Verifique sua caixa de entrada.');
            window.location.href = 'index.html'; 
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao se conectar ao servidor. Verifique sua conexão.');
    }
}

const API_URL = 'https://nefropapersapi.com';

async function loginUsuario(email, senha) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Erro no login');

        localStorage.setItem('apiKey', data.apiKey);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('isLoggedIn', 'true');

        console.log('Login bem-sucedido:', data);

        window.location.href = 'index.html'; // Recarrega e chama o carregarDadosDoUsuario
    } catch (error) {
        console.error('Erro no login:', error.message);
        alert(`Erro: ${error.message}`);
    }
}

async function carregarDadosDoUsuario() {
    const apiKey = localStorage.getItem('apiKey');
    const userId = localStorage.getItem('userId');

    if (!apiKey || !userId) {
        console.warn('Usuário não logado ou API Key ausente.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            headers: { 'x-api-key': apiKey }
        });

        if (!response.ok) throw new Error('Erro ao buscar dados');

        const userData = await response.json();

        document.getElementById('dataUserName').innerText = userData.nome;
        document.getElementById('dataUserEmail').innerText = userData.email;
        document.getElementById('profileImageHome').src = userData.foto || 'assets/default-profile.png';

        console.log('Dados carregados:', userData);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}


async function carregarDadosDoUsuario() {
    const apiKey = localStorage.getItem('apiKey');
    const userId = localStorage.getItem('userId');

    if (!apiKey || !userId) {
        console.warn("Nenhuma chave API ou ID de usuário encontrado. Redirecionando para login...");
        return;
    }

    try {
        const response = await fetch(`https://nefropapersapi.com/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar dados do usuário.");
        }

        const userData = await response.json();

        document.getElementById('dataUserName').innerText = userData.nome;
        document.getElementById('dataUserEmail').innerText = userData.email;
        document.getElementById('profileImageHome').src = userData.foto || "assets/default-profile.png";

        console.log("Dados do usuário carregados com sucesso:", userData);

    } catch (error) {
        console.error("Erro ao carregar os dados do usuário:", error);
    }
}




// PÁGINA "Criar Questão"

let debounceTimeout;
// /////////////////////////////////////////////////////////////////////////////////////////

 function normalizeFileName(fileName) {
     return fileName
         .normalize('NFD') 
         .replace(/[\u0300-\u036f]/g, '') 
         .replace(/\s+/g, '_') 
         .replace(/[^a-zA-Z0-9_.-]/g, ''); 
}

// fileInput.addEventListener('change', async function(event) {
//     const file = event.target.files[0];
//     if (!file) return;

//     const normalizedFileName = normalizeFileName(file.name);
//     try {
//         const { data: uploadData, error: uploadError } = await supa.storage
//             .from('question_images')
//             .upload(`${normalizedFileName}`, file);

//         if (uploadError) {
//             console.error('Erro ao fazer upload do arquivo:', uploadError);
//             alert('Erro ao enviar o arquivo. Verifique o console para mais detalhes.');
//             return
//         }

//         const { data: publicUrlData } = supa.storage
//             .from('question_images')
//             .getPublicUrl(uploadData.path);

//         const arquivoUrl = publicUrlData.publicUrl; 
        
//     } catch (err) {
//         console.error('Erro ao fazer upload do arquivo:', err);
//         alert('Erro ao enviar o arquivo. Verifique o console para mais detalhes.');
//         return;
//     }
// });

async function criarQuestao(topicosSelecionados) {
    const apiKey = localStorage.getItem('apiKey');
    const SUPABASE_URL = 'https://cksxobvyqatzegoohqru.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrc3hvYnZ5cWF0emVnb29ocXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NjEyOTcsImV4cCI6MjA1MzMzNzI5N30.8v-rEmUQHBnpD6WlbJ_gocDlE4dwkg7QKf_ZfcMkLoc';
    const supa = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const pergunta = document.getElementById('textQuest').value.trim();
    const opcao_a = document.querySelector('.question input[name="A"]').value.trim();
    const opcao_b = document.querySelector('.question input[name="B"]').value.trim();
    const opcao_c = document.querySelector('.question input[name="C"]').value.trim();
    const opcao_d = document.querySelector('.question input[name="D"]').value.trim();
    const opcao_e = document.querySelector('.question input[name="E"]').value.trim();
    const resposta_correta = obterRespostaCorreta();
    const explicacao = document.querySelector('.explication-text').value.trim();
    const explicacaoInput = document.getElementById('explicacaoInput');
    const explicacaoFile = explicacaoInput.files[0];
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0]; 

    const respostasIncorretas = ['opcao_a', 'opcao_b', 'opcao_c', 'opcao_d', 'opcao_e'].filter(
        (opcao) => opcao !== resposta_correta
    );

    if (!pergunta) {
        alert('O campo "Pergunta" é obrigatório.');
        return;
    }
    if (!opcao_a || !opcao_b || !opcao_c || !opcao_d || !opcao_e) {
        alert('Todas as opções de resposta (A, B, C, D, E) devem ser preenchidas.');
        return;
    }
    if (!resposta_correta) {
        alert('Selecione a resposta correta.');
        return;
    }
    if (!topicosSelecionados || topicosSelecionados.length === 0) {
        alert('Selecione pelo menos um tópico.');
        return;
    }

    try {
        let imagemUrl = null;
        let explicacaoUrl = null;

        if (file) {
            const normalizedFileName = normalizeFileName(file.name);
            const { data: uploadData, error: uploadError } = await supa.storage
                .from('question_images')
                .upload(normalizedFileName, file);

            if (uploadError) {
                console.error('Erro ao fazer upload do arquivo:', uploadError);
                alert('Erro ao enviar o arquivo. Verifique o console para mais detalhes.');
                return;
            }

            const { data: publicUrlData } = await supa.storage
                .from('question_images')
                .getPublicUrl(uploadData.path);

            imagemUrl = publicUrlData.publicUrl;
        }

        if (explicacaoFile) {
            const normalizedExFileName = normalizeFileName(explicacaoFile.name);
            const { data: uploadData, error: uploadError } = await supa.storage
                .from('answer_explanation')
                .upload(normalizedExFileName, explicacaoFile);

            if (uploadError) {
                console.error('Erro ao fazer upload do arquivo:', uploadError);
                alert('Erro ao enviar o arquivo. Verifique o console para mais detalhes.');
                return;
            }

            const { data: publicUrlData } = await supa.storage
                .from('answer_explanation')
                .getPublicUrl(uploadData.path);

            explicacaoUrl = publicUrlData.publicUrl;
        }

        const payload = {
            pergunta,
            opcao_a,
            opcao_b,
            opcao_c,
            opcao_d,
            opcao_e,
            resposta_correta,
            respostas_incorretas: [opcao_a, opcao_b, opcao_c, opcao_d, opcao_e].filter(op => op !== resposta_correta),
            explicacao,
            imagem_url: imagemUrl,
            imagem_explicacao: explicacaoUrl,
            topicos: topicosSelecionados.map(topico => topico.id)
        };

        const response = await fetch('https://nefropapersapi.com/questoes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao criar questão.');
        }

        const data = await response.json();
        alert('Questão criada com sucesso!');
        window.location.href = 'https://nefropapersapp.com/admin.html';

        localStorage.removeItem('questoesGeradas');
        console.log('Resposta do servidor:', data);

        document.getElementById('textQuest').value = '';
        document.querySelectorAll('.question input[type="text"]').forEach(input => input.value = '');
        document.querySelector('.explication-text').value = '';
        document.querySelectorAll('.question input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
        document.querySelector('.categoria').innerHTML = '';
        fileInput.value = '';
    } catch (error) {
        console.error(error);
        alert(`Erro ao criar questão: ${error.message}`);
    }
}
///////////////////////////////////////////////////////////////////////////////
const topicosSelecionados = [];

function adicionarTopico(topico) {
    if (topicosSelecionados.length >= 3) {
        alert('Você pode selecionar no máximo 3 tópicos.');
        return;
    }

    if (topicosSelecionados.some((t) => t.id === topico.id)) {
        alert('Esse tópico já foi selecionado.');
        return;
    }

    topicosSelecionados.push(topico);

    const categoriaContainer = document.querySelector('.categoria');
    categoriaContainer.innerHTML = '';

    topicosSelecionados.forEach((topico) => {
        const group = document.createElement('div');
        group.classList.add('group');
        group.innerHTML = `
            <p>${topico.nome} <span class="remove-topico" data-id="${topico.id}"><i class='bx bx-x'></i></span></p>
        `;
        categoriaContainer.appendChild(group);

        const removeButton = group.querySelector('.remove-topico');
        removeButton.addEventListener('click', () => {
            topicosSelecionados.splice(topicosSelecionados.findIndex((t) => t.id === topico.id), 1);
            group.remove();
        });
    });
}

document.getElementById('searchTopico').addEventListener('keyup', (e) => {
    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(async () => {
        const searchTerm = e.target.value.trim();
        const apiKey = localStorage.getItem('apiKey');

        if (!apiKey) {
            alert('Você precisa estar logado para buscar tópicos.');
            return;
        }

        if (searchTerm === '') {
            document.getElementById('topicoSugestoes').innerHTML = '';  
            return;
        }

        try {
            const response = await fetch(`https://nefropapersapi.com/modulos/todos`, {
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Erro ao buscar tópicos.');

            const topicos = await response.json();
            const suggestionsContainer = document.getElementById('topicoSugestoes');
            suggestionsContainer.innerHTML = '';

            topicos.forEach((topico) => {
                const li = document.createElement('li');
                li.textContent = topico.nome;
                li.dataset.id = topico.id;
                li.addEventListener('click', () => adicionarTopico(topico));
                suggestionsContainer.appendChild(li);
            });
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro ao buscar tópicos.');
        }
    });
});

// =============== CODIGO VINDO DO FRONTEND 2 INTEGRAÇAO.JS ==============================


