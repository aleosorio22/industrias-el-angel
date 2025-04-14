const UserProductionAreaModel = require('../models/userProductionAreaModel');

class UserProductionAreaController {
    static async assignUserToArea(req, res) {
        try {
            const { userId, areaId } = req.body;
            await UserProductionAreaModel.assignUserToArea(userId, areaId);
            res.json({
                success: true,
                message: 'Usuario asignado al área exitosamente'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error al asignar usuario al área'
            });
        }
    }

    static async removeUserFromArea(req, res) {
        try {
            const { userId, areaId } = req.params;
            const result = await UserProductionAreaModel.removeUserFromArea(userId, areaId);
            if (result) {
                res.json({
                    success: true,
                    message: 'Usuario removido del área exitosamente'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'No se encontró la asignación'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al remover usuario del área'
            });
        }
    }

    static async getUserAreas(req, res) {
        try {
            const { userId } = req.params;
            const areas = await UserProductionAreaModel.getUserAreas(userId);
            res.json({
                success: true,
                data: areas
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener áreas del usuario'
            });
        }
    }

    static async getAreaUsers(req, res) {
        try {
            const { areaId } = req.params;
            const users = await UserProductionAreaModel.getAreaUsers(areaId);
            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuarios del área'
            });
        }
    }

    static async getAvailableUsers(req, res) {
        try {
            const users = await UserProductionAreaModel.getAvailableUsers();
            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuarios disponibles'
            });
        }
    }

    static async updateUserAreas(req, res) {
        try {
            const { userId } = req.params;
            const { areaIds } = req.body;
            
            if (!Array.isArray(areaIds)) {
                return res.status(400).json({
                    success: false,
                    message: 'El formato de las áreas no es válido'
                });
            }

            // Validar que el usuario tenga el rol correcto
            await UserProductionAreaModel.validateUserForAssignment(userId);

            await UserProductionAreaModel.updateUserAreas(userId, areaIds);
            res.json({
                success: true,
                message: 'Áreas del usuario actualizadas exitosamente'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error al actualizar áreas del usuario'
            });
        }
    }
}

module.exports = UserProductionAreaController;