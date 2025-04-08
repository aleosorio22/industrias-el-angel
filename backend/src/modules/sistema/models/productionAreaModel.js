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

    static async checkCategoriesAssignment(categoryIds, excludeAreaId = null) {
        const assignments = [];
        
        for (const categoryId of categoryIds) {
            const query = excludeAreaId 
                ? `SELECT ap.id, ap.nombre, c.id as categoria_id, c.nombre as categoria_nombre
                   FROM areas_produccion ap
                   JOIN area_categoria ac ON ap.id = ac.area_id
                   JOIN categorias c ON c.id = ac.categoria_id
                   WHERE c.id = ? AND ap.id != ? AND ap.estado = "activo"`
                : `SELECT ap.id, ap.nombre, c.id as categoria_id, c.nombre as categoria_nombre
                   FROM areas_produccion ap
                   JOIN area_categoria ac ON ap.id = ac.area_id
                   JOIN categorias c ON c.id = ac.categoria_id
                   WHERE c.id = ? AND ap.estado = "activo"`;

            const params = excludeAreaId ? [categoryId, excludeAreaId] : [categoryId];
            const [results] = await db.execute(query, params);
            
            if (results.length > 0) {
                assignments.push({
                    categoryId,
                    categoryName: results[0].categoria_nombre,
                    areaId: results[0].id,
                    areaName: results[0].nombre
                });
            }
        }
        
        return assignments;
    }

    static async assignCategories(areaId, categoryIds) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Verificar asignaciones existentes
            const existingAssignments = await this.checkCategoriesAssignment(categoryIds, areaId);
            if (existingAssignments.length > 0) {
                const details = existingAssignments.map(a => 
                    `La categoría "${a.categoryName}" ya está asignada al área "${a.areaName}"`
                ).join(', ');
                throw new Error(`No se pueden asignar categorías duplicadas: ${details}`);
            }

            // Continuar con la asignación si no hay duplicados
            await connection.execute(
                'DELETE FROM area_categoria WHERE area_id = ?',
                [areaId]
            );

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

    static async getAssignedCategories() {
        const [results] = await db.execute(`
            SELECT ac.categoria_id, ap.nombre as area_nombre
            FROM area_categoria ac
            JOIN areas_produccion ap ON ap.id = ac.area_id
            WHERE ap.estado = "activo"
        `);
        return results;
    }
}

module.exports = ProductionAreaModel;