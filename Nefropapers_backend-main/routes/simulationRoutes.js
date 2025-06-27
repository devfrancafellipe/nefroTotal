const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController'); 


router.get('/tentativas/:userId', simulationController.getAttempts);



// router.get('/tentativas/:attemptId', simulationController.getAttemptDetails);
router.get('/tentativas/:attemptId/respostas', simulationController.getAttemptResponses);
// router.get('/tentativas/:attemptId/progresso', simulationController.getAttemptProgress);
router.get('/tentativas/:attemptId/:userId/progresso', simulationController.getAttemptProgress);



router.get('/:userId', simulationController.listTests);
router.get('/:testId/detalhes', simulationController.getTestDetails);

router.post('/:testId/:userId/iniciar', simulationController.startTestAttempt);
router.post('/tentativas/:attemptId/finalizar', simulationController.finalizeAttempt);


router.post('/:testId/responder', simulationController.saveAnswer);
router.post('/:testId/questoes', simulationController.addQuestionsToTest);
router.post('/:testId/gerar-questoes-aleatorias', simulationController.generateRandomQuestionsForTest);

router.post('/', simulationController.createTest);

module.exports = router;
