const BranchModel = require('../models/branchModel');
const db = require('../../../core/config/database');

exports.createBranch = async (req, res) => {
    try {
        const branchId = await BranchModel.create(req.body);
        res.status(201).json({ 
            message: 'Sucursal creada exitosamente',
            branchId 
        });
    } catch (error) {
        if (error.message === 'Cliente no encontrado o inactivo' ||
            error.message === 'Ya existe una sucursal con este nombre para este cliente') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.getAllBranches = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const branches = await BranchModel.getAll(includeInactive);
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBranchesByClientId = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const branches = await BranchModel.getByClientId(req.params.clientId, includeInactive);
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBranchById = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const branch = await BranchModel.findById(req.params.id, includeInactive);
        if (!branch) {
            return res.status(404).json({ message: 'Sucursal no encontrada' });
        }
        res.json(branch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBranch = async (req, res) => {
    try {
        const success = await BranchModel.update(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Sucursal no encontrada' });
        }
        res.json({ message: 'Sucursal actualizada exitosamente' });
    } catch (error) {
        if (error.message === 'Ya existe otra sucursal con este nombre para este cliente') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBranch = async (req, res) => {
    try {
        const success = await BranchModel.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Sucursal no encontrada' });
        }
        res.json({ message: 'Sucursal eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.restoreBranch = async (req, res) => {
    try {
        const success = await BranchModel.restore(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Sucursal no encontrada' });
        }
        res.json({ message: 'Sucursal restaurada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyBranches = async (req, res) => {
    try {
        // Primero obtenemos el cliente asociado al usuario
        const [client] = await db.execute(
            'SELECT id FROM clientes WHERE usuario_id = ? AND estado = "activo"',
            [req.user.id]
        );
        
        if (client.length === 0) {
            // En lugar de devolver un error, devolvemos un array vacío
            // para que el frontend pueda manejarlo correctamente
            return res.json([]);
        }
        
        const branches = await BranchModel.getByClientId(client[0].id, false);
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
