const db = require('../../../core/config/database');

class TemplateModel {
    /**
     * Crea una nueva plantilla de pedido
     * @param {Object} templateData - Datos de la plantilla
     * @returns {Promise<number>} - ID de la plantilla creada
     */
    static async create(templateData) {
        const { usuario_id, nombre, productos } = templateData;
        
        // Iniciar transacción
        const connection = await db.getConnection();
        await connection.beginTransaction();
        
        try {
            // Validar que los productos y presentaciones existan
            for (const producto of productos) {
                // Verificar que el producto existe
                const [productRows] = await connection.execute(
                    'SELECT id FROM productos WHERE id = ?',
                    [producto.producto_id]
                );
                
                if (productRows.length === 0) {
                    throw new Error(`El producto con ID ${producto.producto_id} no existe`);
                }
                
                // Verificar que la presentación existe
                const [presentationRows] = await connection.execute(
                    'SELECT id FROM presentaciones WHERE id = ?',
                    [producto.presentacion_id]
                );
                
                if (presentationRows.length === 0) {
                    throw new Error(`La presentación con ID ${producto.presentacion_id} no existe`);
                }
                
                // Verificar que la combinación producto-presentación existe
                const [productPresentationRows] = await connection.execute(
                    'SELECT * FROM producto_presentacion WHERE producto_id = ? AND presentacion_id = ?',
                    [producto.producto_id, producto.presentacion_id]
                );
                
                if (productPresentationRows.length === 0) {
                    throw new Error(`La combinación de producto ${producto.producto_id} y presentación ${producto.presentacion_id} no es válida`);
                }
            }
            
            // Insertar la plantilla
            const [templateResult] = await connection.execute(
                'INSERT INTO plantillas_pedidos (usuario_id, nombre, fecha_creacion) VALUES (?, ?, NOW())',
                [usuario_id, nombre]
            );
            
            const templateId = templateResult.insertId;
            
            // Insertar los detalles de la plantilla
            for (const producto of productos) {
                await connection.execute(
                    'INSERT INTO plantilla_pedido_detalle (plantilla_id, producto_id, presentacion_id, cantidad) VALUES (?, ?, ?, ?)',
                    [templateId, producto.producto_id, producto.presentacion_id, producto.cantidad]
                );
            }
            
            // Confirmar transacción
            await connection.commit();
            connection.release();
            
            return templateId;
        } catch (error) {
            // Revertir transacción en caso de error
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
    
    /**
     * Obtiene todas las plantillas de un usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} - Lista de plantillas
     */
    static async findByUserId(userId) {
        const [templates] = await db.execute(`
            SELECT id, nombre, fecha_creacion
            FROM plantillas_pedidos
            WHERE usuario_id = ?
            ORDER BY nombre ASC
        `, [userId]);
        
        return templates;
    }
    
    /**
     * Obtiene todas las plantillas (para administradores)
     * @returns {Promise<Array>} - Lista de todas las plantillas
     */
    static async findAll() {
        const [templates] = await db.execute(`
            SELECT p.id, p.nombre, p.fecha_creacion, u.email as usuario_email
            FROM plantillas_pedidos p
            JOIN usuarios u ON p.usuario_id = u.id
            ORDER BY p.nombre ASC
        `);
        
        return templates;
    }
    
    /**
     * Obtiene una plantilla por su ID con todos sus detalles
     * @param {number} id - ID de la plantilla
     * @returns {Promise<Object>} - Plantilla con sus detalles
     */
    static async findById(id) {
        // Obtener información básica de la plantilla
        const [templates] = await db.execute(`
            SELECT p.*, u.email as usuario_email
            FROM plantillas_pedidos p
            JOIN usuarios u ON p.usuario_id = u.id
            WHERE p.id = ?
        `, [id]);
        
        if (templates.length === 0) return null;
        
        // Obtener los detalles de la plantilla con información de productos y presentaciones
        const [details] = await db.execute(`
            SELECT pd.*,
                   pr.nombre as producto_nombre,
                   pr.codigo as producto_codigo,
                   pres.nombre as presentacion_nombre,
                   pp.cantidad as cantidad_por_presentacion
            FROM plantilla_pedido_detalle pd
            JOIN productos pr ON pd.producto_id = pr.id
            JOIN producto_presentacion pp ON (pd.producto_id = pp.producto_id AND pd.presentacion_id = pp.presentacion_id)
            JOIN presentaciones pres ON pd.presentacion_id = pres.id
            WHERE pd.plantilla_id = ?
        `, [id]);
        
        // Combinar la plantilla con sus detalles
        const template = templates[0];
        template.productos = details;
        
        return template;
    }
    
    /**
     * Elimina una plantilla por su ID
     * @param {number} id - ID de la plantilla
     * @returns {Promise<boolean>} - true si se eliminó correctamente
     */
    static async delete(id) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        
        try {
            // Eliminar primero los detalles
            await connection.execute(
                'DELETE FROM plantilla_pedido_detalle WHERE plantilla_id = ?',
                [id]
            );
            
            // Luego eliminar la plantilla
            const [result] = await connection.execute(
                'DELETE FROM plantillas_pedidos WHERE id = ?',
                [id]
            );
            
            await connection.commit();
            connection.release();
            
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
    
    /**
     * Actualiza una plantilla existente
     * @param {Object} templateData - Datos de la plantilla a actualizar
     * @returns {Promise<boolean>} - true si se actualizó correctamente
     */
    static async update(templateData) {
        const { id, nombre, productos } = templateData;
        
        // Iniciar transacción
        const connection = await db.getConnection();
        await connection.beginTransaction();
        
        try {
            // Validar que los productos y presentaciones existan
            for (const producto of productos) {
                // Verificar que el producto existe
                const [productRows] = await connection.execute(
                    'SELECT id FROM productos WHERE id = ?',
                    [producto.producto_id]
                );
                
                if (productRows.length === 0) {
                    throw new Error(`El producto con ID ${producto.producto_id} no existe`);
                }
                
                // Verificar que la presentación existe
                const [presentationRows] = await connection.execute(
                    'SELECT id FROM presentaciones WHERE id = ?',
                    [producto.presentacion_id]
                );
                
                if (presentationRows.length === 0) {
                    throw new Error(`La presentación con ID ${producto.presentacion_id} no existe`);
                }
                
                // Verificar que la combinación producto-presentación existe
                const [productPresentationRows] = await connection.execute(
                    'SELECT * FROM producto_presentacion WHERE producto_id = ? AND presentacion_id = ?',
                    [producto.producto_id, producto.presentacion_id]
                );
                
                if (productPresentationRows.length === 0) {
                    throw new Error(`La combinación de producto ${producto.producto_id} y presentación ${producto.presentacion_id} no es válida`);
                }
            }
            
            // Actualizar el nombre de la plantilla
            await connection.execute(
                'UPDATE plantillas_pedidos SET nombre = ? WHERE id = ?',
                [nombre, id]
            );
            
            // Eliminar todos los detalles existentes
            await connection.execute(
                'DELETE FROM plantilla_pedido_detalle WHERE plantilla_id = ?',
                [id]
            );
            
            // Insertar los nuevos detalles
            for (const producto of productos) {
                await connection.execute(
                    'INSERT INTO plantilla_pedido_detalle (plantilla_id, producto_id, presentacion_id, cantidad) VALUES (?, ?, ?, ?)',
                    [id, producto.producto_id, producto.presentacion_id, producto.cantidad]
                );
            }
            
            // Confirmar transacción
            await connection.commit();
            connection.release();
            
            return true;
        } catch (error) {
            // Revertir transacción en caso de error
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
}

module.exports = TemplateModel;