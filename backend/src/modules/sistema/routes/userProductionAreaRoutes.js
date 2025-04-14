const express = require('express');
const router = express.Router();
const userProductionAreaController = require('../controllers/userProductionAreaController');
const { authMiddleware, isAdmin } = require('../../../core/middlewares/authMiddleware');

// Proteger todas las rutas
router.use(authMiddleware);

// Rutas solo para administradores
router.post('/assign', isAdmin, userProductionAreaController.assignUserToArea);
router.delete('/:userId/:areaId', isAdmin, userProductionAreaController.removeUserFromArea);
router.put('/user/:userId/areas', isAdmin, userProductionAreaController.updateUserAreas);

// Rutas para usuarios autenticados
router.get('/user/:userId/areas', userProductionAreaController.getUserAreas);
router.get('/area/:areaId/users', userProductionAreaController.getAreaUsers);

// Ruta para obtener usuarios disponibles para asignar
router.get('/available-users', isAdmin, userProductionAreaController.getAvailableUsers);

module.exports = router;