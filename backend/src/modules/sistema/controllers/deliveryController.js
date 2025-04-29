const DeliveryModel = require('../models/deliveryModel');
const OrderModel = require('../models/orderModel');

class DeliveryController {
    /**
     * Registra o actualiza productos entregados parcialmente
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async registerDelivery(req, res) {
        try {
            const { pedido_id, producto_id, presentacion_id, cantidad_entregada, comentario } = req.body;
            
            if (!pedido_id || !producto_id || !presentacion_id || cantidad_entregada === undefined) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Datos incompletos. Se requiere pedido_id, producto_id, presentacion_id y cantidad_entregada' 
                });
            }
            
            // Validar que la cantidad entregada sea mayor que cero
            if (cantidad_entregada <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'La cantidad entregada debe ser mayor que cero' 
                });
            }
            
            const deliveryData = {
                pedido_id,
                producto_id,
                presentacion_id,
                cantidad_entregada,
                comentario,
                usuario_id: req.user.id
            };
            
            const result = await DeliveryModel.registerDelivery(deliveryData);
            
            const message = result.isUpdate 
                ? 'Entrega actualizada exitosamente' 
                : 'Entrega registrada exitosamente';
            
            res.status(result.isUpdate ? 200 : 201).json({
                success: true,
                message,
                data: { 
                    id: result.id,
                    isUpdate: result.isUpdate
                }
            });
        } catch (error) {
            console.error('Error al registrar entrega:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Error al registrar la entrega' 
            });
        }
    }
    
    /**
     * Obtiene las entregas de un pedido
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async getDeliveriesByOrderId(req, res) {
        try {
            const { pedidoId } = req.params;
            
            // Verificar que el pedido existe
            const order = await OrderModel.findById(pedidoId);
            
            if (!order) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Pedido no encontrado' 
                });
            }
            
            // Verificar que el usuario tenga acceso al pedido
            const isAdmin = req.user.rol === 'admin' || req.user.rol === 'repartidor';
            if (!isAdmin && order.usuario_id !== req.user.id) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'No tienes permiso para ver las entregas de este pedido' 
                });
            }
            
            const deliveries = await DeliveryModel.getDeliveriesByOrderId(pedidoId);
            
            res.json({
                success: true,
                data: deliveries
            });
        } catch (error) {
            console.error('Error al obtener entregas:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener las entregas del pedido' 
            });
        }
    }
    
    /**
     * Cambia el estado del pedido a "listo para entregar a ruta"
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async markOrderAsReady(req, res) {
        try {
            const { pedidoId } = req.params;
            
            // Verificar que el pedido existe
            const order = await OrderModel.findById(pedidoId);
            
            if (!order) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Pedido no encontrado' 
                });
            }
            
            // Solo admin o repartidor pueden cambiar el estado
            if (req.user.rol !== 'admin' && req.user.rol !== 'repartidor') {
                return res.status(403).json({ 
                    success: false, 
                    message: 'No tienes permiso para cambiar el estado del pedido' 
                });
            }
            
            await DeliveryModel.updateOrderStatus(pedidoId, 'listo para entregar a ruta');
            
            res.json({
                success: true,
                message: 'Pedido marcado como listo para entregar a ruta'
            });
        } catch (error) {
            console.error('Error al cambiar estado del pedido:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Error al cambiar el estado del pedido' 
            });
        }
    }
    
    /**
     * Cambia el estado del pedido a "en ruta"
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async markOrderAsInRoute(req, res) {
        try {
            const { pedidoId } = req.params;
            
            // Verificar que el pedido existe
            const order = await OrderModel.findById(pedidoId);
            
            if (!order) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Pedido no encontrado' 
                });
            }
            
            // Solo admin o repartidor pueden cambiar el estado
            if (req.user.rol !== 'admin' && req.user.rol !== 'repartidor') {
                return res.status(403).json({ 
                    success: false, 
                    message: 'No tienes permiso para cambiar el estado del pedido' 
                });
            }
            
            await DeliveryModel.updateOrderStatus(pedidoId, 'en ruta');
            
            res.json({
                success: true,
                message: 'Pedido marcado como en ruta'
            });
        } catch (error) {
            console.error('Error al cambiar estado del pedido:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Error al cambiar el estado del pedido' 
            });
        }
    }
    
    /**
     * Cambia el estado del pedido a "entregado"
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async markOrderAsDelivered(req, res) {
        try {
            const { pedidoId } = req.params;
            
            // Verificar que el pedido existe
            const order = await OrderModel.findById(pedidoId);
            
            if (!order) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Pedido no encontrado' 
                });
            }
            
            // Solo admin o repartidor pueden cambiar el estado
            if (req.user.rol !== 'admin' && req.user.rol !== 'repartidor') {
                return res.status(403).json({ 
                    success: false, 
                    message: 'No tienes permiso para cambiar el estado del pedido' 
                });
            }
            
            await DeliveryModel.updateOrderStatus(pedidoId, 'entregado');
            
            res.json({
                success: true,
                message: 'Pedido marcado como entregado'
            });
        } catch (error) {
            console.error('Error al cambiar estado del pedido:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Error al cambiar el estado del pedido' 
            });
        }
    }
    
    /**
     * Obtiene los pedidos con sus entregas
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async getOrdersWithDeliveries(req, res) {
        try {
            const userId = req.user.id;
            const orders = await DeliveryModel.getOrdersWithDeliveries(userId);
            
            res.json({
                success: true,
                data: orders
            });
        } catch (error) {
            console.error('Error al obtener pedidos con entregas:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener los pedidos con entregas' 
            });
        }
    }
}

module.exports = DeliveryController;