const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { authMiddleware } = require('../../../core/middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear una nueva plantilla
router.post('/', templateController.createTemplate);

// Obtener todas las plantillas del usuario
router.get('/', templateController.getTemplates);

// Obtener una plantilla específica por ID
router.get('/:id', templateController.getTemplateById);

// Usar una plantilla (cargar al pedido actual)
router.post('/:id/usar', templateController.useTemplate);

// Eliminar una plantilla
router.delete('/:id', templateController.deleteTemplate);

// Actualizar una plantilla existente
router.put('/:id', templateController.updateTemplate);

module.exports = router;