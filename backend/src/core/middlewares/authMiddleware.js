const jwt = require('jsonwebtoken');
const userModel = require('../../modules/sistema/models/userModel'); // Añadimos esta importación

const authMiddleware = async (req, res, next) => {
    try {
        // Verificar formato del header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Formato de token inválido' });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Verificar si el usuario existe y está activo
            const user = await userModel.findById(decoded.id);
            if (!user) {
                return res.status(403).json({ message: 'Usuario no encontrado' });
            }
            
            if (user.estado === 'inactivo') {
                return res.status(403).json({ message: 'Usuario inactivo' });
            }

            // Agregar información del usuario al request
            req.user = {
                id: decoded.id,
                rol: decoded.rol
            };
            
            next();
        } catch (jwtError) {
            return res.status(401).json({ 
                message: 'Token inválido o expirado',
                error: jwtError.message 
            });
        }
    } catch (error) {
        console.error('Error en autenticación:', error);
        return res.status(500).json({ 
            message: 'Error en la autenticación',
            error: error.message 
        });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado: se requiere rol de administrador' });
    }
};

// Middleware para verificar si el usuario es repartidor o admin
const isDeliveryOrAdmin = (req, res, next) => {
    if (req.user.rol === 'admin' || req.user.rol === 'repartidor') {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requiere rol de administrador o repartidor'
    });
};

module.exports = {
    authMiddleware,
    isAdmin,
    isDeliveryOrAdmin
};