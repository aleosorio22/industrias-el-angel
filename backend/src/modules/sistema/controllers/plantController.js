const PlantModel = require('../models/plantModel');
const ProductionAreaModel = require('../models/productionAreaModel'); // Necesario para obtener todas las áreas

class PlantController {
    /**
     * Crea una nueva planta y opcionalmente le asigna áreas.
     */
    static async createPlant(req, res) {
        try {
            const { nombre, ubicacion, areas } = req.body; // areas es un array de IDs

            if (!nombre) {
                return res.status(400).json({ success: false, message: 'El nombre de la planta es requerido.' });
            }

            // Validar si las áreas a asignar ya están en otra planta
            if (areas && Array.isArray(areas) && areas.length > 0) {
                const existingAssignments = await PlantModel.checkAreaAssignment(areas);
                if (existingAssignments.length > 0) {
                     const details = existingAssignments.map(a =>
                        `El área "${a.area_nombre}" (ID: ${a.area_id}) ya está asignada a la planta "${a.planta_nombre}" (ID: ${a.planta_id})`
                    ).join('. ');
                    return res.status(400).json({
                        success: false,
                        message: `Conflicto de asignación: ${details}`
                    });
                }
            }

            const plantId = await PlantModel.create({ nombre, ubicacion });

            // Asignar áreas si se proporcionaron
            if (areas && Array.isArray(areas) && areas.length > 0) {
                await PlantModel.assignAreas(plantId, areas);
            }

            res.status(201).json({
                success: true,
                message: 'Planta de producción creada exitosamente',
                data: { id: plantId }
            });
        } catch (error) {
            console.error('Error al crear planta:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error al crear la planta de producción'
            });
        }
    }

    /**
     * Obtiene todas las plantas (activas o todas).
     */
    static async getAllPlants(req, res) {
        try {
            const includeInactive = req.query.includeInactive === 'true';
            const plants = await PlantModel.getAll(includeInactive);
            res.json({
                success: true,
                data: plants
            });
        } catch (error) {
            console.error('Error al obtener plantas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener las plantas de producción'
            });
        }
    }

    /**
     * Obtiene una planta por ID, incluyendo sus áreas asignadas.
     */
    static async getPlantById(req, res) {
        try {
            const plantId = req.params.id;
            const plant = await PlantModel.findById(plantId);

            if (!plant) {
                return res.status(404).json({
                    success: false,
                    message: 'Planta de producción no encontrada'
                });
            }

            // Obtener áreas asignadas a esta planta
            const assignedAreas = await PlantModel.getPlantAreas(plantId);
            plant.areas = assignedAreas; // Añadir las áreas al objeto planta

            res.json({
                success: true,
                data: plant
            });
        } catch (error) {
            console.error('Error al obtener planta por ID:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener la planta de producción'
            });
        }
    }

    /**
     * Actualiza una planta y/o sus áreas asignadas.
     */
    static async updatePlant(req, res) {
        try {
            const plantId = req.params.id;
            const { nombre, ubicacion, areas } = req.body; // areas es un array de IDs

            // 1. Validar que la planta exista (opcional, update lo hará implícitamente)
            const plantExists = await PlantModel.findById(plantId);
            if (!plantExists) {
                 return res.status(404).json({ success: false, message: 'Planta no encontrada.' });
            }

            // 2. Validar asignación de áreas (excluyendo la planta actual)
             if (areas && Array.isArray(areas)) { // Permitir enviar array vacío para desasignar todo
                const existingAssignments = await PlantModel.checkAreaAssignment(areas, plantId);
                 if (existingAssignments.length > 0) {
                     const details = existingAssignments.map(a =>
                        `El área "${a.area_nombre}" (ID: ${a.area_id}) ya está asignada a la planta "${a.planta_nombre}" (ID: ${a.planta_id})`
                    ).join('. ');
                    return res.status(400).json({
                        success: false,
                        message: `Conflicto de asignación: ${details}`
                    });
                }
            }

            // 3. Actualizar datos de la planta (si se proporcionaron)
            if (nombre !== undefined || ubicacion !== undefined) {
                 const updateData = {};
                 if (nombre !== undefined) updateData.nombre = nombre;
                 if (ubicacion !== undefined) updateData.ubicacion = ubicacion;
                 await PlantModel.update(plantId, updateData);
            }


            // 4. Actualizar asignación de áreas (si se proporcionó el array 'areas')
            // Si 'areas' no está en el body, no se modifica la asignación existente.
            // Si 'areas' es un array (incluso vacío), se procede a reasignar.
            if (areas && Array.isArray(areas)) {
                 await PlantModel.assignAreas(plantId, areas);
            }


            res.json({
                success: true,
                message: 'Planta de producción actualizada exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar planta:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error al actualizar la planta de producción'
            });
        }
    }

    /**
     * Elimina (marca como inactiva) una planta.
     */
    static async deletePlant(req, res) {
        try {
            const success = await PlantModel.delete(req.params.id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Planta de producción no encontrada'
                });
            }
            res.json({
                success: true,
                message: 'Planta de producción eliminada (inactivada) exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar planta:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar la planta de producción'
            });
        }
    }

    /**
     * Restaura una planta inactiva.
     */
    static async restorePlant(req, res) {
        try {
            const success = await PlantModel.restore(req.params.id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Planta de producción no encontrada o ya activa'
                });
            }
            res.json({
                success: true,
                message: 'Planta de producción restaurada exitosamente'
            });
        } catch (error) {
            console.error('Error al restaurar planta:', error);
            res.status(500).json({
                success: false,
                message: 'Error al restaurar la planta de producción'
            });
        }
    }

     /**
     * Asigna áreas a una planta (endpoint dedicado si se prefiere).
     * Este método es redundante si updatePlant ya maneja la asignación,
     * pero puede ser útil tenerlo separado.
     */
    static async assignAreasToPlant(req, res) {
        try {
            const plantId = req.params.id;
            const { area_ids } = req.body; // Espera un array de IDs: { "area_ids": [1, 2, 3] }

            if (!Array.isArray(area_ids)) {
                 return res.status(400).json({ success: false, message: 'Se requiere un array de IDs de área (area_ids).' });
            }

            // Validar que la planta exista
            const plantExists = await PlantModel.findById(plantId);
            if (!plantExists) {
                 return res.status(404).json({ success: false, message: 'Planta no encontrada.' });
            }
             if (plantExists.estado !== 'activo') {
                 return res.status(400).json({ success: false, message: 'No se pueden asignar áreas a una planta inactiva.' });
            }

            // La validación de asignación duplicada y la transacción están dentro de assignAreas
            await PlantModel.assignAreas(plantId, area_ids);

            res.json({
                success: true,
                message: `Áreas asignadas correctamente a la planta ${plantId}`
            });

        } catch (error) {
            console.error('Error al asignar áreas a planta:', error);
             // Devolver el mensaje de error específico de la validación si existe
            res.status(error.message.startsWith('Conflicto de asignación:') ? 400 : 500).json({
                success: false,
                message: error.message || 'Error al asignar áreas a la planta'
            });
        }
    }

     /**
     * Obtiene todas las áreas de producción disponibles (para UI de asignación).
     * Podríamos añadir lógica para mostrar cuáles ya están asignadas.
     */
    /**
     * Obtiene todas las áreas de producción disponibles, indicando a qué planta están asignadas.
     */
    static async getAvailableAreas(req, res) {
        try {
            const areasConAsignacion = await PlantModel.getAvailableAreas();
            
            return res.json({
                success: true,
                data: areasConAsignacion
            });
        } catch (error) {
            console.error("Error al obtener áreas disponibles:", error);
            return res.status(500).json({
                success: false,
                message: "Error al obtener las áreas de producción disponibles"
            });
        }
    }
}

module.exports = PlantController;