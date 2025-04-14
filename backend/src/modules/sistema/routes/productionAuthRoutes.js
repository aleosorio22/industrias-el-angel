const express = require('express');
const router = express.Router();
const productionAuthController = require('../controllers/productionAuthController');

router.post('/login', productionAuthController.login);

module.exports = router;