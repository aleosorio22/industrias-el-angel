const express = require('express');
const router = express.Router();
const PlantController = require('../controllers/plantController');
const { authMiddleware, isAdmin } = require('../../../core/middlewares/authMiddleware');

// Proteger todas las rutas de plantas con autenticación
router.use(authMiddleware);

// --- Rutas CRUD para Plantas (requieren ser Admin) ---
router.post('/', isAdmin, PlantController.createPlant);
router.get('/', isAdmin, PlantController.getAllPlants); // O permitir a otros roles ver? Ajustar isAdmin si es necesario
router.get('/:id', isAdmin, PlantController.getPlantById); // O permitir a otros roles ver?
router.put('/:id', isAdmin, PlantController.updatePlant);
router.delete('/:id', isAdmin, PlantController.deletePlant);
router.patch('/:id/restore', isAdmin, PlantController.restorePlant);

// --- Rutas para Asignación de Áreas (requieren ser Admin) ---
router.put('/:id/assign-areas', isAdmin, PlantController.assignAreasToPlant);

// --- Ruta para obtener Áreas Disponibles (para UI, requiere ser Admin) ---
router.get('/available-areas/list', isAdmin, PlantController.getAvailableAreas); // Endpoint cambiado para evitar conflicto con /:id


module.exports = router;