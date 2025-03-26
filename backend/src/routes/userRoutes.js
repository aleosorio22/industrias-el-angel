const express = require('express');
const { 
    login,
    register,
    getAllUsers,
    getUserById,
    updateUser,
    updatePassword,
    deleteUser,
    getProfile,
    getAvailableUsers
} = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { validateUser, validatePasswordUpdate } = require('../middlewares/validateMiddleware');
const { isOwnerOrAdmin } = require('../middlewares/ownershipMiddleware');

const router = express.Router();

// Rutas públicas
router.post('/login', login);
router.post('/first-admin', register);

// Rutas protegidas
router.use(authMiddleware);

// Ruta de perfil
router.get('/profile', getProfile);

// Rutas para administradores
router.post('/register', isAdmin, validateUser, register);
router.get('/', isAdmin, getAllUsers);
// Mover esta ruta antes de las rutas con parámetros
router.get('/available', isAdmin, getAvailableUsers);

// Rutas mixtas (protegidas por propiedad o admin)
router.get('/:id', isOwnerOrAdmin, getUserById);
router.put('/:id', isOwnerOrAdmin, validateUser, updateUser);
router.put('/:id/password', isOwnerOrAdmin, validatePasswordUpdate, updatePassword);
router.delete('/:id', isAdmin, deleteUser);

module.exports = router;
