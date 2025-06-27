const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storageController');

router.post('/upload', storageController.uploadMiddleware, storageController.uploadFile);

router.get('/files/:bucket/:fileName', storageController.getFile);

module.exports = router;
