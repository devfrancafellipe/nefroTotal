const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const { validateApiKey } = require('../middlewares/authMiddleware'); 
const { route } = require('./authRoutes');

router.get('/todos', moduleController.listAllTopicos);
// router.get('/:idCurso/modulos',  moduleController.listModules);
router.get('/:id', moduleController.getTopicoById)

router.get('/search', moduleController.searchModules);


router.post('/', moduleController.createModule);


module.exports = router;
