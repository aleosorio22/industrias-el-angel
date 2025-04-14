const db = require('../../../core/config/database');

class UserProductionAreaModel {
    static async validateUserForAssignment(userId) {
        const [users] = await db.execute(
            'SELECT rol FROM usuarios WHERE id = ? AND estado = "activo"',
            [userId]
        );

        if (users.length === 0) {
            throw new Error('Usuario no encontrado o inactivo');
        }

        const user = users[0];
        if (user.rol !== 'admin' && user.rol !== 'produccion') {
            throw new Error('Solo usuarios con rol admin o produccion pueden ser asignados a áreas de producción');
        }

        return true;
    }

    static async assignUserToArea(userId, areaId) {
        try {
            // Validar que el usuario tenga el rol correcto
            await this.validateUserForAssignment(userId);

            // Validar que el área exista y esté activa
            const [areas] = await db.execute(
                'SELECT id FROM areas_produccion WHERE id = ? AND estado = "activo"',
                [areaId]
            );

            if (areas.length === 0) {
                throw new Error('Área de producción no encontrada o inactiva');
            }

            const [result] = await db.execute(
                'INSERT INTO usuarios_area_produccion (usuario_id, area_id) VALUES (?, ?)',
                [userId, areaId]
            );
            return result.insertId;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El usuario ya está asignado a esta área');
            }
            throw error;
        }
    }

    static async removeUserFromArea(userId, areaId) {
        const [result] = await db.execute(
            'DELETE FROM usuarios_area_produccion WHERE usuario_id = ? AND area_id = ?',
            [userId, areaId]
        );
        return result.affectedRows > 0;
    }

    static async getUserAreas(userId) {
        const [areas] = await db.execute(`
            SELECT ap.* 
            FROM areas_produccion ap
            JOIN usuarios_area_produccion uap ON ap.id = uap.area_id
            WHERE uap.usuario_id = ? AND ap.estado = 'activo'`,
            [userId]
        );
        return areas;
    }

    static async getAreaUsers(areaId) {
        const [users] = await db.execute(`
            SELECT u.id, u.nombre, u.email, u.rol
            FROM usuarios u
            JOIN usuarios_area_produccion uap ON u.id = uap.usuario_id
            WHERE uap.area_id = ? AND u.estado = 'activo'`,
            [areaId]
        );
        return users;
    }

    static async updateUserAreas(userId, areaIds) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Eliminar asignaciones existentes
            await connection.execute(
                'DELETE FROM usuarios_area_produccion WHERE usuario_id = ?',
                [userId]
            );

            // Insertar nuevas asignaciones
            for (const areaId of areaIds) {
                await connection.execute(
                    'INSERT INTO usuarios_area_produccion (usuario_id, area_id) VALUES (?, ?)',
                    [userId, areaId]
                );
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAvailableUsers() {
        const [users] = await db.execute(`
            SELECT id, nombre, email, rol 
            FROM usuarios 
            WHERE estado = 'activo' 
            AND rol IN ('admin', 'produccion')
            ORDER BY nombre
        `);
        return users;
    }
}

module.exports = UserProductionAreaModel;