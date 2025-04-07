const db = require('../../../core/config/database');

class ProductModel {
    static async create(productData) {
        const { codigo, nombre, descripcion, categoria_id, unidad_base_id, precio_base } = productData;
        const [result] = await db.execute(
            'INSERT INTO productos (codigo, nombre, descripcion, categoria_id, unidad_base_id, precio_base) VALUES (?, ?, ?, ?, ?, ?)',
            [codigo, nombre, descripcion, categoria_id, unidad_base_id, precio_base]
        );
        return result.insertId;
    }

    static async getAll(includeInactive = false) {
        const query = includeInactive 
            ? 'SELECT p.*, c.nombre as categoria_nombre, u.nombre as unidad_nombre, u.simbolo as unidad_simbolo FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id LEFT JOIN unidades u ON p.unidad_base_id = u.id'
            : 'SELECT p.*, c.nombre as categoria_nombre, u.nombre as unidad_nombre, u.simbolo as unidad_simbolo FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id LEFT JOIN unidades u ON p.unidad_base_id = u.id WHERE p.estado = "activo"';
        const [products] = await db.execute(query);
        return products;
    }

    static async findById(id) {
        const [products] = await db.execute(
            'SELECT p.*, c.nombre as categoria_nombre, u.nombre as unidad_nombre, u.simbolo as unidad_simbolo FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id LEFT JOIN unidades u ON p.unidad_base_id = u.id WHERE p.id = ?',
            [id]
        );
        return products[0];
    }

    static async update(id, productData) {
        const { codigo, nombre, descripcion, categoria_id, unidad_base_id, precio_base } = productData;
        const [result] = await db.execute(
            'UPDATE productos SET codigo = ?, nombre = ?, descripcion = ?, categoria_id = ?, unidad_base_id = ?, precio_base = ? WHERE id = ? AND estado = "activo"',
            [codigo, nombre, descripcion, categoria_id, unidad_base_id, precio_base, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'UPDATE productos SET estado = "inactivo" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async restore(id) {
        const [result] = await db.execute(
            'UPDATE productos SET estado = "activo" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async checkCodeExists(codigo, excludeId = null) {
        const query = excludeId
            ? 'SELECT id FROM productos WHERE codigo = ? AND id != ?'
            : 'SELECT id FROM productos WHERE codigo = ?';
        const params = excludeId ? [codigo, excludeId] : [codigo];
        const [products] = await db.execute(query, params);
        return products.length > 0;
    }
}

module.exports = ProductModel;