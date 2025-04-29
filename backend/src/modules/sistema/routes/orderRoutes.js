const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, isAdmin, isDeliveryOrAdmin } = require('../../../core/middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear un nuevo pedido
router.post('/', orderController.createOrder);

// Obtener pedidos por fecha (accesible para repartidores y admins)
router.get('/by-date/:date', isDeliveryOrAdmin, orderController.getOrdersByDate);

// Obtener todos los pedidos - permitir a repartidores y admins
router.get('/', isDeliveryOrAdmin, orderController.getOrders);

// Obtener mis pedidos 
router.get('/mis-pedidos', orderController.getMyOrders);

// Obtener los pedidos de un cliente
router.get('/cliente/:clienteId', isDeliveryOrAdmin, orderController.getOrdersByClientId);

// Obtener un pedido específico por ID (debe ir después de las rutas específicas)
router.get('/:id', orderController.getOrderById);

// Obtener pedidos por fecha (accesible para repartidores y admins)
router.get('/by-date/:date', isDeliveryOrAdmin, orderController.getOrdersByDate);

// Obtener todos los pedidos - permitir a repartidores y admins
router.get('/', isDeliveryOrAdmin, orderController.getOrders);

// Obtener mis pedidos 
router.get('/mis-pedidos', orderController.getMyOrders);

// Obtener los pedidos de un cliente
router.get('/cliente/:clienteId', isDeliveryOrAdmin, orderController.getOrdersByClientId);

// Obtener un pedido específico por ID (debe ir después de las rutas específicas)
router.get('/:id', isDeliveryOrAdmin, orderController.getOrderById);

// Actualizar el estado de un pedido (solo admin)
router.patch('/:id/status', isDeliveryOrAdmin, orderController.updateOrderStatus);

// Obtener consolidado de producción por fecha (solo admin)
router.get('/production-consolidated/:date', isAdmin, orderController.getProductionConsolidated);

// Actualizar cantidad en consolidado de producción
router.patch('/production-consolidated/:date', isAdmin, orderController.updateProductionQuantity);

module.exports = router;