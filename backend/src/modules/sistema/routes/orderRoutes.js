const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, isAdmin, isDeliveryOrAdmin } = require('../../../core/middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear un nuevo pedido
router.post('/', orderController.createOrder);

// Rutas específicas (deben ir ANTES de las rutas con parámetros)
router.get('/mis-pedidos', orderController.getMyOrders);
router.get('/by-date/:date', isDeliveryOrAdmin, orderController.getOrdersByDate);
router.get('/cliente/:clienteId', isDeliveryOrAdmin, orderController.getOrdersByClientId);
router.get('/production-consolidated/:date', isAdmin, orderController.getProductionConsolidated);
router.patch('/production-consolidated/:date', isAdmin, orderController.updateProductionQuantity);

// IMPORTANTE: Esta ruta debe ir ANTES de la ruta con :id
router.get('/pendientes-pago', isDeliveryOrAdmin, orderController.getPendingPaymentOrders);

// Obtener todos los pedidos - permitir a repartidores y admins
router.get('/', isDeliveryOrAdmin, orderController.getOrders);

// Rutas con parámetro ID (deben ir AL FINAL)
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', isDeliveryOrAdmin, orderController.updateOrderStatus);

module.exports = router;