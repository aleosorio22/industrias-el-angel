const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Rutas que requieren autenticación de administrador
router.post('/', authMiddleware, isAdmin, clientController.createClient);
router.get('/', authMiddleware, isAdmin, clientController.getAllClients);
router.get('/:id', authMiddleware, isAdmin, clientController.getClientById);
router.put('/:id', authMiddleware, isAdmin, clientController.updateClient);
router.delete('/:id', authMiddleware, isAdmin, clientController.deleteClient);
router.patch('/:id/restore', authMiddleware, isAdmin, clientController.restoreClient);

// Ruta para usuarios normales
router.get('/mis-datos/perfil', authMiddleware, clientController.getMyClientData);

module.exports = router;