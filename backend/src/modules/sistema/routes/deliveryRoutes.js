const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { authMiddleware, isAdmin, isDeliveryOrAdmin } = require('../../../core/middlewares/authMiddleware');


// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Registrar productos entregados parcialmente
router.post('/', isDeliveryOrAdmin, deliveryController.registerDelivery);

// Obtener las entregas de un pedido
router.get('/pedido/:pedidoId', deliveryController.getDeliveriesByOrderId);

// Obtener pedidos con sus entregas
router.get('/mis-pedidos-con-entregas', deliveryController.getOrdersWithDeliveries);

// Cambiar estado del pedido a "listo para entregar a ruta"
router.patch('/listo/:pedidoId', isDeliveryOrAdmin, deliveryController.markOrderAsReady);

// Cambiar estado del pedido a "en ruta"
router.patch('/enruta/:pedidoId', isDeliveryOrAdmin, deliveryController.markOrderAsInRoute);

// Cambiar estado del pedido a "entregado"
router.patch('/entregado/:pedidoId', isDeliveryOrAdmin, deliveryController.markOrderAsDelivered);

module.exports = router;