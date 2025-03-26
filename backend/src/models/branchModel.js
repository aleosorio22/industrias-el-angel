const db = require('../config/database');

class BranchModel {
    static async create(branchData) {
        const { cliente_id, nombre, direccion, telefono } = branchData;
        
        // Verificar que el cliente existe y está activo
        const [client] = await db.execute(
            'SELECT id FROM clientes WHERE id = ? AND estado = "activo"',
            [cliente_id]
        );

        if (client.length === 0) {
            throw new Error('Cliente no encontrado o inactivo');
        }

        // Verificar si ya existe una sucursal con el mismo nombre para este cliente
        const [existingBranch] = await db.execute(
            'SELECT id FROM sucursales WHERE cliente_id = ? AND nombre = ? AND estado = "activo"',
            [cliente_id, nombre]
        );
        
        if (existingBranch.length > 0) {
            throw new Error('Ya existe una sucursal con este nombre para este cliente');
        }

        const [result] = await db.execute(
            'INSERT INTO sucursales (cliente_id, nombre, direccion, telefono) VALUES (?, ?, ?, ?)',
            [cliente_id, nombre, direccion, telefono]
        );
        
        return result.insertId;
    }

    static async getAll(includeInactive = false) {
        const query = includeInactive 
            ? `SELECT s.*, c.nombre as cliente_nombre 
               FROM sucursales s 
               LEFT JOIN clientes c ON s.cliente_id = c.id`
            : `SELECT s.*, c.nombre as cliente_nombre 
               FROM sucursales s 
               LEFT JOIN clientes c ON s.cliente_id = c.id 
               WHERE s.estado = "activo"`;
        const [branches] = await db.execute(query);
        return branches;
    }

    static async getByClientId(clientId, includeInactive = false) {
        const whereClause = includeInactive 
            ? 's.cliente_id = ?' 
            : 's.cliente_id = ? AND s.estado = "activo"';
        
        const [branches] = await db.execute(`
            SELECT s.*, c.nombre as cliente_nombre 
            FROM sucursales s 
            LEFT JOIN clientes c ON s.cliente_id = c.id 
            WHERE ${whereClause}
        `, [clientId]);
        
        return branches;
    }

    static async findById(id, includeInactive = false) {
        const whereClause = includeInactive 
            ? 's.id = ?' 
            : 's.id = ? AND s.estado = "activo"';
        
        const [branches] = await db.execute(`
            SELECT s.*, c.nombre as cliente_nombre 
            FROM sucursales s 
            LEFT JOIN clientes c ON s.cliente_id = c.id 
            WHERE ${whereClause}
        `, [id]);
        
        return branches[0];
    }

    static async update(id, branchData) {
        const { nombre, direccion, telefono } = branchData;
        
        // Verificar si existe otra sucursal con el mismo nombre para este cliente
        if (nombre) {
            const [branch] = await db.execute(
                'SELECT cliente_id FROM sucursales WHERE id = ? AND estado = "activo"',
                [id]
            );
            
            if (branch.length > 0) {
                const [existingBranch] = await db.execute(
                    'SELECT id FROM sucursales WHERE cliente_id = ? AND nombre = ? AND id != ? AND estado = "activo"',
                    [branch[0].cliente_id, nombre, id]
                );
                
                if (existingBranch.length > 0) {
                    throw new Error('Ya existe otra sucursal con este nombre para este cliente');
                }
            }
        }
        
        const [result] = await db.execute(
            'UPDATE sucursales SET nombre = ?, direccion = ?, telefono = ? WHERE id = ? AND estado = "activo"',
            [nombre, direccion, telefono, id]
        );
        
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'UPDATE sucursales SET estado = "inactivo" WHERE id = ?',
            [id]
        );
        
        return result.affectedRows > 0;
    }

    static async restore(id) {
        const [result] = await db.execute(
            'UPDATE sucursales SET estado = "activo" WHERE id = ?',
            [id]
        );
        
        return result.affectedRows > 0;
    }
}

module.exports = BranchModel;