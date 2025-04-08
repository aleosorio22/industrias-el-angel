const express = require('express');
const router = express.Router();
const productionAreaController = require('../controllers/productionAreaController');
const { authMiddleware, isAdmin } = require('../../../core/middlewares/authMiddleware');

// Protect all routes
router.use(authMiddleware);

// Routes for authenticated users
router.get('/categorias-asignadas', authMiddleware, productionAreaController.getAssignedCategories);
router.get('/', productionAreaController.getAllAreas);
router.get('/:id', productionAreaController.getAreaById);

// Routes only for admins
router.post('/', isAdmin, productionAreaController.createArea);
router.put('/:id', isAdmin, productionAreaController.updateArea);
router.delete('/:id', isAdmin, productionAreaController.deleteArea);
router.patch('/:id/restore', isAdmin, productionAreaController.restoreArea);

module.exports = router;