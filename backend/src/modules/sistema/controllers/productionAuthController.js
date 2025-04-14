const UserProductionAreaModel = require('../models/userProductionAreaModel');
const jwt = require('jsonwebtoken');
const db = require('../../../core/config/database');
const bcrypt = require('bcryptjs');

class ProductionAuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Obtener usuario
            const [users] = await db.execute(
                'SELECT id, nombre, email, password, rol, estado FROM usuarios WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            const user = users[0];

            // Verificar estado del usuario
            if (user.estado !== 'activo') {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario inactivo'
                });
            }

            // Verificar contraseña
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar rol
            if (user.rol !== 'produccion' && user.rol !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Usuario no autorizado para el módulo de producción'
                });
            }

            // Obtener áreas asignadas al usuario
            const areas = await UserProductionAreaModel.getUserAreas(user.id);

            if (areas.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Usuario no tiene áreas de producción asignadas'
                });
            }

            // Generar token
            const token = jwt.sign(
                { id: user.id, rol: user.rol },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            res.json({
                success: true,
                data: {
                    token,
                    user: {
                        id: user.id,
                        nombre: user.nombre,
                        email: user.email,
                        rol: user.rol
                    },
                    areas: areas
                }
            });

        } catch (error) {
            console.error('Error en login de producción:', error);
            res.status(500).json({
                success: false,
                message: 'Error en el servidor'
            });
        }
    }
}

module.exports = ProductionAuthController;