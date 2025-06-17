const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../../core/config/database'); // Agregar esta línea

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        if (user.estado === 'inactivo') {
            return res.status(403).json({ message: 'Usuario inactivo' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Asegurarnos de que estamos firmando la información correcta
        const token = jwt.sign(
            { 
                id: user.id, 
                rol: user.rol 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '7d' } // Usar una variable de entorno para la expiración
        );

        // Enviar respuesta con token y datos del usuario
        res.json({
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                rol: user.rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

exports.register = async (req, res) => {
    try {
        const userId = await userModel.create(req.body);
        res.status(201).json({ 
            message: 'Usuario creado exitosamente',
            userId 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const success = await userModel.update(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const success = await userModel.updatePassword(req.params.id, req.body.newPassword);
        if (!success) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const success = await userModel.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Agregar este nuevo método
exports.getAvailableUsers = async (req, res) => {
    try {
        // Obtener usuarios que no tienen cliente asociado y no son administradores
        const [rows] = await db.execute(`
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.rol, u.estado 
            FROM usuarios u 
            LEFT JOIN clientes c ON u.id = c.usuario_id AND c.estado = 'activo'
            WHERE u.estado = 'activo' 
            AND u.rol = 'usuario' 
            AND c.id IS NULL
        `);
        
        // Asegurarse de que la respuesta tenga el formato correcto para el frontend
        res.json({
            success: true,
            data: rows || [] // Asegurarse de que siempre sea un array
        });
    } catch (error) {
        console.error('Error al obtener usuarios disponibles:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener usuarios disponibles',
            data: [] // Incluir un array vacío incluso en caso de error
        });
    }
};
