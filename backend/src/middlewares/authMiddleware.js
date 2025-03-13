const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar si el usuario sigue activo
        const user = await userModel.findById(decoded.id);
        if (!user || user.estado === 'inactivo') {
            return res.status(403).json({ message: 'Usuario inactivo o no existe' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado: se requiere rol de administrador' });
    }
};

module.exports = { authMiddleware, isAdmin };