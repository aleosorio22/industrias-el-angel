const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../../core/middlewares/authMiddleware');
const graphController = require('../controllers/graphController');

router.use(authMiddleware);
router.get('/recomendaciones', graphController.recomendar);

module.exports = router;
