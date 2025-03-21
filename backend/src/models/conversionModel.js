const db = require('../config/database');

class ConversionModel {
    static async create(conversionData) {
        const { producto_id, unidad_origen_id, unidad_destino_id, factor_conversion } = conversionData;
        
        // Validate unique conversion
        const [existing] = await db.execute(
            'SELECT id FROM conversion_unidades WHERE producto_id = ? AND unidad_origen_id = ? AND unidad_destino_id = ?',
            [producto_id, unidad_origen_id, unidad_destino_id]
        );

        if (existing.length > 0) {
            throw new Error('Ya existe una conversión para estas unidades');
        }

        const [result] = await db.execute(
            'INSERT INTO conversion_unidades (producto_id, unidad_origen_id, unidad_destino_id, factor_conversion) VALUES (?, ?, ?, ?)',
            [producto_id, unidad_origen_id, unidad_destino_id, factor_conversion]
        );
        return result.insertId;
    }

    static async getByProductId(productId) {
        const [conversions] = await db.execute(
            `SELECT cu.*, 
                    u1.nombre as unidad_origen_nombre, 
                    u2.nombre as unidad_destino_nombre
             FROM conversion_unidades cu
             JOIN unidades u1 ON cu.unidad_origen_id = u1.id
             JOIN unidades u2 ON cu.unidad_destino_id = u2.id
             WHERE cu.producto_id = ?`,
            [productId]
        );
        return conversions;
    }

    static async update(id, conversionData) {
        const { factor_conversion } = conversionData;
        const [result] = await db.execute(
            'UPDATE conversion_unidades SET factor_conversion = ? WHERE id = ?',
            [factor_conversion, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM conversion_unidades WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async validateConversion(unidad_origen_id, unidad_destino_id) {
        if (unidad_origen_id === unidad_destino_id) {
            throw new Error('Las unidades de origen y destino deben ser diferentes');
        }
        return true;
    }
}

module.exports = ConversionModel;