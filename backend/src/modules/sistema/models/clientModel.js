const db = require('../../../core/config/database');

class ClientModel {
    static async create(clientData) {
        const { usuario_id, nombre, nit, direccion, telefono } = clientData;
        
        // Check if user exists and is not an admin
        const [user] = await db.execute(
            'SELECT rol FROM usuarios WHERE id = ? AND estado = "activo"',
            [usuario_id]
        );

        if (user.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        if (user[0].rol === 'admin') {
            throw new Error('No se puede asociar un cliente a un usuario administrador');
        }

        // Check if user already has a client
        const [existingClient] = await db.execute(
            'SELECT id FROM clientes WHERE usuario_id = ? AND estado = "activo"',
            [usuario_id]
        );
        
        if (existingClient.length > 0) {
            throw new Error('Este usuario ya tiene un cliente asociado');
        }

        const [result] = await db.execute(
            'INSERT INTO clientes (usuario_id, nombre, nit, direccion, telefono) VALUES (?, ?, ?, ?, ?)',
            [usuario_id, nombre, nit, direccion, telefono]
        );
        
        return result.insertId;
    }

    static async getAll(includeInactive = false) {
        const query = includeInactive 
            ? `SELECT c.*, u.email as usuario_email, u.nombre as usuario_nombre, u.apellido as usuario_apellido
               FROM clientes c 
               LEFT JOIN usuarios u ON c.usuario_id = u.id`
            : `SELECT c.*, u.email as usuario_email, u.nombre as usuario_nombre, u.apellido as usuario_apellido
               FROM clientes c 
               LEFT JOIN usuarios u ON c.usuario_id = u.id 
               WHERE c.estado = "activo"`;
        const [clients] = await db.execute(query);
        return clients;
    }

    static async findById(id, includeInactive = false) {
        const whereClause = includeInactive ? 'c.id = ?' : 'c.id = ? AND c.estado = "activo"';
        const [clients] = await db.execute(`
            SELECT c.*, u.email as usuario_email, u.nombre as usuario_nombre, u.apellido as usuario_apellido
            FROM clientes c 
            LEFT JOIN usuarios u ON c.usuario_id = u.id 
            WHERE ${whereClause}
        `, [id]);
        return clients[0];
    }

    static async restore(id) {
        const [result] = await db.execute(
            'UPDATE clientes SET estado = "activo" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async findByUserId(userId) {
        const [clients] = await db.execute(
            'SELECT * FROM clientes WHERE usuario_id = ? AND estado = "activo"',
            [userId]
        );
        return clients[0];
    }

    static async update(id, clientData) {
        const { nombre, nit, direccion, telefono } = clientData;
        const [result] = await db.execute(
            'UPDATE clientes SET nombre = ?, nit = ?, direccion = ?, telefono = ? WHERE id = ? AND estado = "activo"',
            [nombre, nit, direccion, telefono, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'UPDATE clientes SET estado = "inactivo" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = ClientModel;