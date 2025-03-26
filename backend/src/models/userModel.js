const db = require('../config/database');
const bcrypt = require('bcryptjs');

exports.create = async (userData) => {
    const { nombre, apellido, email, telefono, password, rol = 'usuario' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
        INSERT INTO usuarios (nombre, apellido, email, telefono, password, rol)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
        nombre, 
        apellido, 
        email, 
        telefono, 
        hashedPassword, 
        rol
    ]);
    
    return result.insertId;
};

exports.findByEmail = async (email) => {
    const [rows] = await db.execute(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
    );
    return rows[0];
};

exports.findById = async (id) => {
    const [rows] = await db.execute(
        'SELECT id, nombre, apellido, email, telefono, rol, estado FROM usuarios WHERE id = ?',
        [id]
    );
    return rows[0];
};

exports.update = async (id, userData) => {
    const { nombre, apellido, email, telefono, estado, rol } = userData;
    const [result] = await db.execute(
        `UPDATE usuarios 
         SET nombre = ?, apellido = ?, email = ?, telefono = ?, estado = ?, rol = ?
         WHERE id = ?`,
        [nombre, apellido, email, telefono, estado, rol, id]
    );
    return result.affectedRows > 0;
};

exports.updatePassword = async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await db.execute(
        'UPDATE usuarios SET password = ? WHERE id = ?',
        [hashedPassword, id]
    );
    return result.affectedRows > 0;
};

exports.getAll = async () => {
    const [rows] = await db.execute(
        'SELECT id, nombre, apellido, email, telefono, rol, estado FROM usuarios'
    );
    return rows;
};

exports.delete = async (id) => {
    const [result] = await db.execute(
        'UPDATE usuarios SET estado = "inactivo" WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
};

exports.hasAnyUser = async () => {
    const [rows] = await db.execute('SELECT COUNT(*) as count FROM usuarios');
    return rows[0].count > 0;
};
