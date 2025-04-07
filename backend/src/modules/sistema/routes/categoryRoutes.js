const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware, isAdmin } = require('../../../core/middlewares/authMiddleware');

// Rutas protegidas
router.use(authMiddleware);

// Rutas accesibles para usuarios autenticados
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Rutas solo para administradores
router.post('/', isAdmin, categoryController.createCategory);
router.put('/:id', isAdmin, categoryController.updateCategory);
router.delete('/:id', isAdmin, categoryController.deleteCategory);
router.patch('/:id/restore', isAdmin, categoryController.restoreCategory)

module.exports = router;