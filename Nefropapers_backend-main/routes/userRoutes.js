const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateApiKey, setSupabaseAuth } = require('../middlewares/authMiddleware');

router.get('/', userController.listUsers);
router.get('/:userId/desempenho', userController.getUserPerformance);
router.post('/historico', userController.saveUserHistory);
// router.get('/historico', userController.getUserHistory);

router.get('/:userId/tentativas/finalizadas', userController.getFinalizedAttempts);
router.get('/:userId/historico', userController.getUserTestHistory);

router.put('/:id', userController.editUser);

module.exports = router;
