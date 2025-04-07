const express = require('express');
const router = express.Router();
const conversionController = require('../controllers/conversionController');
const { authMiddleware, isAdmin } = require('../../../core/middlewares/authMiddleware');

// Protect all routes
router.use(authMiddleware);

// Routes for authenticated users
router.get('/product/:productId', conversionController.getProductConversions);

// Routes only for admins
router.post('/', isAdmin, conversionController.createConversion);
router.put('/:id', isAdmin, conversionController.updateConversion);
router.delete('/:id', isAdmin, conversionController.deleteConversion);

module.exports = router;