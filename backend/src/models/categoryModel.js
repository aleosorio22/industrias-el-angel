const db = require('../config/database');

class CategoryModel {
    static async create(categoryData) {
        const { nombre, descripcion } = categoryData;
        const [result] = await db.execute(
            'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion]
        );
        return result.insertId;
    }

    static async getAll() {
        const [categories] = await db.execute(
            'SELECT * FROM categorias WHERE estado = "activo"'
        );
        return categories;
    }

    static async findById(id) {
        const [categories] = await db.execute(
            'SELECT * FROM categorias WHERE id = ? AND estado = "activo"',
            [id]
        );
        return categories[0];
    }

    static async update(id, categoryData) {
        const { nombre, descripcion } = categoryData;
        const [result] = await db.execute(
            'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ? AND estado = "activo"',
            [nombre, descripcion, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'UPDATE categorias SET estado = "inactivo" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async restore(id) {
        const [result] = await db.execute(
            'UPDATE categorias SET estado = "activo" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = CategoryModel;