// Variáveis globais
let questoesCarregadas = {};
let questaoAtual = 0;
let questoes = [];
let tentativaAtual = {
    id: localStorage.getItem('tentativaId'),
    testId: localStorage.getItem('testId'),
    userId: localStorage.getItem('userId'),
    questoesRespondidas: {}
};

let popupMostrado = false;
let ultimaQuestaoRespondida = false;

async function inicializarPagina() {
    const testId = obterTestId();
    
    try {
        const tentativa = await iniciarTentativaECarregarProgresso(testId);
        if (tentativa) {
            tentativaAtual.id = tentativa.tentativaId;
            localStorage.setItem('tentativaId', tentativa.tentativaId);
        }

        const questaoIds = await buscarQuestaoIdsPorTeste(testId);
        if (questaoIds.length > 0) {
            questoes = questaoIds;
            await carregarRespostasExistentes();
            carregarEExibirQuestaoAtual();
            configurarNavegacao();
            configurarPopups();
        }
    } catch (erro) {
        console.error('Erro na inicialização:', erro);
        alert('Erro ao carregar o teste. Tente novamente.');
        window.location.href = 'index.html';
    }
}

function obterTestId() {
    let testId = localStorage.getItem('testId');
    if (!testId) {
        const urlParams = new URLSearchParams(window.location.search);
        testId = urlParams.get('testId');
    }
    return testId;
}

document.querySelector('.back-arrow').addEventListener('click', () => {
    const testId = localStorage.getItem('testId') || obterTestId();
    const userId = localStorage.getItem('userId');
    if (testId && userId) {
        // window.location.href = `./detalhes.html?testId=${testId}&userId=${userId}`;
        window.location.href = `./detalhes.html?id=${testId}`;
    }
});

function exibirQuestao(dados) {
    if (!dados) {
        console.error('Dados da questão inválidos:', dados);
        return;
    }

    const questionNumber = document.querySelector('.question-header h2');
    if (questionNumber) {
        questionNumber.textContent = `Questão ${questaoAtual + 1}`;
    }

    const questionBody = document.querySelector('.question-body p');
    if (questionBody) {
        questionBody.textContent = dados.pergunta;
    }
    document.querySelector('#expand-popup .question-body p').textContent = dados.pergunta;

    const alternativas = ['A', 'B', 'C', 'D', 'E'];
    alternativas.forEach(letra => {
        const opcao = dados[`opcao_${letra.toLowerCase()}`];
        const elemento = document.querySelector(`.answer button[data-answer="${letra}"]`);

        if (!elemento && opcao) {
            const newAnswerDiv = document.createElement('div');
            newAnswerDiv.classList.add('answer');
            
            const newButton = document.createElement('button');
            newButton.classList.add('option-button');
            newButton.dataset.answer = letra;
            newButton.textContent = letra;

            const newPara = document.createElement('p');
            newAnswerDiv.appendChild(newButton);
            newAnswerDiv.appendChild(newPara);

            document.querySelector('.answers').appendChild(newAnswerDiv);

            console.log(`Nova opção ${letra} criada no DOM:`, newButton);

            const buttonOrParaElements = [newButton, newPara];
            buttonOrParaElements.forEach(element => {
                element.addEventListener('click', (e) => {
                    console.log('Botão clicado:', e.target.textContent);
                    const questaoId = questoes[questaoAtual].id;
                    if (tentativaAtual.questoesRespondidas[questaoId]) return;

                    const answerDiv = e.target.closest('.answer');
                    if (!answerDiv) return;

                    document.querySelectorAll('.answer').forEach(div => {
                        div.classList.remove('selected');
                    });

                    answerDiv.classList.add('selected');

                    const responderBtn = document.querySelector('.submit-button');
                    responderBtn.disabled = false;
                    responderBtn.style.backgroundColor = '#282828';
                    responderBtn.style.color = '#FFFFFF';
                    responderBtn.classList.add('active');
                });
            });

            const novoElemento = document.querySelector(`.answer button[data-answer="${letra}"]`);
            novoElemento.nextElementSibling.textContent = opcao;
        } else if (elemento && opcao) {
            elemento.nextElementSibling.textContent = opcao;
        }
    });

    const imageButton = document.querySelector('.image-button');
    const popupImage = document.getElementById('popup-image');
    const popupImg = document.querySelector('.popup-img');

    if (dados.imagem_url) { 
        imageButton.style.display = 'flex';
        imageButton.addEventListener('click', () => {
            popupImg.src = dados.imagem_url; 
            popupImage.style.display = 'flex';
        });

        popupImage.addEventListener('click', (e) => {
            if (e.target === popupImage) {
                popupImage.style.display = 'none';
            }
        });
    } else {
        imageButton.style.display = 'none';
    }

    aplicarFeedbackPermanente(dados.id);

    const questaoRespondida = tentativaAtual.questoesRespondidas[dados.id];
    document.querySelector('.submit-button').disabled = questaoRespondida;
    document.querySelector('.question-button').disabled = !questaoRespondida;
}



// function exibirQuestao(dados) {
//     if (!dados) {
//         console.error('Dados da questão inválidos:', dados);
//         return;
//     }

//     const questionNumber = document.querySelector('.question-header h2');
//     if (questionNumber) {
//         questionNumber.textContent = `Questão ${questaoAtual + 1}`;
//     }

//     const questionBody = document.querySelector('.question-body p');
//     if (questionBody) {
//         questionBody.textContent = dados.pergunta;
//     }
//     document.querySelector('#expand-popup .question-body p').textContent = dados.pergunta;

//     const alternativas = ['A', 'B', 'C', 'D', 'E'];
//     alternativas.forEach(letra => {
//         const opcao = dados[`opcao_${letra.toLowerCase()}`];
//         const elemento = document.querySelector(`.answer button[data-answer="${letra}"]`);

//         if (!elemento && opcao) {
//             const newAnswerDiv = document.createElement('div');
//             newAnswerDiv.classList.add('answer');
//             const newButton = document.createElement('button');
//             newButton.classList.add('option-button');
//             newButton.dataset.answer = letra;
//             newButton.textContent = letra;

//             const newPara = document.createElement('p');
//             newAnswerDiv.appendChild(newButton);
//             newAnswerDiv.appendChild(newPara);

//             document.querySelector('.answers').appendChild(newAnswerDiv);

//             console.log(`Nova opção ${letra} criada no DOM:`, newButton);


//             const novoElemento = document.querySelector(`.answer button[data-answer="${letra}"]`);
//             novoElemento.nextElementSibling.textContent = opcao;
//         } else if (elemento && opcao) {
//             elemento.nextElementSibling.textContent = opcao;
//         }
//     });

//     const imageButton = document.querySelector('.image-button');
//     const popupImage = document.getElementById('popup-image');
//     const popupImg = document.querySelector('.popup-img');

//     if (dados.imagem_url) { 
//         imageButton.style.display = 'flex';
//         imageButton.addEventListener('click', () => {
//             popupImg.src = dados.imagem_url; 
//             popupImage.style.display = 'flex';
//         });

//         popupImage.addEventListener('click', (e) => {
//             if (e.target === popupImage) {
//                 popupImage.style.display = 'none';
//             }
//         });
//     } else {
//         imageButton.style.display = 'none';
//     }

//     aplicarFeedbackPermanente(dados.id);

//     const questaoRespondida = tentativaAtual.questoesRespondidas[dados.id];
//     document.querySelector('.submit-button').disabled = questaoRespondida;
//     document.querySelector('.question-button').disabled = !questaoRespondida;
// }


function configurarNavegacao() {
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    
    prevButton.addEventListener('click', navegarParaQuestaoAnterior);
    nextButton.addEventListener('click', navegarParaProximaQuestao);
    
    atualizarBotoesNavegacao();
}

function navegarParaQuestaoAnterior() {
    if (questaoAtual > 0) {
        questaoAtual--;
        carregarEExibirQuestaoAtual();
    }
}

function navegarParaProximaQuestao() {
    if (questaoAtual < questoes.length - 1) {
        questaoAtual++;
        carregarEExibirQuestaoAtual();
    }
}

function atualizarBotoesNavegacao() {
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    
    prevButton.disabled = questaoAtual === 0;
    nextButton.disabled = questaoAtual === questoes.length - 1;
    
    atualizarProgresso();
}

// Barra de progresso
function atualizarProgresso() {
    const progressBar = document.querySelector('#progress-bar');
    const progressText = document.querySelector('#progress-text');
    
    if (progressBar && progressText) {
        progressBar.max = questoes.length;
        progressBar.value = questaoAtual + 1;
        progressText.textContent = `Questão ${questaoAtual + 1} de ${questoes.length}`;
        
        const progresso = ((questaoAtual) / (questoes.length - 1)) * 100;
        progressBar.style.setProperty('--progress-percent', `${progresso}%`);
    }
}

// Configuração de popups
function configurarPopups() {
    // Popup de gabarito
    const questionButton = document.querySelector('.question-button');
    const popupGabarito = document.getElementById('popup-gabarito');

    questionButton.addEventListener('click', async () => {
        const questaoId = questoes[questaoAtual].id;
        const questao = questoesCarregadas[questaoId];
        
        if (!questao) return;
        
        popupGabarito.querySelector('.explanation-content p').textContent = questao.explicacao || 'Explicação não disponível';
        popupGabarito.style.display = 'flex';

        const popupLarge = document.getElementById('popup-large-image');
        const openPopupLargeButton = document.getElementById('detailed-response'); 
        const closePopupLargeButton = document.getElementById('close-popup-large'); 
        const explicacaoImg = document.querySelector('.gabarito-img');
        
        const explicacaoUrl = questao.imagem_explicacao;
        
        if (explicacaoUrl) { 
            openPopupLargeButton.style.display = 'flex';
            openPopupLargeButton.addEventListener('click', () => {
                explicacaoImg.src = questao.imagem_explicacao; 
                popupLarge.style.display = 'flex';
        
                explicacaoImg.addEventListener('click', function () {
                    this.classList.toggle('zoom');
                });
            });
        
            closePopupLargeButton.addEventListener('click', () => {
                popupLarge.style.display = 'none'; 
            });
        } else {
            openPopupLargeButton.style.display = 'none';
            console.log("Não tem explicacao imagem");
        }
        
    });

    popupGabarito.addEventListener('click', (e) => {
        if (e.target === popupGabarito) {
            popupGabarito.style.display = 'none';
        }
    });

    // Popup de texto expandido
    const expandIcon = document.getElementById('expand-icon');
    const expandPopup = document.getElementById('expand-popup');

    expandIcon.addEventListener('click', () => {
        expandPopup.style.display = 'flex';
    });

    expandPopup.addEventListener('click', (e) => {
        if (e.target === expandPopup) {
            expandPopup.style.display = 'none';
        }
    });
}

document.querySelectorAll('.option-button, .answer p').forEach(element => {
    element.addEventListener('click', (e) => {
        console.log('Botão clicado:', e.target.textContent);
      const questaoId = questoes[questaoAtual].id;
      if (tentativaAtual.questoesRespondidas[questaoId]) return;
  
      const answerDiv = e.target.closest('.answer');
      if (!answerDiv) return;
  
      document.querySelectorAll('.answer').forEach(div => {
        div.classList.remove('selected');
      });
  
      answerDiv.classList.add('selected');
      
      const responderBtn = document.querySelector('.submit-button');
      responderBtn.disabled = false;
      responderBtn.style.backgroundColor = '#282828';
      responderBtn.style.color = '#FFFFFF';
      responderBtn.classList.add('active');
    });
  });

function aplicarFeedbackPermanente(questaoId) {
    const questao = questoesCarregadas[questaoId];
    if (!questao) return;

    const respostaUsuario = tentativaAtual.respostasEnviadas?.[questaoId];
    const foiCorreta = tentativaAtual.respostasCorretas?.[questaoId];
    const respostaCorreta = obterRespostaCorreta(questaoId);

    const respostaUsuarioComparavel = respostaUsuario?.startsWith('opcao_') 
        ? respostaUsuario.replace('opcao_', '').toUpperCase()
        : respostaUsuario?.toUpperCase();

    document.querySelectorAll('.answer').forEach(answer => {
        const letra = answer.querySelector('.option-button').dataset.answer;
        
        answer.classList.remove('selected', 'correct', 'incorrect');
        
        if (respostaUsuarioComparavel && letra === respostaUsuarioComparavel) {
            answer.classList.add(foiCorreta ? 'correct' : 'incorrect');
            answer.classList.add('selected');
        }
        
        if (respostaUsuarioComparavel && !foiCorreta && letra === respostaCorreta) {
            answer.classList.add('correct');
        }
    });
}

function mostrarPopupFinalizacao(dados) {
    console.log('[Popup] Tentando mostrar popup com dados:', dados);
    
    const popUpFinal = document.getElementById('resultPopup');
    if (!popUpFinal) {
        console.error('[Popup] Elemento resultPopup não encontrado no DOM');
        return;
    }

    console.log('[Popup] Elemento encontrado:', popUpFinal);

    const popupContent = popUpFinal.querySelector('.popupContentFinal');
    if (!popupContent) return;

    popupContent.innerHTML = `
        <h2>Teste Finalizado!</h2>
        <p>Total de questões: ${dados.total_questions}</p>
        <p>Acertos: ${dados.correct_answers}</p>
        <p>Erros: ${dados.incorrect_answers}</p>
        <p>Pontuação: ${dados.score}</p>
        <p>Precisão: ${dados.accuracy}%</p>
        <button id="continueBtn" class="btn-popup">Continuar Visualizando</button>
    `;

    popUpFinal.style.display = 'flex';

    document.getElementById('continueBtn').addEventListener('click', () => {
        popUpFinal.style.display = 'none';
        btn.textContent = 'Finalizar';
    });

    // Fecha ao clicar fora do conteúdo
    popUpFinal.addEventListener('click', (e) => {
        if (e.target === popUpFinal) {
            popUpFinal.style.display = 'none';
        }
    });
}



document.querySelector('.submit-button').addEventListener('click', async function() {
    const btn = this;
    
    btn.style.transform = 'scale(0.98)';
    setTimeout(() => { btn.style.transform = 'scale(1)'; }, 100);

    if (btn.textContent.includes('Finalizar')) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Finalizando...';
        try {
            await finalizarTentativa();
            window.location.href = 'home.html';
        } catch (error) {
            console.error('Erro na finalização:', error);
            btn.disabled = false;
            btn.innerHTML = 'Finalizar Teste';
            alert(error.message || 'Erro ao finalizar tentativa');
        }
        return;
    }

    try {
        const selectedAnswer = document.querySelector('.answer.selected');
        if (!selectedAnswer) {
            alert('Por favor, selecione uma alternativa antes de responder');
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Enviando...';

        const questaoId = questoes[questaoAtual].id;
        const resposta = selectedAnswer.querySelector('.option-button').dataset.answer.toUpperCase();

        console.log('Enviando resposta:', { questaoId, resposta });
        const resultado = await enviarResposta(questaoId, resposta);
        console.log('Resposta recebida:', resultado);
        
        selectedAnswer.classList.add(resultado.correto ? 'correct' : 'incorrect');
        
        if (!resultado.correto) {
            const respostaCorreta = obterRespostaCorreta(questaoId);
            document.querySelectorAll('.answer').forEach(answer => {
                if (answer.querySelector('.option-button').dataset.answer === respostaCorreta) {
                    answer.classList.add('correct');
                }
            });
        }

        tentativaAtual.questoesRespondidas[questaoId] = true;
        tentativaAtual.respostasEnviadas = tentativaAtual.respostasEnviadas || {};
        tentativaAtual.respostasEnviadas[questaoId] = resposta;
        tentativaAtual.respostasCorretas = tentativaAtual.respostasCorretas || {};
        tentativaAtual.respostasCorretas[questaoId] = resultado.correto;
        
        document.querySelector('.question-button').disabled = false;
        document.querySelector('.question-button').style.opacity = '1';

        const todasRespondidas = Object.keys(tentativaAtual.questoesRespondidas).length === questoes.length;
        const ehUltimaQuestao = questaoAtual === questoes.length - 1;

        if (ehUltimaQuestao) {
            ultimaQuestaoRespondida = true;
        }

        if (todasRespondidas) {
            console.log('Todas questões respondidas - habilitando finalização');
            verificarEstadoFinalizacao();
            
            if (ehUltimaQuestao && !popupMostrado) {
                mostrarPopupFinalizacao({
                    total_questions: questoes.length,
                    correct_answers: Object.values(tentativaAtual.respostasCorretas).filter(Boolean).length,
                    incorrect_answers: Object.values(tentativaAtual.respostasCorretas).filter(c => !c).length,
                    score: Object.values(tentativaAtual.respostasCorretas).filter(Boolean).length,
                    accuracy: (Object.values(tentativaAtual.respostasCorretas).filter(Boolean).length / questoes.length * 100).toFixed(2)
                });
                popupMostrado = true;
            }
            btn.innerHTML = 'Finalizar';
        }

        btn.innerHTML = 'Responder';
        btn.style.backgroundColor = '#F5F5F5';
        btn.style.color = '#858585';
        btn.disabled = true;

    } catch (error) {
        console.error('Erro no envio da resposta:', {
            error: error.message,
            stack: error.stack
        });
        
        btn.innerHTML = 'Responder';
        btn.disabled = false;
        
        if (error.message.includes('Sessão expirada') || error.message.includes('inválidos')) {
            if (confirm('Problema na sessão. Recarregar a página?')) {
                window.location.reload();
            }
        } else {
            alert(error.message || 'Erro ao enviar resposta. Por favor, tente novamente.');
        }
    }
});

// Popup de finalização

async function verificarEstadoFinalizacao() {
    const btn = document.querySelector('.submit-button');
    if (!btn) {
        console.error('Botão de submit não encontrado');
        return;
    }

    const todasRespondidas = questoes.every(questao => 
        tentativaAtual.questoesRespondidas?.[questao.id]
    );
    
    if (todasRespondidas) {
        btn.textContent = 'Finalizar Teste';
        btn.classList.add('finalizar');
        btn.style.backgroundColor = '#FFAF02';
        btn.style.color = '#FFFFFF';
        btn.disabled = false;

        if (!popupMostrado) {
            mostrarPopupFinalizacao({
                total_questions: questoes.length,
                correct_answers: Object.values(tentativaAtual.respostasCorretas).filter(Boolean).length,
                incorrect_answers: Object.values(tentativaAtual.respostasCorretas).filter(c => !c).length,
                score: Object.values(tentativaAtual.respostasCorretas).filter(Boolean).length,
                accuracy: (Object.values(tentativaAtual.respostasCorretas).filter(Boolean).length / questoes.length * 100).toFixed(2)
            });
            popupMostrado = true;
            btn.textContent = 'Finalizar';
        }
    } else {
        btn.textContent = 'Responder';
        btn.classList.remove('finalizar');
    }
    
    btn.style.border = todasRespondidas ? '2px solidrgb(252, 185, 0)' : 'none';
}

function obterRespostaCorreta(questaoId) {
    const questao = questoesCarregadas[questaoId];
    if (!questao?.resposta_correta) return null;
    
    if (questao.resposta_correta.startsWith('opcao_')) {
        return questao.resposta_correta.replace('opcao_', '').toUpperCase();
    }
    return questao.resposta_correta.toUpperCase();
}

async function carregarEExibirQuestaoAtual() {
    const questao = questoes[questaoAtual];
    if (!questao) return;

    if (!questoesCarregadas[questao.id]) {
        await carregarQuestao(questao.id);
    }

    await carregarRespostasExistentes();
    
    aplicarFeedbackPermanente(questao.id);
    
    verificarEstadoFinalizacao();
    atualizarBotoesNavegacao();
}

document.addEventListener('DOMContentLoaded', inicializarPagina);