const db = require('../config/database');

class PresentationModel {
    static async create(presentationData) {
        const { nombre, descripcion } = presentationData;
        const [result] = await db.execute(
            'INSERT INTO presentaciones (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion]
        );
        return result.insertId;
    }

    static async getAll() {
        const [presentations] = await db.execute(
            'SELECT * FROM presentaciones WHERE estado = "activo"'
        );
        return presentations;
    }

    static async findById(id) {
        const [presentations] = await db.execute(
            'SELECT * FROM presentaciones WHERE id = ? AND estado = "activo"',
            [id]
        );
        return presentations[0];
    }

    static async update(id, presentationData) {
        const { nombre, descripcion } = presentationData;
        const [result] = await db.execute(
            'UPDATE presentaciones SET nombre = ?, descripcion = ? WHERE id = ? AND estado = "activo"',
            [nombre, descripcion, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'UPDATE presentaciones SET estado = "inactivo" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
    static async restore(id) {
        const [result] = await db.execute(
            'UPDATE presentaciones SET estado = "activo" WHERE id =?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = PresentationModel;