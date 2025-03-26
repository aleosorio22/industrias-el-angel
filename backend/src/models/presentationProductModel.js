const db = require('../config/database');

class PresentationProductModel {
    static async create(presentationData) {
        const { producto_id, presentacion_id, cantidad, precio } = presentationData;
        
        // Validate unique presentation for product
        const [existing] = await db.execute(
            'SELECT id FROM producto_presentacion WHERE producto_id = ? AND presentacion_id = ?',
            [producto_id, presentacion_id]
        );

        if (existing.length > 0) {
            throw new Error('Ya existe esta presentación para este producto');
        }

        const [result] = await db.execute(
            'INSERT INTO producto_presentacion (producto_id, presentacion_id, cantidad, precio) VALUES (?, ?, ?, ?)',
            [producto_id, presentacion_id, cantidad, precio]
        );
        return result.insertId;
    }

    static async getByProductId(productId) {
        const [presentations] = await db.execute(
            `SELECT pp.*, p.nombre as presentacion_nombre, p.descripcion as presentacion_descripcion
             FROM producto_presentacion pp
             JOIN presentaciones p ON pp.presentacion_id = p.id
             WHERE pp.producto_id = ?`,
            [productId]
        );
        return presentations;
    }

    static async update(id, presentationData) {
        const { cantidad, precio } = presentationData;
        const [result] = await db.execute(
            'UPDATE producto_presentacion SET cantidad = ?, precio = ? WHERE id = ?',
            [cantidad, precio, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM producto_presentacion WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async validatePresentation(cantidad, precio) {
        if (cantidad <= 0) {
            throw new Error('La cantidad debe ser mayor que 0');
        }
        if (precio < 0) {
            throw new Error('El precio no puede ser negativo');
        }
        return true;
    }
}

module.exports = PresentationProductModel;