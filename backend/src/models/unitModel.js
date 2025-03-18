const db = require('../config/database');

class UnitModel {
    static async create(unitData) {
        const { nombre, simbolo, descripcion } = unitData;
        const [result] = await db.execute(
            'INSERT INTO unidades (nombre, simbolo, descripcion) VALUES (?, ?, ?)',
            [nombre, simbolo, descripcion]
        );
        return result.insertId;
    }

    static async getAll() {
        const [units] = await db.execute(
            'SELECT * FROM unidades WHERE estado = "activo"'
        );
        return units;
    }

    static async findById(id) {
        const [units] = await db.execute(
            'SELECT * FROM unidades WHERE id = ? AND estado = "activo"',
            [id]
        );
        return units[0];
    }

    static async update(id, unitData) {
        const { nombre, simbolo, descripcion } = unitData;
        const [result] = await db.execute(
            'UPDATE unidades SET nombre = ?, simbolo = ?, descripcion = ? WHERE id = ? AND estado = "activo"',
            [nombre, simbolo, descripcion, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'UPDATE unidades SET estado = "inactivo" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
    static async restore(id) {
        const [result] = await db.execute(
            'UPDATE unidades SET estado = "activo" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = UnitModel;