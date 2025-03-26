const ConversionModel = require('../models/conversionModel');

exports.createConversion = async (req, res) => {
    try {
        const { unidad_origen_id, unidad_destino_id, factor_conversion } = req.body;
        
        // Validate conversion factor
        if (factor_conversion <= 0) {
            return res.status(400).json({ 
                message: 'El factor de conversión debe ser mayor que 0' 
            });
        }

        // Validate different units
        await ConversionModel.validateConversion(unidad_origen_id, unidad_destino_id);

        const conversionId = await ConversionModel.create(req.body);
        res.status(201).json({ 
            message: 'Conversión creada exitosamente',
            conversionId 
        });
    } catch (error) {
        if (error.message.includes('Ya existe')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.getProductConversions = async (req, res) => {
    try {
        const conversions = await ConversionModel.getByProductId(req.params.productId);
        res.json(conversions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateConversion = async (req, res) => {
    try {
        const { factor_conversion } = req.body;
        
        if (factor_conversion <= 0) {
            return res.status(400).json({ 
                message: 'El factor de conversión debe ser mayor que 0' 
            });
        }

        const success = await ConversionModel.update(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Conversión no encontrada' });
        }
        res.json({ message: 'Conversión actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteConversion = async (req, res) => {
    try {
        const success = await ConversionModel.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Conversión no encontrada' });
        }
        res.json({ message: 'Conversión eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};