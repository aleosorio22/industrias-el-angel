const UnitModel = require('../models/unitModel');

exports.createUnit = async (req, res) => {
    try {
        const unitId = await UnitModel.create(req.body);
        res.status(201).json({ 
            message: 'Unidad creada exitosamente',
            unitId 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUnits = async (req, res) => {
    try {
        const units = await UnitModel.getAll();
        res.json(units);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUnitById = async (req, res) => {
    try {
        const unit = await UnitModel.findById(req.params.id);
        if (!unit) {
            return res.status(404).json({ message: 'Unidad no encontrada' });
        }
        res.json(unit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUnit = async (req, res) => {
    try {
        const success = await UnitModel.update(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Unidad no encontrada' });
        }
        res.json({ message: 'Unidad actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUnit = async (req, res) => {
    try {
        const success = await UnitModel.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Unidad no encontrada' });
        }
        res.json({ message: 'Unidad eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.restoreUnit = async (req, res) => {
    try {
        const success = await UnitModel.restore(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Unidad no encontrada' });
        }
        res.json({ message: 'Unidad restaurada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};