const db = require('../../../core/config/database');

class DeliveryModel {
    /**
     * Registra o actualiza productos entregados parcialmente
     * @param {Object} deliveryData - Datos de la entrega
     * @returns {Promise<Object>} - ID de la entrega y si fue creada o actualizada
     */
    static async registerDelivery(deliveryData) {
        const { pedido_id, producto_id, cantidad_entregada, comentario, usuario_id } = deliveryData;
        
        // Validar que el pedido existe
        const [pedidoRows] = await db.execute(
            'SELECT id FROM pedidos WHERE id = ?',
            [pedido_id]
        );
        
        if (pedidoRows.length === 0) {
            throw new Error(`El pedido con ID ${pedido_id} no existe`);
        }
        
        // Validar que el producto existe
        const [productoRows] = await db.execute(
            'SELECT id FROM productos WHERE id = ?',
            [producto_id]
        );
        
        if (productoRows.length === 0) {
            throw new Error(`El producto con ID ${producto_id} no existe`);
        }
        
        // Validar que el producto está en el pedido
        const [pedidoDetalleRows] = await db.execute(
            'SELECT id FROM pedido_detalle WHERE pedido_id = ? AND producto_id = ?',
            [pedido_id, producto_id]
        );
        
        if (pedidoDetalleRows.length === 0) {
            throw new Error(`El producto con ID ${producto_id} no está en el pedido con ID ${pedido_id}`);
        }
        
        // Verificar si ya existe una entrega para este pedido y producto
        const [existingDelivery] = await db.execute(
            'SELECT id FROM pedido_entrega WHERE pedido_id = ? AND producto_id = ?',
            [pedido_id, producto_id]
        );
        
        let result;
        let isUpdate = false;
        
        if (existingDelivery.length > 0) {
            // Actualizar la entrega existente
            [result] = await db.execute(
                'UPDATE pedido_entrega SET cantidad_entregada = ?, comentario = ?, usuario_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [cantidad_entregada, comentario || null, usuario_id, existingDelivery[0].id]
            );
            isUpdate = true;
            return { 
                id: existingDelivery[0].id, 
                isUpdate: true 
            };
        } else {
            // Insertar nueva entrega
            [result] = await db.execute(
                'INSERT INTO pedido_entrega (pedido_id, producto_id, cantidad_entregada, comentario, usuario_id) VALUES (?, ?, ?, ?, ?)',
                [pedido_id, producto_id, cantidad_entregada, comentario || null, usuario_id]
            );
            return { 
                id: result.insertId, 
                isUpdate: false 
            };
        }
    }
    
    /**
     * Obtiene las entregas de un pedido
     * @param {number} pedidoId - ID del pedido
     * @returns {Promise<Array>} - Lista de entregas
     */
    static async getDeliveriesByOrderId(pedidoId) {
        const [deliveries] = await db.execute(`
            SELECT pe.*, 
                   p.nombre as producto_nombre,
                   u.nombre as usuario_nombre
            FROM pedido_entrega pe
            JOIN productos p ON pe.producto_id = p.id
            LEFT JOIN usuarios u ON pe.usuario_id = u.id
            WHERE pe.pedido_id = ?
            ORDER BY pe.fecha_entrega DESC
        `, [pedidoId]);
        
        return deliveries;
    }
    
    /**
     * Cambia el estado de un pedido
     * @param {number} pedidoId - ID del pedido
     * @param {string} estado - Nuevo estado
     * @returns {Promise<boolean>} - true si se actualizó correctamente
     */
    static async updateOrderStatus(pedidoId, estado) {
        // Validar estados permitidos
        const estadosPermitidos = ['solicitado', 'listo para entregar a ruta', 'en ruta', 'entregado'];
        
        if (!estadosPermitidos.includes(estado)) {
            throw new Error(`Estado no válido: ${estado}`);
        }
        
        // Actualizar el estado del pedido
        const [result] = await db.execute(
            'UPDATE pedidos SET estado = ? WHERE id = ?',
            [estado, pedidoId]
        );
        
        return result.affectedRows > 0;
    }
    
    /**
     * Obtiene los pedidos con sus entregas
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} - Lista de pedidos con entregas
     */
    static async getOrdersWithDeliveries(userId) {
        // Obtener los pedidos del usuario
        const [orders] = await db.execute(`
            SELECT p.*, 
                   c.nombre as cliente_nombre, 
                   s.nombre as sucursal_nombre
            FROM pedidos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN sucursales s ON p.sucursal_id = s.id
            WHERE p.usuario_id = ?
            ORDER BY p.fecha DESC
        `, [userId]);
        
        // Para cada pedido, obtener sus detalles y entregas
        for (const order of orders) {
            // Obtener detalles del pedido
            const [details] = await db.execute(`
                SELECT pd.*,
                       pr.nombre as producto_nombre,
                       pres.nombre as presentacion_nombre
                FROM pedido_detalle pd
                JOIN productos pr ON pd.producto_id = pr.id
                JOIN presentaciones pres ON pd.presentacion_id = pres.id
                WHERE pd.pedido_id = ?
            `, [order.id]);
            
            // Obtener entregas del pedido
            const [deliveries] = await db.execute(`
                SELECT pe.*,
                       pr.nombre as producto_nombre
                FROM pedido_entrega pe
                JOIN productos pr ON pe.producto_id = pr.id
                WHERE pe.pedido_id = ?
            `, [order.id]);
            
            // Agregar detalles y entregas al pedido
            order.productos_pedidos = details.map(detail => ({
                producto_id: detail.producto_id,
                nombre: detail.producto_nombre,
                presentacion: detail.presentacion_nombre,
                cantidad_pedida: detail.cantidad
            }));
            
            // Solo agregar entregas si existen
            if (deliveries.length > 0) {
                order.productos_entregados = deliveries.map(delivery => ({
                    producto_id: delivery.producto_id,
                    nombre: delivery.producto_nombre,
                    cantidad_entregada: delivery.cantidad_entregada,
                    fecha_entrega: delivery.fecha_entrega
                }));
                
                // Agregar comentario de entrega (del último registro)
                if (deliveries[0].comentario) {
                    order.comentario_entrega = deliveries[0].comentario;
                }
            }
        }
        
        return orders;
    }
}

module.exports = DeliveryModel;