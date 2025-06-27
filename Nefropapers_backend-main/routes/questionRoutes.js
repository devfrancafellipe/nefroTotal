const express = require('express');
const router = express.Router({ mergeParams: true });
const questionController = require('../controllers/questionController');
const { validateApiKey } = require('../middlewares/authMiddleware');

router.post('/', questionController.createQuestion);

router.get('/teste/:testId', questionController.getQuestionsForTest);

router.get('/modulo/:idModulo/questoes', questionController.listQuestionsByTopic);
router.get('/todas', questionController.listAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);




module.exports = router;
