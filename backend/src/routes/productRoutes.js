const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Rutas protegidas
router.use(authMiddleware);

// Rutas accesibles para usuarios autenticados
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas solo para administradores
router.post('/', isAdmin, productController.createProduct);
router.put('/:id', isAdmin, productController.updateProduct);
router.delete('/:id', isAdmin, productController.deleteProduct);
router.patch('/:id/restore', isAdmin, productController.restoreProduct);

module.exports = router;