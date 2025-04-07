const ClientModel = require('../models/clientModel');

exports.createClient = async (req, res) => {
    try {
        const clientId = await ClientModel.create(req.body);
        res.status(201).json({ 
            message: 'Cliente creado exitosamente',
            clientId 
        });
    } catch (error) {
        if (error.message === 'Este usuario ya tiene un cliente asociado' ||
            error.message === 'No se puede asociar un cliente a un usuario administrador' ||
            error.message === 'Usuario no encontrado') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.getAllClients = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const clients = await ClientModel.getAll(includeInactive);
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const client = await ClientModel.findById(req.params.id, includeInactive);
        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.restoreClient = async (req, res) => {
    try {
        const success = await ClientModel.restore(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente restaurado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyClientData = async (req, res) => {
    try {
        const client = await ClientModel.findByUserId(req.user.id);
        if (!client) {
            return res.status(404).json({ message: 'No tienes un cliente asociado' });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const success = await ClientModel.update(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const success = await ClientModel.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};