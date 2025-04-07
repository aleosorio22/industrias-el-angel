const db = require('../../../core/config/database');

class OrderModel {
    /**
     * Crea un nuevo pedido en la base de datos
     * @param {Object} orderData - Datos del pedido
     * @returns {Promise<number>} - ID del pedido creado
     */
    static async create(orderData) {
        const { cliente_id, sucursal_id, usuario_id, fecha, observaciones, productos } = orderData;
        
        // Validar productos antes de crear el pedido
        await this.validateOrderProducts(productos);
        
        // Iniciar transacción
        const connection = await db.getConnection();
        await connection.beginTransaction();
        
        try {
            // Insertar el pedido
            const [orderResult] = await connection.execute(
                'INSERT INTO pedidos (cliente_id, sucursal_id, usuario_id, fecha, observaciones, estado) VALUES (?, ?, ?, ?, ?, ?)',
                [cliente_id, sucursal_id || null, usuario_id, fecha, observaciones || null, 'solicitado']
            );
            
            const orderId = orderResult.insertId;
            
            // Insertar los detalles del pedido
            for (const producto of productos) {
                await connection.execute(
                    'INSERT INTO pedido_detalle (pedido_id, producto_id, presentacion_id, cantidad) VALUES (?, ?, ?, ?)',
                    [orderId, producto.producto_id, producto.presentacion_id, producto.cantidad]
                );
            }
            
            // Confirmar transacción
            await connection.commit();
            connection.release();
            
            return orderId;
        } catch (error) {
            // Revertir transacción en caso de error
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
    
    /**
     * Valida que los productos del pedido existan y tengan presentaciones válidas
     * @param {Array} productos - Lista de productos a validar
     * @returns {Promise<boolean>} - true si todos los productos son válidos
     */
    static async validateOrderProducts(productos) {
        for (const item of productos) {
            // Verificar que el producto existe y está activo
            const [productRows] = await db.execute(
                'SELECT id FROM productos WHERE id = ? AND estado = "activo"',
                [item.producto_id]
            );
            
            if (productRows.length === 0) {
                throw new Error(`El producto con ID ${item.producto_id} no existe o está inactivo`);
            }
            
            // Verificar que la presentación existe y está asociada al producto
            const [presentationRows] = await db.execute(
                'SELECT id FROM producto_presentacion WHERE producto_id = ? AND presentacion_id = ? AND estado = "activo"',
                [item.producto_id, item.presentacion_id]
            );
            
            if (presentationRows.length === 0) {
                throw new Error(`La presentación con ID ${item.presentacion_id} no es válida para el producto con ID ${item.producto_id}`);
            }
            
            // Verificar que la cantidad es mayor que cero
            if (item.cantidad <= 0) {
                throw new Error('La cantidad debe ser mayor que cero');
            }
        }
        
        return true;
    }
    
    /**
     * Obtiene todos los pedidos con información básica
     * @param {number} userId - ID del usuario para filtrar sus pedidos
     * @param {boolean} isAdmin - Indica si el usuario es administrador
     * @returns {Promise<Array>} - Lista de pedidos
     */
    static async findAll(userId, isAdmin) {
        let query = `
            SELECT p.*, 
                   c.nombre as cliente_nombre, 
                   s.nombre as sucursal_nombre,
                   (SELECT COUNT(*) FROM pedido_detalle WHERE pedido_id = p.id) as total_productos
            FROM pedidos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN sucursales s ON p.sucursal_id = s.id
        `;
        
        // Si no es admin, solo mostrar pedidos del usuario
        if (!isAdmin) {
            query += ' WHERE p.usuario_id = ?';
            const [orders] = await db.execute(query, [userId]);
            return orders;
        }
        
        const [orders] = await db.execute(query);
        return orders;
    }
    
    /**
     * Obtiene un pedido por su ID con todos sus detalles
     * @param {number} id - ID del pedido
     * @returns {Promise<Object>} - Pedido con sus detalles
     */
    static async findById(id) {
        // Obtener información básica del pedido
        const [orders] = await db.execute(`
            SELECT p.*, 
                   c.nombre as cliente_nombre, 
                   s.nombre as sucursal_nombre,
                   u.email as usuario_email
            FROM pedidos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN sucursales s ON p.sucursal_id = s.id
            LEFT JOIN usuarios u ON p.usuario_id = u.id
            WHERE p.id = ?
        `, [id]);
        
        if (orders.length === 0) return null;
        
        // Obtener los detalles del pedido con información de productos y presentaciones
        const [details] = await db.execute(`
            SELECT pd.*,
                   pr.nombre as producto_nombre,
                   pr.codigo as producto_codigo,
                   pres.nombre as presentacion_nombre,
                   pp.cantidad as cantidad_por_presentacion,
                   pp.precio as precio_unitario
            FROM pedido_detalle pd
            JOIN productos pr ON pd.producto_id = pr.id
            JOIN producto_presentacion pp ON (pd.producto_id = pp.producto_id AND pd.presentacion_id = pp.presentacion_id)
            JOIN presentaciones pres ON pd.presentacion_id = pres.id
            WHERE pd.pedido_id = ?
        `, [id]);
        
        // Combinar el pedido con sus detalles
        const order = orders[0];
        order.detalles = details;
        
        return order;
    }
    
    /**
     * Actualiza el estado de un pedido
     * @param {number} id - ID del pedido
     * @param {string} estado - Nuevo estado
     * @returns {Promise<boolean>} - true si se actualizó correctamente
     */
    static async updateStatus(id, estado) {
        const [result] = await db.execute(
            'UPDATE pedidos SET estado = ? WHERE id = ?',
            [estado, id]
        );
        
        return result.affectedRows > 0;
    }

    /**
     * Obtiene los pedidos de un usuario específico
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} - Lista de pedidos
     */
    static async findByUserId(userId) {
        const [orders] = await db.execute(`
            SELECT p.*, 
                   c.nombre as cliente_nombre, 
                   s.nombre as sucursal_nombre,
                   (SELECT COUNT(*) FROM pedido_detalle WHERE pedido_id = p.id) as total_productos
            FROM pedidos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN sucursales s ON p.sucursal_id = s.id
            WHERE p.usuario_id = ?
            ORDER BY p.fecha DESC
        `, [userId]);
        
        return orders;
    }

    /**
     * Obtiene los pedidos de un cliente específico
     * @param {number} clienteId - ID del cliente
     * @returns {Promise<Array>} - Lista de pedidos
     */
    static async findByClientId(clienteId) {
        const [orders] = await db.execute(`
            SELECT p.*, 
                   c.nombre as cliente_nombre, 
                   s.nombre as sucursal_nombre,
                   u.email as usuario_email
            FROM pedidos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN sucursales s ON p.sucursal_id = s.id
            LEFT JOIN usuarios u ON p.usuario_id = u.id
            WHERE p.cliente_id = ?
            ORDER BY p.fecha DESC
        `, [clienteId]);
        
        return orders;
    }

    /**
     * Obtiene el consolidado de producción para una fecha específica
     * @param {string} date - Fecha en formato YYYY-MM-DD
     * @returns {Promise<Array>} - Consolidado de producción
     */
    static async getProductionConsolidated(date) {
        const query = `
            WITH pedidos_del_dia AS (
                SELECT pd.producto_id,
                       p.nombre AS producto_nombre,
                       p.unidad_base_id,
                       pd.presentacion_id,
                       pd.cantidad,
                       pp.cantidad AS unidades_por_presentacion
                FROM pedidos pe
                JOIN pedido_detalle pd ON pe.id = pd.pedido_id
                JOIN productos p ON pd.producto_id = p.id
                JOIN producto_presentacion pp ON (pd.producto_id = pp.producto_id AND pd.presentacion_id = pp.presentacion_id)
                WHERE DATE(pe.fecha) = ?
                AND pe.estado != 'cancelado'
            ),
            total_unidades AS (
                SELECT 
                    producto_id,
                    producto_nombre,
                    unidad_base_id,
                    SUM(cantidad * unidades_por_presentacion) as total_unidades
                FROM pedidos_del_dia
                GROUP BY producto_id, producto_nombre, unidad_base_id
            ),
            conversiones AS (
                SELECT 
                    cu.producto_id,
                    u1.nombre AS unidad_origen,
                    u2.nombre AS unidad_destino,
                    cu.factor_conversion
                FROM conversion_unidades cu
                JOIN unidades u1 ON cu.unidad_origen_id = u1.id
                JOIN unidades u2 ON cu.unidad_destino_id = u2.id
            )
            SELECT 
                t.producto_nombre,
                t.total_unidades AS unidades_totales,
                u.nombre AS unidad_base,
                ROUND(t.total_unidades / MAX(CASE 
                    WHEN c.unidad_origen = 'Lata' AND c.unidad_destino = 'Unidad'
                    THEN c.factor_conversion 
                END), 2) AS latas_necesarias,
                ROUND(
                    (t.total_unidades / MAX(CASE 
                        WHEN c.unidad_origen = 'Lata' AND c.unidad_destino = 'Unidad'
                        THEN c.factor_conversion 
                    END))
                    / MAX(CASE 
                        WHEN c.unidad_origen = 'Arroba' AND c.unidad_destino = 'Lata'
                        THEN c.factor_conversion 
                    END) * 25, 2
                ) AS libras_necesarias,
                ROUND(
                    (t.total_unidades / MAX(CASE 
                        WHEN c.unidad_origen = 'Lata' AND c.unidad_destino = 'Unidad'
                        THEN c.factor_conversion 
                    END))
                    / MAX(CASE 
                        WHEN c.unidad_origen = 'Arroba' AND c.unidad_destino = 'Lata'
                        THEN c.factor_conversion 
                    END), 2
                ) AS arrobas_necesarias
            FROM total_unidades t
            JOIN unidades u ON t.unidad_base_id = u.id
            LEFT JOIN conversiones c ON t.producto_id = c.producto_id
            GROUP BY t.producto_nombre, t.total_unidades, u.nombre
            ORDER BY t.producto_nombre`;

        const [results] = await db.execute(query, [date]);
        return results;
    }
}

module.exports = OrderModel;