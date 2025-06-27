// const DOM_ELEMENTS = {
//   backArrow: document.querySelector('.back-arrow'),
//   answersContainer: document.querySelector('.answers'),
//   submitButton: document.querySelector('.submit-button'),
//   gabaritoButton: document.querySelector('.question-button'),
//   questionNumber: document.querySelector('.question-number h2'),
//   questionBody: document.querySelector('.question-body p'),
//   expandPopupQuestionBody: document.querySelector('#expand-popup .question-body p'),
//   imageButton: document.querySelector('.image-button'),
//   popupImage: document.getElementById('popup-image'),
//   popupImg: document.querySelector('.popup-img'),
//   prevButton: document.querySelector('.prev-button'),
//   nextButton: document.querySelector('.next-button'),
//   progressBar: document.getElementById("progress-bar"),
//   progressText: document.getElementById("progress-text"),
//   popupGabarito: document.getElementById('popup-gabarito'),
//   expandIcon: document.getElementById('expand-icon'),
//   expandPopup: document.getElementById('expand-popup'),
//   popupLarge: document.getElementById('popup-large-image'),
//   openPopupLargeButton: document.getElementById('detailed-response'),
//   closePopupLargeButton: document.getElementById('close-popup-large'),
//   explicacaoImg: document.querySelector('.gabarito-img'),
//   videoPopup: document.getElementById('popup-video'),
//   videoButton: document.querySelector('.video-button'),
//   closeVideoPopup: document.querySelector('.close-video-popup'),
//   linkElement: document.getElementById('dynamicLink'),
//   popUpFinal: document.getElementById("resultPopup"),
//   popupContent: document.getElementById("resultPopup")?.querySelector('.popupContentFinal')
// };

// const API_ENDPOINTS = {
//   questions: (id) => `https://nefropapersapi.com/questoes/${id}`,
//   simuladoDetails: (id) => `https://nefropapersapi.com/simulados/${id}/detalhes`,
//   startAttempt: (testId, userId) => `https://nefropapersapi.com/simulados/${testId}/${userId}/iniciar`,
//   submitAnswer: (testId) => `https://nefropapersapi.com/simulados/${testId}/responder`
// };

// // Estado global da aplicação
// const APP_STATE = {
//   currentQuestion: 1,
//   totalQuestions: 1,
//   questionIds: [],
//   selectedAnswer: null,
//   testId: null,
//   questionId: null,
//   userId: null,
//   attemptId: null
// };

// // Inicialização da aplicação
// document.addEventListener("DOMContentLoaded", async () => {
//   try {
//       initializeEventListeners();
//       await initializeAppState();
//       await loadCurrentQuestion();
//       initializeProgressBar();
//   } catch (error) {
//       console.error('Initialization error:', error);
//       handleError(error);
//   }
// });

// // Funções principais
// function initializeEventListeners() {
//   // Navegação
//   DOM_ELEMENTS.backArrow?.addEventListener('click', handleBackArrowClick);
//   DOM_ELEMENTS.prevButton?.addEventListener('click', () => navigateQuestion('prev'));
//   DOM_ELEMENTS.nextButton?.addEventListener('click', () => navigateQuestion('next'));
  
//   // Respostas
//   DOM_ELEMENTS.answersContainer?.addEventListener('click', handleAnswerSelection);
//   DOM_ELEMENTS.submitButton?.addEventListener('click', handleSubmitAnswer);
  
//   // Popups
//   DOM_ELEMENTS.gabaritoButton?.addEventListener('click', showGabaritoPopup);
//   DOM_ELEMENTS.popupGabarito?.addEventListener('click', (e) => e.target === DOM_ELEMENTS.popupGabarito && hideElement(DOM_ELEMENTS.popupGabarito));
  
//   DOM_ELEMENTS.expandIcon?.addEventListener('click', () => showElement(DOM_ELEMENTS.expandPopup));
//   DOM_ELEMENTS.expandPopup?.addEventListener('click', (e) => e.target === DOM_ELEMENTS.expandPopup && hideElement(DOM_ELEMENTS.expandPopup));
  
//   DOM_ELEMENTS.openPopupLargeButton?.addEventListener('click', () => showElement(DOM_ELEMENTS.popupLarge));
//   DOM_ELEMENTS.closePopupLargeButton?.addEventListener('click', () => hideElement(DOM_ELEMENTS.popupLarge));
  
//   DOM_ELEMENTS.videoButton?.addEventListener('click', () => showElement(DOM_ELEMENTS.videoPopup));
//   DOM_ELEMENTS.closeVideoPopup?.addEventListener('click', () => hideElement(DOM_ELEMENTS.videoPopup));
// }

// async function initializeAppState() {
//   const urlParams = new URLSearchParams(window.location.search);
//   APP_STATE.testId = urlParams.get('testId');
//   APP_STATE.questionId = urlParams.get('questionId');
//   APP_STATE.userId = localStorage.getItem('user_id') || localStorage.getItem('userId');
  
//   if (!APP_STATE.testId || !APP_STATE.questionId || !APP_STATE.userId) {
//       throw new Error('Missing required parameters');
//   }
  
//   // Configurar link dinâmico
//   if (DOM_ELEMENTS.linkElement) {
//       DOM_ELEMENTS.linkElement.href = `./detalhes.html?id=${APP_STATE.testId}`;
//   }
  
//   await initializeAttempt();
//   await initializeQuestionProgress();
// }

// async function initializeAttempt() {
//   try {
//       // Limpar dados antigos
//       ['tentativa_id', 'ultima_questao', 'respostas_salvas', 'questoes_total'].forEach(key => localStorage.removeItem(key));
      
//       // Iniciar nova tentativa
//       const response = await fetch(API_ENDPOINTS.startAttempt(APP_STATE.testId, APP_STATE.userId), {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//               'X-API-KEY': localStorage.getItem('apiKey')
//           }
//       });
      
//       if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || 'Failed to start attempt');
//       }
      
//       const data = await response.json();
      
//       if (!data?.attempt?.id) {
//           throw new Error('Invalid attempt data');
//       }
      
//       APP_STATE.attemptId = data.attempt.id;
//       localStorage.setItem('tentativa_id', APP_STATE.attemptId);
      
//       // Atualizar progresso
//       if (data.progress) {
//           updateLocalProgress(data.progress, data.test);
//       }
      
//       // Verificar se o teste foi finalizado
//       if (data.attempt.status === 'finalizado') {
//           showTestResults(data.progress);
//           return;
//       }
//   } catch (error) {
//       console.error('Attempt initialization error:', error);
//       throw error;
//   }
// }

// async function initializeQuestionProgress() {
//   try {
//       // Buscar detalhes do simulado para obter IDs das questões
//       const response = await fetch(API_ENDPOINTS.simuladoDetails(APP_STATE.testId), {
//           headers: { 'X-API-KEY': localStorage.getItem('apiKey') }
//       });
      
//       if (!response.ok) throw new Error('Failed to fetch test details');
      
//       const data = await response.json();
      
//       if (data?.questoesComTopicos?.length) {
//           APP_STATE.questionIds = data.questoesComTopicos.map(q => q.questao_id);
//           APP_STATE.totalQuestions = APP_STATE.questionIds.length;
          
//           // Encontrar índice da questão atual
//           const currentIndex = APP_STATE.questionIds.indexOf(APP_STATE.questionId);
//           APP_STATE.currentQuestion = currentIndex !== -1 ? currentIndex + 1 : 1;
//       }
//   } catch (error) {
//       console.error('Question progress initialization error:', error);
//       throw error;
//   }
// }

// async function loadCurrentQuestion() {
//   try {
//       const questionData = await fetchQuestionData(APP_STATE.questionId);
//       updateQuestionHTML(questionData);
      
//       await setupImageButton(questionData);
//       await setupExplanationImage(questionData);
      
//       const savedAnswer = await checkSavedAnswer();
//       if (savedAnswer) {
//           await showQuestionResult(savedAnswer.resposta, questionData);
//       }
      
//       setupNavigation();
//   } catch (error) {
//       console.error('Question loading error:', error);
//       throw error;
//   }
// }

// // Funções auxiliares
// async function fetchQuestionData(questionId) {
//   const apiKey = localStorage.getItem('apiKey');
//   const response = await fetch(API_ENDPOINTS.questions(questionId), {
//       headers: { 'X-API-KEY': apiKey }
//   });
  
//   if (!response.ok) {
//       throw new Error(`Failed to fetch question data (ID: ${questionId})`);
//   }
  
//   return await response.json();
// }

// function updateQuestionHTML(questionData) {
//   if (!questionData?.pergunta || !questionData?.opcao_a || !questionData?.opcao_b) {
//       throw new Error('Invalid question data');
//   }
  
//   DOM_ELEMENTS.questionNumber.textContent = 'Questão';
//   DOM_ELEMENTS.questionBody.textContent = questionData.pergunta;
//   DOM_ELEMENTS.expandPopupQuestionBody.textContent = questionData.pergunta;
  
//   // Limpar respostas anteriores
//   DOM_ELEMENTS.answersContainer.innerHTML = '';
  
//   // Adicionar novas respostas
//   const answers = [
//       { letter: 'A', text: questionData.opcao_a },
//       { letter: 'B', text: questionData.opcao_b },
//       { letter: 'C', text: questionData.opcao_c || null },
//       { letter: 'D', text: questionData.opcao_d || null },
//       { letter: 'E', text: questionData.opcao_e || null }
//   ].filter(answer => answer.text);
  
//   answers.forEach(answer => {
//       const answerHTML = `
//           <div class="answer">
//               <button class="option-button" data-option="${answer.letter}">${answer.letter}</button>
//               <p>${answer.text}</p>
//           </div>
//       `;
//       DOM_ELEMENTS.answersContainer.insertAdjacentHTML('beforeend', answerHTML);
//   });
// }

// async function setupImageButton(questionData) {
//   if (!questionData.imagem_url) {
//       hideElement(DOM_ELEMENTS.imageButton);
//       return;
//   }
  
//   showElement(DOM_ELEMENTS.imageButton);
//   DOM_ELEMENTS.popupImg.src = questionData.imagem_url;
// }

// async function setupExplanationImage(questionData) {
//   if (!questionData.imagem_explicacao) {
//       hideElement(DOM_ELEMENTS.openPopupLargeButton);
//       return;
//   }
  
//   showElement(DOM_ELEMENTS.openPopupLargeButton);
//   DOM_ELEMENTS.explicacaoImg.src = questionData.imagem_explicacao;
// }

// async function checkSavedAnswer() {
//   const savedAnswer = localStorage.getItem(`resposta_${APP_STATE.questionId}`);
//   if (savedAnswer) {
//       return { resposta: savedAnswer };
//   }
  
//   try {
//       const response = await fetch(API_ENDPOINTS.startAttempt(APP_STATE.testId, APP_STATE.userId), {
//           method: "POST",
//           headers: {
//               "Content-Type": "application/json",
//               "X-API-KEY": localStorage.getItem("apiKey"),
//           },
//       });
      
//       if (!response.ok) return null;
      
//       const data = await response.json();
//       return data?.progress?.respostas?.find(resposta => 
//           resposta.questao_id === APP_STATE.questionId && 
//           resposta.tentativa_id === APP_STATE.attemptId
//       );
//   } catch (error) {
//       console.error("Error checking saved answer:", error);
//       return null;
//   }
// }

// function handleAnswerSelection(event) {
//   const target = event.target;
//   if (!target.classList.contains('option-button') && target.tagName !== 'P') return;
  
//   const button = target.classList.contains('option-button') 
//       ? target 
//       : target.parentElement.querySelector('.option-button');
  
//   APP_STATE.selectedAnswer = button.getAttribute('data-option');
//   localStorage.setItem(`resposta_${APP_STATE.questionId}`, APP_STATE.selectedAnswer);
  
//   // Reset all buttons
//   document.querySelectorAll('.option-button').forEach(btn => {
//       btn.style.backgroundColor = '';
//       btn.style.color = '';
//   });
  
//   // Highlight selected button
//   button.style.backgroundColor = 'blue';
//   button.style.color = 'white';
  
//   // Enable submit button
//   if (DOM_ELEMENTS.submitButton) {
//       DOM_ELEMENTS.submitButton.disabled = false;
//       DOM_ELEMENTS.submitButton.style.backgroundColor = '#282828';
//       DOM_ELEMENTS.submitButton.style.color = '#FFFFFF';
//   }
// }

// // async function handleSubmitAnswer() {
// //   if (!APP_STATE.selectedAnswer) return;
  
// //   try {
// //       const response = await fetch(API_ENDPOINTS.submitAnswer(APP_STATE.testId), {
// //           method: 'POST',
// //           headers: {
// //               'Content-Type': 'application/json',
// //               'X-API-KEY': localStorage.getItem('apiKey')
// //           },
// //           body: JSON.stringify({
// //               tentativa_id: APP_STATE.attemptId,
// //               questao_id: APP_STATE.questionId,
// //               resposta: APP_STATE.selectedAnswer,
// //               user_id: APP_STATE.userId
// //           }),
// //       });
      
// //       const result = await response.json();
// //       if (!response.ok) {
// //           throw new Error(result.error || 'Failed to submit answer');
// //       }
      
// //       // Disable buttons after submission
// //       if (DOM_ELEMENTS.submitButton) DOM_ELEMENTS.submitButton.disabled = true;
// //       if (DOM_ELEMENTS.gabaritoButton) {
// //           DOM_ELEMENTS.gabaritoButton.disabled = false;
// //           DOM_ELEMENTS.gabaritoButton.style.opacity = '1';
// //       }
      
// //       await showQuestionResult(APP_STATE.selectedAnswer);
      
// //       // Verifica se é a última questão ou se o teste foi finalizado
// //       if (APP_STATE.currentQuestion === APP_STATE.totalQuestions || result.attempt?.status === 'finalizado') {
// //           showTestResults(result);
// //       }
// //   } catch (error) {
// //       console.error('Answer submission error:', error);
// //       alert('Error submitting answer. Please try again.');
// //   }
// // }
// async function handleSubmitAnswer() {
//   if (!APP_STATE.selectedAnswer) return;
  
//   try {
//       const response = await fetch(API_ENDPOINTS.submitAnswer(APP_STATE.testId), {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//               'X-API-KEY': localStorage.getItem('apiKey')
//           },
//           body: JSON.stringify({
//               tentativa_id: APP_STATE.attemptId,
//               questao_id: APP_STATE.questionId,
//               resposta: APP_STATE.selectedAnswer,
//               user_id: APP_STATE.userId
//           }),
//       });
      
//       const result = await response.json();
//       if (!response.ok) {
//           throw new Error(result.error || 'Failed to submit answer');
//       }
      
//       // Disable buttons after submission
//       if (DOM_ELEMENTS.submitButton) DOM_ELEMENTS.submitButton.disabled = true;
//       if (DOM_ELEMENTS.gabaritoButton) {
//           DOM_ELEMENTS.gabaritoButton.disabled = false;
//           DOM_ELEMENTS.gabaritoButton.style.opacity = '1';
//       }
      
//       await showQuestionResult(APP_STATE.selectedAnswer);
      
//       // Verifica se é a última questão
//       if (APP_STATE.currentQuestion === APP_STATE.totalQuestions) {
//           // Força a finalização do teste
//           await finalizeTest();
//       }
//   } catch (error) {
//       console.error('Answer submission error:', error);
//       alert('Error submitting answer. Please try again.');
//   }
// }
// async function showQuestionResult(selectedAnswer, questionData = null) {
//   const data = questionData || await fetchQuestionData(APP_STATE.questionId);
//   const correctAnswer = data.resposta_correta.replace('opcao_', '').toUpperCase();
  
//   document.querySelectorAll('.option-button').forEach(button => {
//       const option = button.getAttribute("data-option");
      
//       if (option === selectedAnswer) {
//           button.style.backgroundColor = option === correctAnswer ? "#00C851" : "#FF4444";
//           button.style.color = "white";
//       }
      
//       if (option === correctAnswer) {
//           button.style.backgroundColor = "#00C851";
//           button.style.color = "white";
//       }
      
//       button.disabled = true;
//       button.style.pointerEvents = "none";
//   });
  
//   if (DOM_ELEMENTS.submitButton) {
//       DOM_ELEMENTS.submitButton.disabled = true;
//   }
// }

// // function showTestResults(result) {
// //   if (!DOM_ELEMENTS.popUpFinal || !DOM_ELEMENTS.popupContent) return;
  
// //   DOM_ELEMENTS.popupContent.innerHTML = `
// //       <h2>Teste Finalizado!</h2>
// //       <p>Total de questões: ${result.totalResolutions || APP_STATE.totalQuestions}</p>
// //       <p>Total de acertos: ${result.totalCorrectAnswers || 'N/A'}</p>
// //       <p>Total de erros: ${result.totalErrors || 'N/A'}</p>
// //       <p>Pontuação: ${result.score || 'N/A'}</p>
// //       <button id="closePopupBtn">Continuar</button>
// //   `;
  
// //   showElement(DOM_ELEMENTS.popUpFinal);
  
// //   document.getElementById('closePopupBtn')?.addEventListener('click', () => {
// //       hideElement(DOM_ELEMENTS.popUpFinal);
// //       clearTestData();
// //       window.location.href = 'index.html';
// //   });
// // }
// function showTestResults(result) {
//     // Verifica se temos um popup para mostrar os resultados
//     if (!DOM_ELEMENTS.popUpFinal) {
//         console.error('Popup de resultados não encontrado');
//         return;
//     }

//     // Prepara o conteúdo padrão
//     let resultsHTML = `
//         <h2>Teste Finalizado!</h2>
//         <p>Total de questões: ${result.totalResolutions || APP_STATE.totalQuestions}</p>
//     `;

//     // Adiciona informações adicionais se disponíveis
//     if (result.totalCorrectAnswers !== undefined) {
//         resultsHTML += `<p>Acertos: ${result.totalCorrectAnswers}</p>`;
//     }
    
//     if (result.totalErrors !== undefined) {
//         resultsHTML += `<p>Erros: ${result.totalErrors}</p>`;
//     }
    
//     if (result.score !== undefined) {
//         resultsHTML += `<p>Pontuação: ${result.score}</p>`;
//     }

//     // Mensagem personalizada se houver
//     if (result.message) {
//         resultsHTML += `<p class="result-message">${result.message}</p>`;
//     }

//     // Atualiza o conteúdo do popup
//     DOM_ELEMENTS.popupContent.innerHTML = resultsHTML;
    
//     // Mostra o popup
//     showElement(DOM_ELEMENTS.popUpFinal);
    
//     // Configura o botão de fechar
//     document.getElementById('closePopupBtn')?.addEventListener('click', () => {
//         hideElement(DOM_ELEMENTS.popUpFinal);
//         clearTestData();
//         window.location.href = 'index.html';
//     });
// }

// function clearTestData() {
//   ['tentativa_id', 'ultima_questao', 'respostas_salvas', 'questoes_total', 'teste_finalizado'].forEach(key => {
//       localStorage.removeItem(key);
//   });
  
//   // Remove all answer items
//   Object.keys(localStorage).forEach(key => {
//       if (key.startsWith('resposta_')) {
//           localStorage.removeItem(key);
//       }
//   });
// }

// function showGabaritoPopup() {
//   if (!DOM_ELEMENTS.popupGabarito) return;
  
//   fetchQuestionData(APP_STATE.questionId)
//       .then(data => {
//           const explanationText = DOM_ELEMENTS.popupGabarito.querySelector('.explanation-content p');
//           if (explanationText && data.explicacao) {
//               explanationText.innerText = data.explicacao;
//               showElement(DOM_ELEMENTS.popupGabarito);
//           }
//       })
//       .catch(error => console.error('Error showing gabarito:', error));
// }

// // Navegação
// function handleBackArrowClick() {
//   const simuladoId = new URLSearchParams(window.location.search).get('id');
//   window.location.href = `./detalhes.html?id=${simuladoId}`;
// }

// // function navigateQuestion(direction) {
// //   if (direction === "next") {
// //       if (APP_STATE.currentQuestion < APP_STATE.totalQuestions) {
// //           APP_STATE.currentQuestion++;
// //       } else {
// //           // Tentou avançar além da última questão - mostrar resultados
// //           fetchTestResultsAndShow();
// //           return;
// //       }
// //   } else if (direction === "prev" && APP_STATE.currentQuestion > 1) {
// //       APP_STATE.currentQuestion--;
// //   } else {
// //       return;
// //   }
  
// //   const newQuestionId = APP_STATE.questionIds[APP_STATE.currentQuestion - 1];
// //   window.location.href = `questao.html?testId=${APP_STATE.testId}&questionId=${newQuestionId}&navegacaoInterna=true`;
// // }
// function navigateQuestion(direction) {
//   if (direction === "next") {
//       if (APP_STATE.currentQuestion < APP_STATE.totalQuestions) {
//           APP_STATE.currentQuestion++;
//       } else {
//           // Tentou avançar além da última questão - finaliza o teste
//           finalizeTest();
//           return;
//       }
//   } else if (direction === "prev" && APP_STATE.currentQuestion > 1) {
//       APP_STATE.currentQuestion--;
//   } else {
//       return;
//   }
  
//   const newQuestionId = APP_STATE.questionIds[APP_STATE.currentQuestion - 1];
//   window.location.href = `questao.html?testId=${APP_STATE.testId}&questionId=${newQuestionId}&navegacaoInterna=true`;
// }
// async function fetchTestResultsAndShow() {
//   try {
//       const response = await fetch(API_ENDPOINTS.simuladoDetails(APP_STATE.testId), {
//           headers: { 'X-API-KEY': localStorage.getItem('apiKey') }
//       });
      
//       if (!response.ok) throw new Error('Failed to fetch test results');
      
//       const data = await response.json();
//       showTestResults(data);
//   } catch (error) {
//       console.error('Error fetching test results:', error);
//       handleError(error);
//   }
// }

// function initializeProgressBar() {
//   if (!DOM_ELEMENTS.progressBar || !DOM_ELEMENTS.progressText) return;
  
//   DOM_ELEMENTS.progressBar.max = APP_STATE.totalQuestions;
//   DOM_ELEMENTS.progressBar.value = APP_STATE.currentQuestion;
//   DOM_ELEMENTS.progressText.innerText = `${APP_STATE.currentQuestion} de ${APP_STATE.totalQuestions}`;
  
//   const progressPercent = ((APP_STATE.currentQuestion - 1) / (APP_STATE.totalQuestions - 1)) * 100;
//   DOM_ELEMENTS.progressBar.style.setProperty("--progress-percent", `${progressPercent}%`);
// }

// function setupNavigation() {
//   if (!APP_STATE.questionIds.length) return;
  
//   const currentIndex = APP_STATE.questionIds.indexOf(APP_STATE.questionId);
  
//   if (DOM_ELEMENTS.prevButton) {
//       const hasPrevious = currentIndex > 0;
//       DOM_ELEMENTS.prevButton.disabled = !hasPrevious;
//       DOM_ELEMENTS.prevButton.classList.toggle('disabled', !hasPrevious);
//   }
  
//   if (DOM_ELEMENTS.nextButton) {
//       const hasNext = currentIndex < APP_STATE.questionIds.length - 1;
//       DOM_ELEMENTS.nextButton.disabled = !hasNext;
//       DOM_ELEMENTS.nextButton.classList.toggle('disabled', !hasNext);
//   }
// }

// // Funções utilitárias
// function updateLocalProgress(progress, test) {
//   const progressData = {
//       ultimaQuestao: progress.ultima_questao || 1,
//       respostas: progress.respostas || [],
//       questoesTotal: test.questoesTotal || 0,
//       questoesRestantes: progress.questoesRestantes || []
//   };
  
//   localStorage.setItem("ultima_questao", progressData.ultimaQuestao);
//   localStorage.setItem("respostas_salvas", JSON.stringify(progressData.respostas));
//   localStorage.setItem("questoes_total", JSON.stringify(progressData.questoesTotal));
//   localStorage.setItem("questoes_restantes", JSON.stringify(progressData.questoesRestantes));
// }

// function showElement(element) {
//   if (element) {
//       element.style.display = 'flex';
//   }
// }

// function hideElement(element) {
//   if (element) {
//       element.style.display = 'none';
//   }
// }

// function handleError(error) {
//   console.error('Application error:', error);
//   alert('An error occurred. Please try again later.');
//   window.location.href = 'index.html';
// }

// async function finalizeTest() {
//   try {
//       // Corrigindo a URL do endpoint
//       const response = await fetch(`https://nefropapersapi.com/simulados/${APP_STATE.testId}/finalizar-tentativa`, {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//               'X-API-KEY': localStorage.getItem('apiKey')
//           },
//           body: JSON.stringify({
//               tentativa_id: APP_STATE.attemptId,
//               user_id: APP_STATE.userId
//           }),
//       });
      
//       // Verifica se a resposta é JSON válido
//       const contentType = response.headers.get('content-type');
//       let result;
      
//       if (contentType && contentType.includes('application/json')) {
//           result = await response.json();
//       } else {
//           const text = await response.text();
//           throw new Error(`Resposta inesperada: ${text.substring(0, 100)}...`);
//       }
      
//       if (!response.ok) {
//           throw new Error(result.error || 'Failed to finalize test');
//       }
      
//       // Mostra os resultados finais
//       showTestResults(result);
//   } catch (error) {
//       console.error('Test finalization error:', error);
//       // Mostra resultados com dados locais em caso de erro
//       showTestResults({
//           totalResolutions: APP_STATE.totalQuestions,
//           totalCorrectAnswers: 'Calculando...',
//           totalErrors: 'Calculando...',
//           score: 'Calculando...',
//           message: 'Seus resultados estão sendo processados'
//       });
//   }
// }
