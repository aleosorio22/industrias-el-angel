const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Rutas protegidas
router.use(authMiddleware);

// Rutas accesibles para usuarios autenticados
router.get('/', unitController.getAllUnits);
router.get('/:id', unitController.getUnitById);

// Rutas solo para administradores
router.post('/', isAdmin, unitController.createUnit);
router.put('/:id', isAdmin, unitController.updateUnit);
router.delete('/:id', isAdmin, unitController.deleteUnit);
router.patch('/:id/restore', isAdmin, unitController.restoreUnit)

module.exports = router;