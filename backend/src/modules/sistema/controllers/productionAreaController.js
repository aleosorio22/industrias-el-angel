const ProductionAreaModel = require('../models/productionAreaModel');

class ProductionAreaController {
    static async createArea(req, res) {
        try {
            // Verificar asignaciones antes de crear
            if (req.body.categorias && Array.isArray(req.body.categorias)) {
                const existingAssignments = await ProductionAreaModel.checkCategoriesAssignment(req.body.categorias);
                if (existingAssignments.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Error de validación',
                        details: existingAssignments.map(a => ({
                            message: `La categoría "${a.categoryName}" ya está asignada al área "${a.areaName}"`,
                            categoryId: a.categoryId,
                            areaId: a.areaId
                        }))
                    });
                }
            }

            const areaId = await ProductionAreaModel.create(req.body);
            
            if (req.body.categorias && Array.isArray(req.body.categorias)) {
                await ProductionAreaModel.assignCategories(areaId, req.body.categorias);
            }

            res.status(201).json({
                success: true,
                message: 'Área de producción creada exitosamente',
                data: { id: areaId }
            });
        } catch (error) {
            console.error('Error al crear área de producción:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error al crear el área de producción'
            });
        }
    }

    static async updateArea(req, res) {
        try {
            // Para actualización, excluimos el área actual de la validación
            if (req.body.categorias && Array.isArray(req.body.categorias)) {
                const existingAssignments = await ProductionAreaModel.checkCategoriesAssignment(
                    req.body.categorias,
                    req.params.id
                );
                if (existingAssignments.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Error de validación',
                        details: existingAssignments.map(a => ({
                            message: `La categoría "${a.categoryName}" ya está asignada al área "${a.areaName}"`,
                            categoryId: a.categoryId,
                            areaId: a.areaId
                        }))
                    });
                }
            }

            const success = await ProductionAreaModel.update(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Área de producción no encontrada'
                });
            }

            if (req.body.categorias && Array.isArray(req.body.categorias)) {
                await ProductionAreaModel.assignCategories(req.params.id, req.body.categorias);
            }

            res.json({
                success: true,
                message: 'Área de producción actualizada exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar área:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error al actualizar el área de producción'
            });
        }
    }

    static async getAllAreas(req, res) {
        try {
            const includeInactive = req.query.includeInactive === 'true';
            const areas = await ProductionAreaModel.getAll(includeInactive);
            res.json({
                success: true,
                data: areas
            });
        } catch (error) {
            console.error('Error al obtener áreas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener las áreas de producción'
            });
        }
    }

    static async getAreaById(req, res) {
        try {
            const area = await ProductionAreaModel.findById(req.params.id);
            if (!area) {
                return res.status(404).json({
                    success: false,
                    message: 'Área de producción no encontrada'
                });
            }

            // Get categories assigned to this area
            const categories = await ProductionAreaModel.getAreaCategories(req.params.id);
            area.categorias = categories;

            res.json({
                success: true,
                data: area
            });
        } catch (error) {
            console.error('Error al obtener área:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el área de producción'
            });
        }
    }

    static async updateArea(req, res) {
        try {
            const areaId = req.params.id;
            
            // First validate categories assignment
            if (req.body.categorias && Array.isArray(req.body.categorias)) {
                const existingAssignments = await ProductionAreaModel.checkCategoriesAssignment(
                    req.body.categorias,
                    areaId
                );
                
                if (existingAssignments.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No se pueden asignar categorías que ya están en uso',
                        details: existingAssignments.map(a => ({
                            message: `La categoría "${a.categoryName}" ya está asignada al área "${a.areaName}"`,
                            categoryId: a.categoryId,
                            areaId: a.areaId
                        }))
                    });
                }
            }

            // Then proceed with the update
            const success = await ProductionAreaModel.update(areaId, req.body);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Área de producción no encontrada o inactiva'
                });
            }

            // Update categories if provided
            if (req.body.categorias && Array.isArray(req.body.categorias)) {
                await ProductionAreaModel.assignCategories(areaId, req.body.categorias);
            }

            res.json({
                success: true,
                message: 'Área de producción actualizada exitosamente'
            });

        } catch (error) {
            console.error('Error al actualizar área:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error al actualizar el área de producción',
                details: error.details || null
            });
        }
    }

    static async deleteArea(req, res) {
        try {
            const success = await ProductionAreaModel.delete(req.params.id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Área de producción no encontrada'
                });
            }
            res.json({
                success: true,
                message: 'Área de producción eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar área:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el área de producción'
            });
        }
    }

    static async restoreArea(req, res) {
        try {
            const success = await ProductionAreaModel.restore(req.params.id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Área de producción no encontrada'
                });
            }
            res.json({
                success: true,
                message: 'Área de producción restaurada exitosamente'
            });
        } catch (error) {
            console.error('Error al restaurar área:', error);
            res.status(500).json({
                success: false,
                message: 'Error al restaurar el área de producción'
            });
        }
    }

    static async getAssignedCategories(req, res) {
        try {
            const assignments = await ProductionAreaModel.getAssignedCategories();
            res.json({
                success: true,
                data: assignments
            });
        } catch (error) {
            console.error('Error al obtener categorías asignadas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener las categorías asignadas'
            });
        }
    }
}

module.exports = ProductionAreaController;