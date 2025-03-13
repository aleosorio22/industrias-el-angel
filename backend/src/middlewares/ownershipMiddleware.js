const isOwnerOrAdmin = (req, res, next) => {
    const userId = parseInt(req.params.id);
    if (req.user.rol === 'admin' || req.user.id === userId) {
        next();
    } else {
        res.status(403).json({ 
            message: 'No tienes permiso para realizar esta acción' 
        });
    }
};

module.exports = { isOwnerOrAdmin };