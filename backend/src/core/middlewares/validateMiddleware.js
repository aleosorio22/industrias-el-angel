const validateUser = (req, res, next) => {
    const { nombre, apellido, email, password, telefono } = req.body;
    
    // Si es una creación de usuario (POST)
    if (req.method === 'POST') {
        if (!nombre || !apellido || !email || !password) {
            return res.status(400).json({ 
                message: 'Nombre, apellido, email y contraseña son requeridos' 
            });
        }
    }
    
    // Si es una actualización (PUT)
    if (req.method === 'PUT') {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                message: 'No hay datos para actualizar' 
            });
        }
    }

    // Validar email si está presente
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Formato de email inválido' 
            });
        }
    }

    // Validar contraseña si está presente
    if (password && password.length < 6) {
        return res.status(400).json({ 
            message: 'La contraseña debe tener al menos 6 caracteres' 
        });
    }

    next();
};

const validatePasswordUpdate = (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
            message: 'Se requiere la contraseña actual y la nueva' 
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ 
            message: 'La nueva contraseña debe tener al menos 6 caracteres' 
        });
    }

    next();
};

module.exports = { validateUser, validatePasswordUpdate };