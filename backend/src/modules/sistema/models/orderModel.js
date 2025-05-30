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
            SELECT 
                p.id,
                p.cliente_id,
                p.sucursal_id,
                p.usuario_id,
                DATE_FORMAT(p.fecha, '%Y-%m-%d') as fecha,
                p.estado,
                p.observaciones,
                p.created_at,
                p.updated_at,
                c.nombre as cliente_nombre, 
                s.nombre as sucursal_nombre,
                (SELECT COUNT(*) FROM pedido_detalle WHERE pedido_id = p.id) as total_productos
            FROM pedidos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN sucursales s ON p.sucursal_id = s.id
        `;;
        
        // Si no es admin, solo mostrar pedidos del usuario
        if (!isAdmin) {
            query += ' WHERE p.usuario_id = ?';
            const [orders] = await db.execute(query, [userId]);
            return orders;
        }
        
        const [orders] = await db.execute(query);
        return orders;
    }
 fix/pendientes-pago

     /**
    * Encuentra pedidos entregados (pendientes de pago)
    * @param {number|null} clienteId - ID del cliente (opcional)
    * @returns {Promise<Array>} - Lista de pedidos
    */
     static async findDeliveredPendingPayment(clienteId = null) {
        let query = `
            SELECT p.*, 
                   c.nombre as cliente_nombre, 
                   s.nombre as sucursal_nombre,
                   (SELECT COUNT(*) FROM pedido_detalle WHERE pedido_id = p.id) as total_productos,
                   (SELECT SUM(pd.cantidad * pp.precio) 
                    FROM pedido_detalle pd
                    JOIN producto_presentacion pp ON pd.producto_id = pp.producto_id AND pd.presentacion_id = pp.presentacion_id
                    WHERE pd.pedido_id = p.id) as monto
            FROM pedidos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN sucursales s ON p.sucursal_id = s.id
            WHERE p.estado = 'entregado'
        `;
        
        const params = [];
        
        if (clienteId) {
            query += ' AND p.cliente_id = ?';
            params.push(clienteId);
        }
        
        query += ' ORDER BY p.fecha DESC';
        
        console.log('Query de pedidos entregados:', query);
        console.log('Parámetros:', params);
        
        const [orders] = await db.execute(query, params);
        console.log('Pedidos encontrados:', orders.length);
        
        return orders;
    }
    
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
                       p.categoria_id,
                       cat.nombre AS categoria_nombre,
                       p.unidad_base_id,
                       pd.presentacion_id,
                       pd.cantidad,
                       pp.cantidad AS unidades_por_presentacion
                FROM pedidos pe
                JOIN pedido_detalle pd ON pe.id = pd.pedido_id
                JOIN productos p ON pd.producto_id = p.id
                JOIN categorias cat ON p.categoria_id = cat.id
                JOIN producto_presentacion pp ON pd.producto_id = pp.producto_id AND pd.presentacion_id = pp.presentacion_id
                WHERE DATE(pe.fecha) = ?
                AND pe.estado != 'cancelado'
            ),
    
            total_unidades AS (
                SELECT 
                    categoria_id,
                    categoria_nombre,
                    producto_id,
                    producto_nombre,
                    unidad_base_id,
                    SUM(cantidad * unidades_por_presentacion) AS total_unidades
                FROM pedidos_del_dia
                GROUP BY categoria_id, categoria_nombre, producto_id, producto_nombre, unidad_base_id
            ),
    
            conversiones AS (
                SELECT 
                    cu.producto_id,
                    LOWER(u1.nombre) AS unidad_origen,
                    LOWER(u2.nombre) AS unidad_destino,
                    cu.factor_conversion
                FROM conversion_unidades cu
                JOIN unidades u1 ON cu.unidad_origen_id = u1.id
                JOIN unidades u2 ON cu.unidad_destino_id = u2.id
            ),
    
            productos_consolidados AS (
                SELECT 
                    t.categoria_id,
                    t.categoria_nombre,
                    t.producto_id,
                    t.producto_nombre,
                    t.total_unidades,
                    ROUND(t.total_unidades / MAX(CASE 
                        WHEN c.unidad_origen = 'lata' AND c.unidad_destino = 'unidad' 
                        THEN c.factor_conversion END), 2) AS latas_necesarias,
    
                    ROUND((t.total_unidades / MAX(CASE 
                        WHEN c.unidad_origen = 'lata' AND c.unidad_destino = 'unidad' 
                        THEN c.factor_conversion END))
                        / MAX(CASE 
                            WHEN c.unidad_origen = 'arroba' AND c.unidad_destino = 'lata' 
                            THEN c.factor_conversion END) * 25, 2) AS libras_necesarias,
    
                    ROUND((t.total_unidades / MAX(CASE 
                        WHEN c.unidad_origen = 'lata' AND c.unidad_destino = 'unidad' 
                        THEN c.factor_conversion END))
                        / MAX(CASE 
                            WHEN c.unidad_origen = 'arroba' AND c.unidad_destino = 'lata' 
                            THEN c.factor_conversion END), 2) AS arrobas_necesarias
    
                FROM total_unidades t
                LEFT JOIN conversiones c ON t.producto_id = c.producto_id
                GROUP BY t.categoria_id, t.categoria_nombre, t.producto_id, t.producto_nombre, t.total_unidades
            ),
    
            totales_por_categoria AS (
                SELECT 
                    categoria_id,
                    categoria_nombre,
                    CONCAT('Total categoría: ', categoria_nombre) AS producto_nombre,
                    SUM(latas_necesarias) AS latas_necesarias,
                    SUM(libras_necesarias) AS libras_necesarias,
                    SUM(arrobas_necesarias) AS arrobas_necesarias
                FROM productos_consolidados
                GROUP BY categoria_id, categoria_nombre
            )
    
            SELECT * FROM (
                SELECT 
                    categoria_nombre,
                    producto_id,
                    producto_nombre,
                    total_unidades,
                    latas_necesarias,
                    libras_necesarias,
                    arrobas_necesarias
                FROM productos_consolidados
    
                UNION ALL
    
                SELECT 
                    categoria_nombre,
                    NULL AS producto_id,
                    producto_nombre,
                    NULL AS total_unidades,
                    latas_necesarias,
                    libras_necesarias,
                    arrobas_necesarias
                FROM totales_por_categoria
            ) AS resultado
            ORDER BY categoria_nombre, producto_nombre
        `;
    
        const [results] = await db.execute(query, [date]);
        return results;
    }


        /**
     * Obtiene los pedidos para una fecha específica
     * @param {string} date - Fecha en formato YYYY-MM-DD
     * @param {string} status - Estado del pedido (opcional)
     * @returns {Promise<Array>} - Lista de pedidos
     */
    static async findByDate(date, status = null) {
        let query = `
            SELECT p.*, 
                   c.nombre as cliente_nombre, 
                   s.nombre as sucursal_nombre,
                   (SELECT COUNT(*) FROM pedido_detalle WHERE pedido_id = p.id) as total_productos
            FROM pedidos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN sucursales s ON p.sucursal_id = s.id
            WHERE DATE(p.fecha) = ?
        `;
        
        const params = [date];
        
        if (status && status !== 'all') {
            query += ' AND p.estado = ?';
            params.push(status);
        }
        
        query += ' ORDER BY p.id DESC';
        
        const [orders] = await db.execute(query, params);
        return orders;

    }


    /**
     * Actualiza la cantidad de producción para un producto específico
     * @param {string} date - Fecha en formato YYYY-MM-DD
     * @param {number} producto_id - ID del producto
     * @param {number} total_unidades - Total de unidades a producir
     * @returns {Promise<Object>} - Información actualizada del producto
     */

    static async updateProductionQuantity(date, producto_id, total_unidades) {
        const connection = await db.getConnection();
        try {
            // Obtener información del producto con la misma estructura del consolidado
            const [productInfo] = await connection.execute(`
                WITH conversiones AS (
                    SELECT 
                        cu.producto_id,
                        LOWER(u1.nombre) AS unidad_origen,
                        LOWER(u2.nombre) AS unidad_destino,
                        cu.factor_conversion
                    FROM conversion_unidades cu
                    JOIN unidades u1 ON cu.unidad_origen_id = u1.id
                    JOIN unidades u2 ON cu.unidad_destino_id = u2.id
                )
                SELECT 
                    p.id,
                    p.nombre as producto_nombre,
                    cat.nombre as categoria_nombre,
                    ROUND(${total_unidades} / MAX(CASE 
                        WHEN c.unidad_origen = 'lata' AND c.unidad_destino = 'unidad' 
                        THEN c.factor_conversion END), 2) AS latas_necesarias,
                    ROUND((${total_unidades} / MAX(CASE 
                        WHEN c.unidad_origen = 'lata' AND c.unidad_destino = 'unidad' 
                        THEN c.factor_conversion END))
                        / MAX(CASE 
                            WHEN c.unidad_origen = 'arroba' AND c.unidad_destino = 'lata' 
                            THEN c.factor_conversion END), 2) AS arrobas_necesarias,
                    ROUND((${total_unidades} / MAX(CASE 
                        WHEN c.unidad_origen = 'lata' AND c.unidad_destino = 'unidad' 
                        THEN c.factor_conversion END))
                        / MAX(CASE 
                            WHEN c.unidad_origen = 'arroba' AND c.unidad_destino = 'lata' 
                            THEN c.factor_conversion END) * 25, 2) AS libras_necesarias
            FROM productos p
            JOIN categorias cat ON p.categoria_id = cat.id
            LEFT JOIN conversiones c ON p.id = c.producto_id
            WHERE p.id = ?
            GROUP BY p.id, p.nombre, cat.nombre
        `, [producto_id]);
    
        if (!productInfo.length) {
            throw new Error('Producto no encontrado');
        }
    
        const info = productInfo[0];
    
        return {
            producto_id,
            producto_nombre: info.producto_nombre,
            categoria_nombre: info.categoria_nombre,
            total_unidades: Number(total_unidades),
            latas_necesarias: Number(info.latas_necesarias),
            arrobas_necesarias: Number(info.arrobas_necesarias),
            libras_necesarias: Number(info.libras_necesarias)
        };
    } finally {
        connection.release();
    }
}
    
}

module.exports = OrderModel;