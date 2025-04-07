const PresentationProductModel = require('../models/presentationProductModel');

exports.createPresentation = async (req, res) => {
    try {
        const { cantidad, precio } = req.body;
        
        // Validate data
        await PresentationProductModel.validatePresentation(cantidad, precio);

        const presentationId = await PresentationProductModel.create(req.body);
        res.status(201).json({ 
            message: 'Presentación creada exitosamente',
            presentationId 
        });
    } catch (error) {
        if (error.message.includes('Ya existe')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.getProductPresentations = async (req, res) => {
    try {
        const presentations = await PresentationProductModel.getByProductId(req.params.productId);
        res.json(presentations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePresentation = async (req, res) => {
    try {
        const { cantidad, precio } = req.body;
        
        await PresentationProductModel.validatePresentation(cantidad, precio);

        const success = await PresentationProductModel.update(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Presentación no encontrada' });
        }
        res.json({ message: 'Presentación actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePresentation = async (req, res) => {
    try {
        const success = await PresentationProductModel.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Presentación no encontrada' });
        }
        res.json({ message: 'Presentación eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};