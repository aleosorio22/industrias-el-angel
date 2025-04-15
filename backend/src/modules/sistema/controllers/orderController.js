const OrderModel = require('../models/orderModel');
const ClientModel = require('../models/clientModel');
const db = require('../../../core/config/database'); 

class OrderController {
    /**
     * Crea un nuevo pedido
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async createOrder(req, res) {
        try {
            const { fecha, sucursal_id, observaciones, productos } = req.body;
            
            if (!fecha || !productos || !Array.isArray(productos) || productos.length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Datos incompletos. Se requiere fecha y al menos un producto' 
                });
            }
            
            // Obtener el cliente asociado al usuario
            const cliente = await ClientModel.findByUserId(req.user.id);
            
            if (!cliente) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'No se encontró un cliente asociado a este usuario' 
                });
            }
            
            const orderData = {
                cliente_id: cliente.id,
                sucursal_id,
                usuario_id: req.user.id,
                fecha,
                observaciones,
                productos
            };
            
            const orderId = await OrderModel.create(orderData);
            
            res.status(201).json({
                success: true,
                message: 'Pedido creado exitosamente',
                data: { id: orderId }
            });
        } catch (error) {
            console.error('Error al crear pedido:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Error al crear el pedido' 
            });
        }
    }
    
    /**
     * Obtiene todos los pedidos
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async getOrders(req, res) {
        try {
            const isAdmin = req.user.rol === 'admin';
            const orders = await OrderModel.findAll(req.user.id, isAdmin);
            
            res.json({
                success: true,
                data: orders
            });
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener los pedidos' 
            });
        }
    }
    
    /**
     * Obtiene un pedido por su ID
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async getOrderById(req, res) {
        try {
            const orderId = req.params.id;
            const order = await OrderModel.findById(orderId);
            
            if (!order) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Pedido no encontrado' 
                });
            }
            
            // Verificar que el usuario tenga acceso al pedido
            const isAdmin = req.user.rol === 'admin';
            if (!isAdmin && order.usuario_id !== req.user.id) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'No tienes permiso para ver este pedido' 
                });
            }
            
            res.json({
                success: true,
                data: order
            });
        } catch (error) {
            console.error('Error al obtener pedido:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener el pedido' 
            });
        }
    }
    
    /**
     * Actualiza el estado de un pedido
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            
            if (!estado) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Se requiere el estado del pedido' 
                });
            }
            
            // Verificar estados válidos
            const estadosValidos = ['solicitado', 'en_proceso', 'completado', 'cancelado'];
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Estado no válido' 
                });
            }
            
            const order = await OrderModel.findById(id);
            
            if (!order) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Pedido no encontrado' 
                });
            }
            
            // Solo administradores pueden cambiar el estado
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ 
                    success: false, 
                    message: 'No tienes permiso para actualizar el estado del pedido' 
                });
            }
            
            await OrderModel.updateStatus(id, estado);
            
            res.json({
                success: true,
                message: 'Estado del pedido actualizado correctamente'
            });
        } catch (error) {
            console.error('Error al actualizar estado del pedido:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al actualizar el estado del pedido' 
            });
        }
    }

    /**
     * Obtiene los pedidos del usuario autenticado
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async getMyOrders(req, res) {
        try {
            const userId = req.user.id;
            const orders = await OrderModel.findByUserId(userId);
            
            res.json({
                success: true,
                data: orders
            });
        } catch (error) {
            console.error('Error al obtener mis pedidos:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener los pedidos' 
            });
        }
    }

    /**
     * Obtiene los pedidos de un cliente específico
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async getOrdersByClientId(req, res) {
        try {
            const clienteId = req.params.clienteId;
            
            // Verificar que el cliente existe usando el modelo
            const clientExists = await ClientModel.findById(clienteId);
            
            if (!clientExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente no encontrado'
                });
            }
            
            const orders = await OrderModel.findByClientId(clienteId);
            
            res.json({
                success: true,
                data: orders
            });
        } catch (error) {
            console.error('Error al obtener pedidos del cliente:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener los pedidos del cliente' 
            });
        }
    }

    /**
     * Obtiene el consolidado de producción para una fecha específica
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async getProductionConsolidated(req, res) {
        try {
            const { date } = req.params;

            if (!date) {
                return res.status(400).json({
                    success: false,
                    message: 'Se requiere una fecha para el consolidado'
                });
            }

            const consolidated = await OrderModel.getProductionConsolidated(date);
            
            res.json({
                success: true,
                data: consolidated
            });
        } catch (error) {
            console.error('Error al obtener consolidado:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el consolidado de producción'
            });
        }
    }

    static async updateProductionQuantity(req, res) {
        try {
          const { date } = req.params;
          const { producto_id, total_unidades } = req.body;
      
          if (!producto_id || total_unidades === undefined) {
            return res.status(400).json({
              success: false,
              message: 'Se requiere producto_id y total_unidades'
            });
          }
      
          const updatedItem = await OrderModel.updateProductionQuantity(date, producto_id, total_unidades);
      
          res.json({
            success: true,
            message: 'Cantidad actualizada correctamente',
            data: updatedItem
          });
        } catch (error) {
          console.error('Error al actualizar cantidad:', error);
          res.status(500).json({
            success: false,
            message: error.message || 'Error al actualizar la cantidad'
          });
        }
      }
}

module.exports = OrderController;