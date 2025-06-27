// const questions = {
//     questoes: "",
//     respostas: ["", "", "", "", ""],
//     correta: null,
//     explicaçao: "",
//     imagem: ""
// }

// const textArea = document.getElementById('textQuest')
// const questionInput = document.querySelectorAll('.input-question input')
// const questionSaveBtn = document.querySelector('.saveBtn button')
// const explicationText = document.querySelector('.explication-text')
// const switchCheck = document.querySelectorAll('.switch input')
// const divError = document.getElementById('msgError')


// const btnGabarito = document.querySelector('.gab-btn1')
// const btnImagen = document.querySelector('.gab-btn2')
// const modal = document.querySelector('.modal')
// // const overlay = document.querySelector('.overlay')
// const uploadImg = document.querySelector('.uploadImg')
// const editQuestion = document.querySelector(".edit-questao")
// const filterQuestion = document.querySelector('.filter-question')
// const divQuestions = document.querySelector('.questions')
// const subSection = document.querySelector(".subSection")
// const questionContainer = document.querySelector(".questionContainer")

// const overlayAdm = document.querySelector('.overlay');


// function Questao() {
//     questions.questoes = textArea.value
//     questionInput.forEach((input, index) => {
//         questions.respostas[index] = input.value
//     });
//     questions.explicaçao = explicationText.value

// }

// function respostaCorreta() {
//     switchCheck.forEach((switch_, index)  => {
//         switch_.addEventListener('change', ()=>{
//             if(switch_.checked){
//                 questions.correta= index

//                 switchCheck.forEach((restSwitch, restIndex) => {
//                     if(restIndex !== index) restSwitch.checked = false
//                 })
//             }else{
//                 questions.correta = null
//             }
//         })
//     })
// }

// function obterRespostaCorreta() {
//     const checkbox = document.querySelector('.question input[type="checkbox"]:checked');
//     if (checkbox) {
//         return `opcao_${checkbox.value.toLowerCase()}`;
//     }
//     return null; 
// }

// function validQuestion() {
//     if(questions.questoes.trim() === ''){
//         messageError('Por favor, insira o enuciado da questão.')
//         return false
//     }
//     if(questions.respostas.some( correta => correta.trim() === "")){
//         messageError('Preencha todas as opções de respostas.')
//         return false
//     }
//     if(questions.correta === null){
//         messageError('Selecione a reposta correta.')
//         return false
//     }
//     return true
// }

// function messageError(message, isSuccess = false){
//     divError.textContent = message;
//     divError.style.display = 'block'
//     setTimeout(() => {
//         divError.style.display = 'none'
//         if(!isSuccess) returnToScreen()
//     }, 3000)
// }

// function returnToScreen() {
//     editQuestion.style.display = 'flex';
//     divQuestions.style.display = 'flex';
//     filterQuestion.style.display = 'flex';
//     questionContainer.style.display = 'flex';
//     subSection.style.display = 'none';
// }


// questionSaveBtn.addEventListener('click', () =>{
//     Questao()
//     if(validQuestion()){
//         console.log('pergunta salva:', questions)

//         messageError('pergunta salva com sucesso')
//     }
// })

// respostaCorreta();

// btnGabarito.addEventListener('click', function(event){
//     event.preventDefault()

//     editQuestion.style.display = 'none'
//     divQuestions.style.display = 'none'
//     filterQuestion.style.display = 'none'
//     questionContainer.style.display = 'none'
//     subSection.style.display = 'flex'


// })

// // function togglePopup() {
// //     const isVisible = modal.style.display === 'flex';
// //     modal.style.display = isVisible ? 'none' : 'flex';
// //     overlay.style.display = isVisible ? 'none' : 'block';
// // }

// // modal.addEventListener('click', function(event){
// //     if(event.target === modal || event.target.classList.contains('overlay')) {
// //         togglePopup()
// //     }
// // })


// function showLoading() {
//     document.getElementById('loadingSpinner').style.display = 'block';
// }

// function hideLoading() {
//     document.getElementById('loadingSpinner').style.display = 'none';
// }

// function toggleModal() {
//     const modal = document.querySelector('.modalCreate');
//     modal.classList.toggle('show');
// }

// // window.onload = function() {
// //     const user = JSON.parse(localStorage.getItem('userData'));

// //     if (!user || user.nivel_acesso !== 'admin') {
// //         alert('Você não tem permissão para acessar esta página.');
// //         window.location.href = './home.html';
// //     }
// // };


// // window.onload = function() {
// //     const user = JSON.parse(localStorage.getItem('nivel_acesso'));
// //     console.log(user);
    
// //     if (!user || user.nivel_acesso !== 'admin') {
// //         alert('Você não tem permissão para acessar esta página.');
// //         window.location.href = './home.html'; 
// //     }
// // };
// window.onload = function () {
//     const nivelAcesso = localStorage.getItem('nivel_acesso');
    
//     if (!nivelAcesso || nivelAcesso !== 'admin') {
//         alert('Você não tem permissão para acessar esta página.');
//         window.location.href = './home.html'; 
//     }
// };



// // const modalEdit = document.querySelector('.modalEdit');
// // const modalContainer = document.querySelector('.containerEdit');
// // const editButton = document.querySelector('.editarQuestao');

// // // Abrir e fechar o modal
// // function openModal() {
// //     modalEdit.style.display = 'flex';
// // }

// // function closeModal() {
// //     modalEdit.style.display = 'none';
// // }

// // editButton.addEventListener('click', openModal);

// // // Fechar modal ao clicar fora do container
// // modalEdit.addEventListener('click', function(event) {
// //     if (event.target === modalEdit) {
// //         closeModal();
// //     }
// // });

// // // Função para buscar todas as questões
// // async function buscarQuestoes() {
// //     try {
// //         const resposta = await fetch(`https://nefropapersapi.com/questoes/todas`);
// //         if (resposta.ok) {
// //             const dados = await resposta.json();
// //             console.log("Questões carregadas:", dados);
// //             return dados;
// //         } else {
// //             console.error("Erro ao carregar as questões");
// //             return [];
// //         }
// //     } catch (erro) {
// //         console.error("Erro ao buscar questões:", erro);
// //         return [];
// //     }
// // }

// // // Quando o documento estiver carregado
// // document.addEventListener('DOMContentLoaded', function () {
// //     const modal = document.querySelector('.modalEdit');
// //     const modalContainer = document.querySelector('.containerEdit');
// //     const editButton = document.querySelector('.editarQuestao');

// //     // Conteúdo inicial do modal
// //     modalContainer.innerHTML = `
// //         <div class="modal-header">
// //             <div class="modal-title">Selecionar Questão</div>
// //             <button class="close-button">&times;</button>
// //         </div>
// //         <div class="search-container">
// //             <input type="text" id="filtro-topico" placeholder="Buscar por tópico..." class="filtro-input">
// //         </div>
// //         <div class="questoes-lista">
// //             <div class="loader"></div>
// //             <div class="questoes-container"></div>
// //         </div>
// //         <div class="modal-footer">
// //             <button class="cancel-btn">Fechar</button>
// //         </div>
// //     `;

// //     // Função para abrir o modal e carregar as questões
// //     async function openModal() {
// //         modal.style.display = 'flex';
// //         const questoesContainer = document.querySelector('.questoes-container');
// //         const loader = document.querySelector('.loader');

// //         questoesContainer.innerHTML = '';
// //         loader.style.display = 'block';

// //         const questoes = await buscarQuestoes();
// //         let questoesFiltradas = [...questoes];

// //         loader.style.display = 'none';

// //         function atualizarLista(filtroTopico = '') {
// //             const filtro = filtroTopico.toLowerCase().trim();
// //             const questoesFiltradasTopico = filtro
// //                 ? questoesFiltradas.filter(questao =>
// //                     questao.topicos.some(topico => topico.toLowerCase().includes(filtro))
// //                 )
// //                 : questoesFiltradas;

// //             const questoesHTML = questoesFiltradasTopico.map(questao => {
// //                 const textoLimitado = questao.pergunta ?
// //                     (questao.pergunta.length > 90 ?
// //                         questao.pergunta.substring(0, 90) + '...' :
// //                         questao.pergunta) :
// //                     'Sem pergunta';

// //                 return `
// //                     <div class="questao-item" data-id="${questao.id}">
// //                         <div class="questao-texto">${textoLimitado}</div>
// //                         <div class="questao-acoes">
// //                             <button class="btn-editar">Editar</button>
// //                             <button class="btn-excluir">Excluir</button>
// //                         </div>
// //                     </div>
// //                 `;
// //             }).join('');

// //             questoesContainer.innerHTML = questoesHTML || '<p>Nenhuma questão encontrada com esse tópico.</p>';

// //             // Adiciona eventos de clique aos itens da lista
// //             document.querySelectorAll('.questao-item').forEach(item => {
// //                 item.addEventListener('click', async function () {
// //                     const questaoId = this.getAttribute('data-id');
// //                     const questao = await buscarQuestaoPorId(questaoId);

// //                     if (questao) {
// //                         document.getElementById('textQuest').value = questao.pergunta || '';

// //                         const inputs = {
// //                             A: document.querySelector('input[name="A"]'),
// //                             B: document.querySelector('input[name="B"]'),
// //                             C: document.querySelector('input[name="C"]'),
// //                             D: document.querySelector('input[name="D"]'),
// //                             E: document.querySelector('input[name="E"]'),
// //                         };

// //                         inputs.A.value = questao.opcao_a || '';
// //                         inputs.B.value = questao.opcao_b || '';
// //                         inputs.C.value = questao.opcao_c || '';
// //                         inputs.D.value = questao.opcao_d || '';
// //                         inputs.E.value = questao.opcao_e || '';

// //                         document.querySelectorAll('.check-question input[type="checkbox"]').forEach(cb => {
// //                             cb.checked = false;
// //                             const letra = cb.value;
// //                             if (`opcao_${letra.toLowerCase()}` === questao.resposta_correta) {
// //                                 cb.checked = true;
// //                             }
// //                         });

// //                         document.querySelector('.explication-text').value = questao.explicacao || '';
// //                         closeModal();
// //                     }
// //                 });
// //             });
// //         }

// //         atualizarLista(); // Exibe todas as questões inicialmente

// //         // Filtro de tópicos
// //         document.getElementById('filtro-topico').addEventListener('input', function () {
// //             atualizarLista(this.value);
// //         });
// //     }

// //     // Abrir modal ao clicar no botão
// //     editButton.addEventListener('click', openModal);

// //     // Fechar modal pelos botões
// //     const closeButton = document.querySelector('.close-button');
// //     const cancelButton = document.querySelector('.cancel-btn');

// //     closeButton.addEventListener('click', closeModal);
// //     cancelButton.addEventListener('click', closeModal);

// //     // Fechar modal ao clicar fora do conteúdo
// //     modal.addEventListener('click', function (event) {
// //         if (event.target === modal) {
// //             closeModal();
// //         }
// //     });

// //     // Função para fechar modal
// //     function closeModal() {
// //         modal.style.display = 'none';
// //     }
// // });

// // // Função para buscar uma questão específica por ID
// // async function buscarQuestaoPorId(id) {
// //     try {
// //         const resposta = await fetch(`https://nefropapersapi.com/questoes/${id}`);
// //         if (resposta.ok) {
// //             return await resposta.json();
// //         } else {
// //             console.error("Erro ao buscar questão:", resposta.status);
// //             return null;
// //         }
// //     } catch (erro) {
// //         console.error("Erro ao buscar questão por ID:", erro);
// //         return null;
// //     }
// // }


// let questaoEditandoId = null;
// let questaoExcluirId = null;


// const modalDelete = document.querySelector('.modalConfirmDelete');
// const btnConfirmarDelete = document.querySelector('.btn-confirmar-delete');
// const btnCancelarDelete = document.querySelector('.btn-cancelar-delete');
// const mensagemDelete = document.querySelector('.mensagem-delete');

// const modalEdit = document.querySelector('.modalEdit');
// const modalContainer = document.querySelector('.containerEdit');
// const editButton = document.querySelector('.editarQuestao');

// function openModal() {
//     modalEdit.style.display = 'flex';
// }

// function closeModal() {
//     modalEdit.style.display = 'none';
//     questaoEditandoId = null; // resetar modo de edição
// }

// editButton.addEventListener('click', openModal);

// modalEdit.addEventListener('click', function(event) {
//     if (event.target === modalEdit) {
//         closeModal();
//     }
// });

// async function buscarQuestoes() {
//     try {
//         const resposta = await fetch(`https://nefropapersapi.com/questoes/todas`);
//         if (resposta.ok) {
//             return await resposta.json();
//         } else {
//             console.error("Erro ao carregar as questões");
//             return [];
//         }
//     } catch (erro) {
//         console.error("Erro ao buscar questões:", erro);
//         return [];
//     }
// }

// async function buscarQuestaoPorId(id) {
//     try {
//         const resposta = await fetch(`https://nefropapersapi.com/questoes/${id}`);
//         if (resposta.ok) {
//             return await resposta.json();
//         } else {
//             console.error("Erro ao buscar questão:", resposta.status);
//             return null;
//         }
//     } catch (erro) {
//         console.error("Erro ao buscar questão por ID:", erro);
//         return null;
//     }
// }

// async function atualizarQuestao(topicosSelecionados) {
//     if (!questaoEditandoId) return;

//     const pergunta = document.getElementById('textQuest').value;
//     const explicacao = document.querySelector('.explication-text').value;

//     const alternativas = {
//         A: document.querySelector('input[name="A"]').value,
//         B: document.querySelector('input[name="B"]').value,
//         C: document.querySelector('input[name="C"]').value,
//         D: document.querySelector('input[name="D"]').value,
//         E: document.querySelector('input[name="E"]').value,
//     };

//     const checkboxes = document.querySelectorAll('.check-question input[type="checkbox"]');
//     let respostaCorreta = null;
//     checkboxes.forEach(checkbox => {
//         if (checkbox.checked) {
//             respostaCorreta = `opcao_${checkbox.value.toLowerCase()}`;
//         }
//     });

//     const dadosAtualizados = {
//         pergunta: pergunta,
//         opcao_a: alternativas.A,
//         opcao_b: alternativas.B,
//         opcao_c: alternativas.C,
//         opcao_d: alternativas.D,
//         opcao_e: alternativas.E,
//         resposta_correta: respostaCorreta,
//         explicacao: explicacao,
//         topicos: topicosSelecionados
//     };

//     try {
//         const resposta = await fetch(`https://nefropapersapi.com/questoes/${questaoEditandoId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(dadosAtualizados)
//         });

//         if (resposta.ok) {
//             alert("Questão atualizada com sucesso!");
//             questaoEditandoId = null;
//         } else {
//             console.error("Erro ao atualizar questão:", await resposta.text());
//             alert("Erro ao atualizar a questão.");
//         }
//     } catch (erro) {
//         console.error("Erro ao enviar atualização:", erro);
//         alert("Erro ao enviar atualização.");
//     }
// }

// document.addEventListener('DOMContentLoaded', function () {
//     const modal = document.querySelector('.modalEdit');
//     const modalContainer = document.querySelector('.containerEdit');
//     const editButton = document.querySelector('.editarQuestao');

//     modalContainer.innerHTML = `
//         <div class="modal-header">
//             <div class="modal-title">Selecionar Questão</div>
//             <button class="close-button">&times;</button>
//         </div>
//         <div class="search-container">
//             <input type="text" id="filtro-topico" placeholder="Buscar por tópico..." class="filtro-input">
//         </div>
//         <div class="questoes-lista">
//             <div class="loader"></div>
//             <div class="questoes-container"></div>
//         </div>
//         <div class="modal-footer">
//             <button class="cancel-btn">Fechar</button>
//         </div>
//     `;

//     async function openModal() {
//         modal.style.display = 'flex';
//         const questoesContainer = document.querySelector('.questoes-container');
//         const loader = document.querySelector('.loader');

//         questoesContainer.innerHTML = '';
//         loader.style.display = 'block';

//         const questoes = await buscarQuestoes();
//         let questoesFiltradas = [...questoes];

//         loader.style.display = 'none';

//         function atualizarLista(filtroTopico = '') {
//             const filtro = filtroTopico.toLowerCase().trim();
//             const questoesFiltradasTopico = filtro
//                 ? questoesFiltradas.filter(questao =>
//                     questao.topicos.some(topico => topico.toLowerCase().includes(filtro))
//                 )
//                 : questoesFiltradas;

//             const questoesHTML = questoesFiltradasTopico.map(questao => {
//                 const textoLimitado = questao.pergunta ?
//                     (questao.pergunta.length > 90 ?
//                         questao.pergunta.substring(0, 90) + '...' :
//                         questao.pergunta) :
//                     'Sem pergunta';

//                 return `
//                     <div class="questao-item" data-id="${questao.id}">
//                         <div class="questao-texto">${textoLimitado}</div>
//                         <div class="questao-acoes">
//                             <button class="btn-editar">Editar</button>
//                             <button class="btn-excluir">Excluir</button>
//                         </div>
//                     </div>
//                 `;
//             }).join('');

//             questoesContainer.innerHTML = questoesHTML || '<p>Nenhuma questão encontrada com esse tópico.</p>';

//             document.querySelectorAll('.questao-item').forEach(item => {
//                 item.addEventListener('click', async function () {
//                     const questaoId = this.getAttribute('data-id');
//                     const questao = await buscarQuestaoPorId(questaoId);

//                     if (questao) {
//                         document.getElementById('textQuest').value = questao.pergunta || '';

//                         const inputs = {
//                             A: document.querySelector('input[name="A"]'),
//                             B: document.querySelector('input[name="B"]'),
//                             C: document.querySelector('input[name="C"]'),
//                             D: document.querySelector('input[name="D"]'),
//                             E: document.querySelector('input[name="E"]'),
//                         };

//                         inputs.A.value = questao.opcao_a || '';
//                         inputs.B.value = questao.opcao_b || '';
//                         inputs.C.value = questao.opcao_c || '';
//                         inputs.D.value = questao.opcao_d || '';
//                         inputs.E.value = questao.opcao_e || '';

//                         document.querySelectorAll('.check-question input[type="checkbox"]').forEach(cb => {
//                             cb.checked = false;
//                             const letra = cb.value;
//                             if (`opcao_${letra.toLowerCase()}` === questao.resposta_correta) {
//                                 cb.checked = true;
//                             }
//                         });

//                         document.querySelector('.explication-text').value = questao.explicacao || '';
//                         questaoEditandoId = questaoId; // marcando que estamos editando
//                         closeModal();
//                     }
//                 });
//             });
//             document.querySelectorAll('.btn-excluir').forEach(botao => {
//                 botao.addEventListener('click', function (e) {
//                     e.stopPropagation();
//                     const questaoId = this.closest('.questao-item').getAttribute('data-id');
//                     abrirModalDeletar(questaoId);
//                 });
//             });
//         }

//         atualizarLista();

//         document.getElementById('filtro-topico').addEventListener('input', function () {
//             atualizarLista(this.value);
//         });
//     }

//     editButton.addEventListener('click', openModal);

//     const closeButton = document.querySelector('.close-button');
//     const cancelButton = document.querySelector('.cancel-btn');

//     closeButton.addEventListener('click', closeModal);
//     cancelButton.addEventListener('click', closeModal);

//     modal.addEventListener('click', function (event) {
//         if (event.target === modal) {
//             closeModal();
//         }
//     });
// });

// // Botão de salvar (exemplo)
// document.querySelector('.btn-salvar').addEventListener('click', function () {
//     if (questaoEditandoId) {
//         atualizarQuestao(topicosSelecionados);
//     }
// });





// // Abre o modal de confirmação
// function abrirModalDeletar(id) {
//     questaoExcluirId = id;
//     mensagemDelete.textContent = "Deseja realmente excluir esta questão?";
//     modalDelete.style.display = 'flex';
//     console.log(questaoExcluirId)

// }

// // Fecha o modal
// function fecharModalDeletar() {
//     modalDelete.style.display = 'none';
//     questaoExcluirId = null;
// }

// // Executa exclusão
// btnConfirmarDelete.addEventListener('click', async () => {
//     if (!questaoExcluirId) return;
//     console.log(questaoExcluirId)

//     try {
//         const resposta = await fetch(`https://nefropapersapi.com/questoes/${questaoExcluirId}`, {
//             method: 'DELETE'
//         });

//         if (resposta.ok) {
//             mensagemDelete.textContent = "Questão deletada com sucesso!";
//             setTimeout(() => {
//                 fecharModalDeletar();
//                 document.querySelector('.editarQuestao').click(); 
//             }, 1500);
//         } else {
//             mensagemDelete.textContent = "Erro ao deletar a questão.";
//         }
//     } catch (erro) {
//         mensagemDelete.textContent = "Erro ao conectar com servidor.";
//     }
// });

// // Cancelar
// btnCancelarDelete.addEventListener('click', fecharModalDeletar);


const questions = {
    questoes: "",
    respostas: ["", "", "", "", ""],
    correta: null,
    explicaçao: "",
    imagem: ""
}

const textArea = document.getElementById('textQuest')
const questionInput = document.querySelectorAll('.input-question input')
const questionSaveBtn = document.querySelector('.saveBtn button')
const explicationText = document.querySelector('.explication-text')
const switchCheck = document.querySelectorAll('.switch input')
const divError = document.getElementById('msgError')


const btnGabarito = document.querySelector('.gab-btn1')
const btnImagen = document.querySelector('.gab-btn2')
const modal = document.querySelector('.modal')
// const overlay = document.querySelector('.overlay')
const uploadImg = document.querySelector('.uploadImg')
const editQuestion = document.querySelector(".edit-questao")
const filterQuestion = document.querySelector('.filter-question')
const divQuestions = document.querySelector('.questions')
const subSection = document.querySelector(".subSection")
const questionContainer = document.querySelector(".questionContainer")

const overlayAdm = document.querySelector('.overlay');


function Questao() {
    questions.questoes = textArea.value
    questionInput.forEach((input, index) => {
        questions.respostas[index] = input.value
    });
    questions.explicaçao = explicationText.value

}

function respostaCorreta() {
    switchCheck.forEach((switch_, index)  => {
        switch_.addEventListener('change', ()=>{
            if(switch_.checked){
                questions.correta= index

                switchCheck.forEach((restSwitch, restIndex) => {
                    if(restIndex !== index) restSwitch.checked = false
                })
            }else{
                questions.correta = null
            }
        })
    })
}

function obterRespostaCorreta() {
    const checkbox = document.querySelector('.question input[type="checkbox"]:checked');
    if (checkbox) {
        return `opcao_${checkbox.value.toLowerCase()}`;
    }
    return null; 
}

function validQuestion() {
    if(questions.questoes.trim() === ''){
        messageError('Por favor, insira o enuciado da questão.')
        return false
    }
    if(questions.respostas.some( correta => correta.trim() === "")){
        messageError('Preencha todas as opções de respostas.')
        return false
    }
    if(questions.correta === null){
        messageError('Selecione a reposta correta.')
        return false
    }
    return true
}

function messageError(message, isSuccess = false){
    divError.textContent = message;
    divError.style.display = 'block'
    setTimeout(() => {
        divError.style.display = 'none'
        if(!isSuccess) returnToScreen()
    }, 3000)
}

function returnToScreen() {
    editQuestion.style.display = 'flex';
    divQuestions.style.display = 'flex';
    filterQuestion.style.display = 'flex';
    questionContainer.style.display = 'flex';
    subSection.style.display = 'none';
}


questionSaveBtn.addEventListener('click', () =>{
    Questao()
    if(validQuestion()){
        console.log('pergunta salva:', questions)

        messageError('pergunta salva com sucesso')
    }
})

respostaCorreta();

btnGabarito.addEventListener('click', function(event){
    event.preventDefault()

    editQuestion.style.display = 'none'
    divQuestions.style.display = 'none'
    filterQuestion.style.display = 'none'
    questionContainer.style.display = 'none'
    subSection.style.display = 'flex'


})

// function togglePopup() {
//     const isVisible = modal.style.display === 'flex';
//     modal.style.display = isVisible ? 'none' : 'flex';
//     overlay.style.display = isVisible ? 'none' : 'block';
// }

// modal.addEventListener('click', function(event){
//     if(event.target === modal || event.target.classList.contains('overlay')) {
//         togglePopup()
//     }
// })


function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function toggleModal() {
    const modal = document.querySelector('.modalCreate');
    modal.classList.toggle('show');
}

// window.onload = function() {
//     const user = JSON.parse(localStorage.getItem('userData'));

//     if (!user || user.nivel_acesso !== 'admin') {
//         alert('Você não tem permissão para acessar esta página.');
//         window.location.href = './home.html';
//     }
// };


// window.onload = function() {
//     const user = JSON.parse(localStorage.getItem('nivel_acesso'));
//     console.log(user);
    
//     if (!user || user.nivel_acesso !== 'admin') {
//         alert('Você não tem permissão para acessar esta página.');
//         window.location.href = './home.html'; 
//     }
// };
window.onload = function () {
    const nivelAcesso = localStorage.getItem('nivel_acesso');
    
    if (!nivelAcesso || nivelAcesso !== 'admin') {
        alert('Você não tem permissão para acessar esta página.');
        window.location.href = './home.html'; 
    }
};



// const modalEdit = document.querySelector('.modalEdit');
// const modalContainer = document.querySelector('.containerEdit');
// const editButton = document.querySelector('.editarQuestao');

// // Abrir e fechar o modal
// function openModal() {
//     modalEdit.style.display = 'flex';
// }

// function closeModal() {
//     modalEdit.style.display = 'none';
// }

// editButton.addEventListener('click', openModal);

// // Fechar modal ao clicar fora do container
// modalEdit.addEventListener('click', function(event) {
//     if (event.target === modalEdit) {
//         closeModal();
//     }
// });

// // Função para buscar todas as questões
// async function buscarQuestoes() {
//     try {
//         const resposta = await fetch(`https://nefropapersapi.com/questoes/todas`);
//         if (resposta.ok) {
//             const dados = await resposta.json();
//             console.log("Questões carregadas:", dados);
//             return dados;
//         } else {
//             console.error("Erro ao carregar as questões");
//             return [];
//         }
//     } catch (erro) {
//         console.error("Erro ao buscar questões:", erro);
//         return [];
//     }
// }

// // Quando o documento estiver carregado
// document.addEventListener('DOMContentLoaded', function () {
//     const modal = document.querySelector('.modalEdit');
//     const modalContainer = document.querySelector('.containerEdit');
//     const editButton = document.querySelector('.editarQuestao');

//     // Conteúdo inicial do modal
//     modalContainer.innerHTML = `
//         <div class="modal-header">
//             <div class="modal-title">Selecionar Questão</div>
//             <button class="close-button">&times;</button>
//         </div>
//         <div class="search-container">
//             <input type="text" id="filtro-topico" placeholder="Buscar por tópico..." class="filtro-input">
//         </div>
//         <div class="questoes-lista">
//             <div class="loader"></div>
//             <div class="questoes-container"></div>
//         </div>
//         <div class="modal-footer">
//             <button class="cancel-btn">Fechar</button>
//         </div>
//     `;

//     // Função para abrir o modal e carregar as questões
//     async function openModal() {
//         modal.style.display = 'flex';
//         const questoesContainer = document.querySelector('.questoes-container');
//         const loader = document.querySelector('.loader');

//         questoesContainer.innerHTML = '';
//         loader.style.display = 'block';

//         const questoes = await buscarQuestoes();
//         let questoesFiltradas = [...questoes];

//         loader.style.display = 'none';

//         function atualizarLista(filtroTopico = '') {
//             const filtro = filtroTopico.toLowerCase().trim();
//             const questoesFiltradasTopico = filtro
//                 ? questoesFiltradas.filter(questao =>
//                     questao.topicos.some(topico => topico.toLowerCase().includes(filtro))
//                 )
//                 : questoesFiltradas;

//             const questoesHTML = questoesFiltradasTopico.map(questao => {
//                 const textoLimitado = questao.pergunta ?
//                     (questao.pergunta.length > 90 ?
//                         questao.pergunta.substring(0, 90) + '...' :
//                         questao.pergunta) :
//                     'Sem pergunta';

//                 return `
//                     <div class="questao-item" data-id="${questao.id}">
//                         <div class="questao-texto">${textoLimitado}</div>
//                         <div class="questao-acoes">
//                             <button class="btn-editar">Editar</button>
//                             <button class="btn-excluir">Excluir</button>
//                         </div>
//                     </div>
//                 `;
//             }).join('');

//             questoesContainer.innerHTML = questoesHTML || '<p>Nenhuma questão encontrada com esse tópico.</p>';

//             // Adiciona eventos de clique aos itens da lista
//             document.querySelectorAll('.questao-item').forEach(item => {
//                 item.addEventListener('click', async function () {
//                     const questaoId = this.getAttribute('data-id');
//                     const questao = await buscarQuestaoPorId(questaoId);

//                     if (questao) {
//                         document.getElementById('textQuest').value = questao.pergunta || '';

//                         const inputs = {
//                             A: document.querySelector('input[name="A"]'),
//                             B: document.querySelector('input[name="B"]'),
//                             C: document.querySelector('input[name="C"]'),
//                             D: document.querySelector('input[name="D"]'),
//                             E: document.querySelector('input[name="E"]'),
//                         };

//                         inputs.A.value = questao.opcao_a || '';
//                         inputs.B.value = questao.opcao_b || '';
//                         inputs.C.value = questao.opcao_c || '';
//                         inputs.D.value = questao.opcao_d || '';
//                         inputs.E.value = questao.opcao_e || '';

//                         document.querySelectorAll('.check-question input[type="checkbox"]').forEach(cb => {
//                             cb.checked = false;
//                             const letra = cb.value;
//                             if (`opcao_${letra.toLowerCase()}` === questao.resposta_correta) {
//                                 cb.checked = true;
//                             }
//                         });

//                         document.querySelector('.explication-text').value = questao.explicacao || '';
//                         closeModal();
//                     }
//                 });
//             });
//         }

//         atualizarLista(); // Exibe todas as questões inicialmente

//         // Filtro de tópicos
//         document.getElementById('filtro-topico').addEventListener('input', function () {
//             atualizarLista(this.value);
//         });
//     }

//     // Abrir modal ao clicar no botão
//     editButton.addEventListener('click', openModal);

//     // Fechar modal pelos botões
//     const closeButton = document.querySelector('.close-button');
//     const cancelButton = document.querySelector('.cancel-btn');

//     closeButton.addEventListener('click', closeModal);
//     cancelButton.addEventListener('click', closeModal);

//     // Fechar modal ao clicar fora do conteúdo
//     modal.addEventListener('click', function (event) {
//         if (event.target === modal) {
//             closeModal();
//         }
//     });

//     // Função para fechar modal
//     function closeModal() {
//         modal.style.display = 'none';
//     }
// });

// // Função para buscar uma questão específica por ID
// async function buscarQuestaoPorId(id) {
//     try {
//         const resposta = await fetch(`https://nefropapersapi.com/questoes/${id}`);
//         if (resposta.ok) {
//             return await resposta.json();
//         } else {
//             console.error("Erro ao buscar questão:", resposta.status);
//             return null;
//         }
//     } catch (erro) {
//         console.error("Erro ao buscar questão por ID:", erro);
//         return null;
//     }
// }


let questaoEditandoId = null;
let questaoExcluirId = null;
let atualizarLista;


const modalDelete = document.querySelector('.modalConfirmDelete');
const btnConfirmarDelete = document.querySelector('.btn-confirmar-delete');
const btnCancelarDelete = document.querySelector('.btn-cancelar-delete');
const mensagemDelete = document.querySelector('.mensagem-delete');

const modalEdit = document.querySelector('.modalEdit');
const modalContainer = document.querySelector('.containerEdit');
const editButton = document.querySelector('.editarQuestao');

function openModal() {
    modalEdit.style.display = 'flex';
}

function closeModal() {
    modalEdit.style.display = 'none';
    questaoEditandoId = null; // resetar modo de edição
}

editButton.addEventListener('click', openModal);

modalEdit.addEventListener('click', function(event) {
    if (event.target === modalEdit) {
        closeModal();
    }
});

async function buscarQuestoes() {
    try {
        const resposta = await fetch(`https://nefropapersapi.com/questoes/todas`);
        if (resposta.ok) {
            return await resposta.json();
        } else {
            console.error("Erro ao carregar as questões");
            return [];
        }
    } catch (erro) {
        console.error("Erro ao buscar questões:", erro);
        return [];
    }
}

async function buscarQuestaoPorId(id) {
    try {
        const resposta = await fetch(`https://nefropapersapi.com/questoes/${id}`);
        if (resposta.ok) {
            return await resposta.json();
        } else {
            console.error("Erro ao buscar questão:", resposta.status);
            return null;
        }
    } catch (erro) {
        console.error("Erro ao buscar questão por ID:", erro);
        return null;
    }
}

async function atualizarQuestao(topicosSelecionados) {
    if (!questaoEditandoId) return;

    const pergunta = document.getElementById('textQuest').value;
    const explicacao = document.querySelector('.explication-text').value;

    const alternativas = {
        A: document.querySelector('input[name="A"]').value,
        B: document.querySelector('input[name="B"]').value,
        C: document.querySelector('input[name="C"]').value,
        D: document.querySelector('input[name="D"]').value,
        E: document.querySelector('input[name="E"]').value,
    };

    const checkboxes = document.querySelectorAll('.check-question input[type="checkbox"]');
    let respostaCorreta = null;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            respostaCorreta = `opcao_${checkbox.value.toLowerCase()}`;
        }
    });

    const dadosAtualizados = {
        pergunta: pergunta,
        opcao_a: alternativas.A,
        opcao_b: alternativas.B,
        opcao_c: alternativas.C,
        opcao_d: alternativas.D,
        opcao_e: alternativas.E,
        resposta_correta: respostaCorreta,
        explicacao: explicacao,
        topicos: topicosSelecionados
    };

    try {
        const resposta = await fetch(`https://nefropapersapi.com/questoes/${questaoEditandoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (resposta.ok) {
            alert("Questão atualizada com sucesso!");
            questaoEditandoId = null;
        } else {
            console.error("Erro ao atualizar questão:", await resposta.text());
            alert("Erro ao atualizar a questão.");
        }
    } catch (erro) {
        console.error("Erro ao enviar atualização:", erro);
        alert("Erro ao enviar atualização.");
    }
}







function abrirModalDeletar(id) {
    questaoExcluirId = id;
    modalDelete.style.display = 'flex';
}

function fecharModalDeletar() {
    modalDelete.style.display = 'none';
    questaoExcluirId = null;
}

document.querySelectorAll('.btn-excluir').forEach(botao => {
    botao.addEventListener('click', function (e) {
        e.stopPropagation();
        const questaoId = this.closest('.questao-item').getAttribute('data-id');
        abrirModalDeletar(questaoId);
    });
});

btnConfirmarDelete.addEventListener('click', async () => {
    if (questaoExcluirId) {
        await excluirQuestao(questaoExcluirId);
        fecharModalDeletar();

        await buscarQuestoes();
        
    }
});

btnCancelarDelete.addEventListener('click', fecharModalDeletar);

modalDelete.addEventListener('click', (e) => {
    if (e.target === modalDelete) {
        fecharModalDeletar();
    }
});



document.addEventListener('DOMContentLoaded', function () {
    const modal = document.querySelector('.modalEdit');
    const modalContainer = document.querySelector('.containerEdit');
    const editButton = document.querySelector('.editarQuestao');
    const questoesContainer = document.querySelector('.questoes-container');

    let questoesFiltradas = [];

    modalContainer.innerHTML = `
        <div class="modal-header">
            <div class="modal-title">Selecionar Questão</div>
            <button class="close-button">&times;</button>
        </div>
        <div class="search-container">
            <input type="text" id="filtro-topico" placeholder="Buscar por tópico..." class="filtro-input">
        </div>
        <div class="questoes-lista">
            <div class="loader"></div>
            <div class="questoes-container"></div>
        </div>
        <div class="modal-footer">
            <button class="cancel-btn">Fechar</button>
        </div>
    `;

    atualizarLista = function(filtroTopico = '') {
        const filtro = filtroTopico.toLowerCase().trim();
        const questoesFiltradasTopico = filtro
            ? questoesFiltradas.filter(questao =>
                questao.topicos.some(topico => topico.toLowerCase().includes(filtro))
            )
            : questoesFiltradas;

        const questoesHTML = questoesFiltradasTopico.map(questao => {
            const textoLimitado = questao.pergunta ?
                (questao.pergunta.length > 90 ?
                    questao.pergunta.substring(0, 90) + '...' :
                    questao.pergunta) :
                'Sem pergunta';

            return `
                <div class="questao-item" data-id="${questao.id}">
                    <div class="questao-texto">${textoLimitado}</div>
                    <div class="questao-acoes">
                        <button class="btn-editar">Editar</button>
                        <button class="btn-excluir">Excluir</button>
                    </div>
                </div>
            `;
        }).join('');

        questoesContainer.innerHTML = questoesHTML || '<p>Nenhuma questão encontrada com esse tópico.</p>';

        document.querySelectorAll('.questao-item').forEach(item => {
            item.addEventListener('click', async function () {
                const questaoId = this.getAttribute('data-id');
                const questao = await buscarQuestaoPorId(questaoId);

                if (questao) {
                    document.getElementById('textQuest').value = questao.pergunta || '';

                    const inputs = {
                        A: document.querySelector('input[name="A"]'),
                        B: document.querySelector('input[name="B"]'),
                        C: document.querySelector('input[name="C"]'),
                        D: document.querySelector('input[name="D"]'),
                        E: document.querySelector('input[name="E"]'),
                    };

                    inputs.A.value = questao.opcao_a || '';
                    inputs.B.value = questao.opcao_b || '';
                    inputs.C.value = questao.opcao_c || '';
                    inputs.D.value = questao.opcao_d || '';
                    inputs.E.value = questao.opcao_e || '';

                    document.querySelectorAll('.check-question input[type="checkbox"]').forEach(cb => {
                        cb.checked = false;
                        const letra = cb.value;
                        if (`opcao_${letra.toLowerCase()}` === questao.resposta_correta) {
                            cb.checked = true;
                        }
                    });

                    document.querySelector('.explication-text').value = questao.explicacao || '';
                    questaoEditandoId = questaoId; // marcando que estamos editando
                    closeModal();
                }
            });
        });
        document.querySelectorAll('.btn-excluir').forEach(botao => {
            botao.addEventListener('click', function (e) {
                e.stopPropagation();
                const questaoId = this.closest('.questao-item').getAttribute('data-id');
                abrirModalDeletar(questaoId);
            });
        });
    }


    async function openModal() {
        modal.style.display = 'flex';
        const questoesContainer = document.querySelector('.questoes-container');
        const loader = document.querySelector('.loader');

        questoesContainer.innerHTML = '';
        loader.style.display = 'block';

        const questoes = await buscarQuestoes();
        questoesFiltradas = [...questoes];

        loader.style.display = 'none';

        function atualizarLista(filtroTopico = '') {
            const filtro = filtroTopico.toLowerCase().trim();
            const questoesFiltradasTopico = filtro
                ? questoesFiltradas.filter(questao =>
                    questao.topicos.some(topico => topico.toLowerCase().includes(filtro))
                )
                : questoesFiltradas;

            const questoesHTML = questoesFiltradasTopico.map(questao => {
                const textoLimitado = questao.pergunta ?
                    (questao.pergunta.length > 90 ?
                        questao.pergunta.substring(0, 90) + '...' :
                        questao.pergunta) :
                    'Sem pergunta';

                return `
                    <div class="questao-item" data-id="${questao.id}">
                        <div class="questao-texto">${textoLimitado}</div>
                        <div class="questao-acoes">
                            <button class="btn-editar">Editar</button>
                            <button class="btn-excluir">Excluir</button>
                        </div>
                    </div>
                `;
            }).join('');

            questoesContainer.innerHTML = questoesHTML || '<p>Nenhuma questão encontrada com esse tópico.</p>';

            document.querySelectorAll('.questao-item').forEach(item => {
                item.addEventListener('click', async function () {
                    const questaoId = this.getAttribute('data-id');
                    const questao = await buscarQuestaoPorId(questaoId);

                    if (questao) {
                        document.getElementById('textQuest').value = questao.pergunta || '';

                        const inputs = {
                            A: document.querySelector('input[name="A"]'),
                            B: document.querySelector('input[name="B"]'),
                            C: document.querySelector('input[name="C"]'),
                            D: document.querySelector('input[name="D"]'),
                            E: document.querySelector('input[name="E"]'),
                        };

                        inputs.A.value = questao.opcao_a || '';
                        inputs.B.value = questao.opcao_b || '';
                        inputs.C.value = questao.opcao_c || '';
                        inputs.D.value = questao.opcao_d || '';
                        inputs.E.value = questao.opcao_e || '';

                        document.querySelectorAll('.check-question input[type="checkbox"]').forEach(cb => {
                            cb.checked = false;
                            const letra = cb.value;
                            if (`opcao_${letra.toLowerCase()}` === questao.resposta_correta) {
                                cb.checked = true;
                            }
                        });

                        document.querySelector('.explication-text').value = questao.explicacao || '';
                        questaoEditandoId = questaoId;
                        closeModal();
                    }
                });
            });
            document.querySelectorAll('.btn-excluir').forEach(botao => {
                botao.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const questaoId = this.closest('.questao-item').getAttribute('data-id');
                    // excluirQuestao(questaoId);
                    abrirModalDeletar(questaoId);
                });
            });
        }

        atualizarLista();

        document.getElementById('filtro-topico').addEventListener('input', function () {
            atualizarLista(this.value);
        });
    }

    editButton.addEventListener('click', openModal);

    const closeButton = document.querySelector('.close-button');
    const cancelButton = document.querySelector('.cancel-btn');

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);

    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
});

async function excluirQuestao(id) {
    try {
        const resposta = await fetch(`https://nefropapersapi.com/questoes/${id}`, {
            method: 'DELETE',
        });
        if (!resposta.ok) throw new Error("Erro ao excluir");
        console.log("Questão excluída!");
    } catch (erro) {
        console.error("Falha na exclusão:", erro);
    }
}

document.querySelector('.btn-salvar').addEventListener('click', function () {
    if (questaoEditandoId) {
        atualizarQuestao(topicosSelecionados);
    }
});