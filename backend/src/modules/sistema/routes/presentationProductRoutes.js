const express = require('express');
const router = express.Router();
const presentationProductController = require('../controllers/presentationProductController');
const { authMiddleware, isAdmin } = require('../../../core/middlewares/authMiddleware');

// Protect all routes
router.use(authMiddleware);

// Routes for authenticated users
router.get('/product/:productId', presentationProductController.getProductPresentations);

// Routes only for admins
router.post('/', isAdmin, presentationProductController.createPresentation);
router.put('/:id', isAdmin, presentationProductController.updatePresentation);
router.delete('/:id', isAdmin, presentationProductController.deletePresentation);

module.exports = router;