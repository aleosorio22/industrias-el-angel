const express = require('express');
const router = express.Router();
const presentationController = require('../controllers/presentationController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Protected routes
router.use(authMiddleware);

// Routes for authenticated users
router.get('/', presentationController.getAllPresentations);
router.get('/:id', presentationController.getPresentationById);

// Routes for admin users only
router.post('/', isAdmin, presentationController.createPresentation);
router.put('/:id', isAdmin, presentationController.updatePresentation);
router.delete('/:id', isAdmin, presentationController.deletePresentation);
router.patch('/:id/restore', isAdmin, presentationController.restorePresentation);

module.exports = router;