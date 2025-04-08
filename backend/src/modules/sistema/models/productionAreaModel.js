const db = require('../../../core/config/database');

class ProductionAreaModel {
    static async create(areaData) {
        const { nombre, descripcion } = areaData;
        const [result] = await db.execute(
            'INSERT INTO areas_produccion (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion]
        );
        return result.insertId;
    }

    static async getAll(includeInactive = false) {
        const query = includeInactive 
            ? 'SELECT * FROM areas_produccion'
            : 'SELECT * FROM areas_produccion WHERE estado = "activo"';
        const [areas] = await db.execute(query);
        return areas;
    }

    static async findById(id) {
        const [areas] = await db.execute(
            'SELECT * FROM areas_produccion WHERE id = ?',
            [id]
        );
        return areas[0];
    }

    static async update(id, areaData) {
        const { nombre, descripcion } = areaData;
        const [result] = await db.execute(
            'UPDATE areas_produccion SET nombre = ?, descripcion = ? WHERE id = ? AND estado = "activo"',
            [nombre, descripcion, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'UPDATE areas_produccion SET estado = "inactivo" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async restore(id) {
        const [result] = await db.execute(
            'UPDATE areas_produccion SET estado = "activo" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async assignCategories(areaId, categoryIds) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Delete existing assignments
            await connection.execute(
                'DELETE FROM area_categoria WHERE area_id = ?',
                [areaId]
            );

            // Insert new assignments
            for (const categoryId of categoryIds) {
                await connection.execute(
                    'INSERT INTO area_categoria (area_id, categoria_id) VALUES (?, ?)',
                    [areaId, categoryId]
                );
            }

            await connection.commit();
            connection.release();
            return true;
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }

    static async getAreaCategories(areaId) {
        const [categories] = await db.execute(
            `SELECT c.* 
             FROM categorias c
             JOIN area_categoria ac ON c.id = ac.categoria_id
             WHERE ac.area_id = ? AND c.estado = "activo"`,
            [areaId]
        );
        return categories;
    }
}

module.exports = ProductionAreaModel;