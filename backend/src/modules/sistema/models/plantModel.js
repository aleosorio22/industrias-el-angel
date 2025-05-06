const db = require('../../../core/config/database');

class PlantModel {
    /**
     * Crea una nueva planta de producción.
     * @param {object} plantData - Datos de la planta { nombre, ubicacion }
     * @returns {Promise<number>} ID de la planta creada.
     */
    static async create(plantData) {
        const { nombre, ubicacion } = plantData;
        const [result] = await db.execute(
            'INSERT INTO plantas_produccion (nombre, ubicacion) VALUES (?, ?)',
            [nombre, ubicacion]
        );
        return result.insertId;
    }

    /**
     * Obtiene todas las plantas de producción.
     * @param {boolean} [includeInactive=false] - Si se deben incluir plantas inactivas.
     * @returns {Promise<Array<object>>} Lista de plantas.
     */
    static async getAll(includeInactive = false) {
        const query = includeInactive
            ? 'SELECT * FROM plantas_produccion'
            : 'SELECT * FROM plantas_produccion WHERE estado = "activo"';
        const [plants] = await db.execute(query);
        return plants;
    }

    /**
     * Busca una planta por su ID.
     * @param {number} id - ID de la planta.
     * @returns {Promise<object|null>} La planta encontrada o null.
     */
    static async findById(id) {
        const [plants] = await db.execute(
            'SELECT * FROM plantas_produccion WHERE id = ?',
            [id]
        );
        return plants[0] || null;
    }

    /**
     * Actualiza los datos de una planta.
     * @param {number} id - ID de la planta a actualizar.
     * @param {object} plantData - Datos a actualizar { nombre, ubicacion }
     * @returns {Promise<boolean>} True si se actualizó, false en caso contrario.
     */
    static async update(id, plantData) {
        const { nombre, ubicacion } = plantData;
        // Asegúrate de que solo actualizas plantas activas o según tu lógica de negocio
        const [result] = await db.execute(
            'UPDATE plantas_produccion SET nombre = ?, ubicacion = ? WHERE id = ?', // Podrías añadir AND estado = "activo" si es necesario
            [nombre, ubicacion, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Marca una planta como inactiva (soft delete).
     * @param {number} id - ID de la planta a eliminar.
     * @returns {Promise<boolean>} True si se marcó como inactiva, false en caso contrario.
     */
    static async delete(id) {
        // Antes de inactivar, podrías querer desasignar áreas o validar dependencias
        await db.execute('DELETE FROM planta_area WHERE planta_id = ?', [id]); // Desasigna áreas al inactivar planta
        const [result] = await db.execute(
            'UPDATE plantas_produccion SET estado = "inactivo" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Restaura una planta marcada como inactiva.
     * @param {number} id - ID de la planta a restaurar.
     * @returns {Promise<boolean>} True si se restauró, false en caso contrario.
     */
    static async restore(id) {
        const [result] = await db.execute(
            'UPDATE plantas_produccion SET estado = "activo" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Verifica si alguna de las áreas ya está asignada a OTRA planta.
     * @param {Array<number>} areaIds - IDs de las áreas a verificar.
     * @param {number|null} excludePlantId - ID de la planta actual (para permitir reasignación).
     * @returns {Promise<Array<object>>} Lista de áreas ya asignadas a otras plantas.
     */
    static async checkAreaAssignment(areaIds, excludePlantId = null) {
        if (!areaIds || areaIds.length === 0) {
            return [];
        }
        const placeholders = areaIds.map(() => '?').join(',');
        let query = `
            SELECT pa.area_id, ap.nombre AS area_nombre, pp.id AS planta_id, pp.nombre AS planta_nombre
            FROM planta_area pa
            JOIN areas_produccion ap ON pa.area_id = ap.id
            JOIN plantas_produccion pp ON pa.planta_id = pp.id
            WHERE pa.area_id IN (${placeholders}) AND pp.estado = "activo"
        `;
        const params = [...areaIds];

        if (excludePlantId !== null) {
            query += ' AND pa.planta_id != ?';
            params.push(excludePlantId);
        }

        const [assignments] = await db.execute(query, params);
        return assignments;
    }

    /**
     * Asigna un conjunto de áreas a una planta específica.
     * Elimina las asignaciones anteriores de esa planta y crea las nuevas.
     * @param {number} planta_id - ID de la planta.
     * @param {Array<number>} area_ids - Array de IDs de áreas a asignar.
     * @returns {Promise<boolean>} True si la operación fue exitosa.
     * @throws {Error} Si alguna área ya está asignada a otra planta.
     */
    static async assignAreas(planta_id, area_ids) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Validar que las áreas no estén asignadas a OTRA planta activa
            const existingAssignments = await this.checkAreaAssignment(area_ids, planta_id);
            if (existingAssignments.length > 0) {
                const details = existingAssignments.map(a =>
                    `El área "${a.area_nombre}" (ID: ${a.area_id}) ya está asignada a la planta "${a.planta_nombre}" (ID: ${a.planta_id})`
                ).join('. ');
                throw new Error(`Conflicto de asignación: ${details}`);
            }

            // 2. Eliminar asignaciones existentes SOLO para esta planta
            await connection.execute('DELETE FROM planta_area WHERE planta_id = ?', [planta_id]);

            // 3. Insertar las nuevas asignaciones
            if (area_ids && area_ids.length > 0) {
                const values = area_ids.map(area_id => [planta_id, area_id]);
                await connection.query(
                    'INSERT INTO planta_area (planta_id, area_id) VALUES ?',
                    [values]
                );
            }

            await connection.commit();
            connection.release();
            return true;
        } catch (error) {
            await connection.rollback();
            connection.release();
            console.error("Error en assignAreas:", error); // Log detallado del error
            throw error; // Re-lanzar para que el controlador lo maneje
        }
    }

     /**
     * Obtiene las áreas de producción asignadas a una planta específica.
     * @param {number} planta_id - ID de la planta.
     * @returns {Promise<Array<object>>} Lista de áreas asignadas.
     */
    static async getPlantAreas(planta_id) {
        const [areas] = await db.execute(
            `SELECT ap.*
             FROM areas_produccion ap
             JOIN planta_area pa ON ap.id = pa.area_id
             WHERE pa.planta_id = ? AND ap.estado = 'activo'`, // Asegurarse de traer solo áreas activas
            [planta_id]
        );
        return areas;
    }

    /**
     * Obtiene todas las áreas de producción con información de asignación a plantas.
     * @returns {Promise<Array<object>>} Lista de áreas con información de asignación.
     */
    static async getAvailableAreas() {
        // 1. Obtener todas las áreas activas
        const [areas] = await db.execute(
            'SELECT * FROM areas_produccion WHERE estado = "activo"'
        );
        
        // 2. Para cada área, verificar si está asignada a alguna planta
        const areasConAsignacion = await Promise.all(areas.map(async (area) => {
            const [asignaciones] = await db.execute(
                `SELECT pa.planta_id, pp.nombre as planta_nombre 
                 FROM planta_area pa 
                 JOIN plantas_produccion pp ON pa.planta_id = pp.id 
                 WHERE pa.area_id = ? AND pp.estado = "activo"`,
                [area.id]
            );
            
            return {
                ...area,
                asignada_a_planta_id: asignaciones.length > 0 ? asignaciones[0].planta_id : null,
                asignada_a_planta_nombre: asignaciones.length > 0 ? asignaciones[0].planta_nombre : null
            };
        }));
        
        return areasConAsignacion;
    }
}

module.exports = PlantModel;