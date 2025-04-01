const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Rutas que requieren autenticación de administrador
router.post('/', authMiddleware, isAdmin, branchController.createBranch);
router.get('/', authMiddleware, isAdmin, branchController.getAllBranches);
router.get('/cliente/:clientId', authMiddleware, branchController.getBranchesByClientId);
router.get('/:id', authMiddleware, branchController.getBranchById);
router.put('/:id', authMiddleware, isAdmin, branchController.updateBranch);
router.delete('/:id', authMiddleware, isAdmin, branchController.deleteBranch);
router.patch('/:id/restore', authMiddleware, isAdmin, branchController.restoreBranch);

// Ruta para usuarios normales - Esta es la ruta que debemos usar
router.get('/mis-sucursales/perfil', authMiddleware, branchController.getMyBranches);

module.exports = router;