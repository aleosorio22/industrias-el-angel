const PresentationModel = require('../models/presentationModel');

exports.createPresentation = async (req, res) => {
    try {
        const presentationId = await PresentationModel.create(req.body);
        res.status(201).json({ 
            message: 'Presentación creada exitosamente',
            presentationId 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPresentations = async (req, res) => {
    try {
        const presentations = await PresentationModel.getAll();
        res.json(presentations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPresentationById = async (req, res) => {
    try {
        const presentation = await PresentationModel.findById(req.params.id);
        if (!presentation) {
            return res.status(404).json({ message: 'Presentación no encontrada' });
        }
        res.json(presentation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePresentation = async (req, res) => {
    try {
        const success = await PresentationModel.update(req.params.id, req.body);
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
        const success = await PresentationModel.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Presentación no encontrada' });
        }
        res.json({ message: 'Presentación eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.restorePresentation = async (req, res) => {
    try {
        const succes = await PresentationModel.restore(req.params.id);
        if (!succes){
            return res.status(404).json({message: 'Presentación no encontrada'});
        }
        res.json({message: 'Presentación restaurada exitosamente'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}