const pool = require("../config/database");
const bcrypt = require("bcryptjs");

class Usuario {
  static async crear(nombre, email, contrasena, rol) {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const query = "INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES (?, ?, ?, ?)";
    const [result] = await pool.execute(query, [nombre, email, hashedPassword, rol]);
    return result.insertId;
  }

  static async buscarPorEmail(email) {
    const query = "SELECT * FROM usuarios WHERE email = ?";
    const [result] = await pool.execute(query, [email]);
    return result[0];
  }
  static async obtenerTodos() {
    const query = "SELECT id_usuario, nombre, email, rol FROM usuarios";
    const [results] = await pool.execute(query);
    return results;
  }

  static async actualizar(id_usuario, { nombre, email, contrasena, rol }) {
    let updates = [];
    let params = [];
    
    if (nombre) {
      updates.push('nombre = ?');
      params.push(nombre);
    }
    if (email) {
      updates.push('email = ?');
      params.push(email);
    }
    if (contrasena) {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      updates.push('contrasena = ?');
      params.push(hashedPassword);
    }
    if (rol) {
      updates.push('rol = ?');
      params.push(rol);
    }
  
    if (updates.length === 0) {
      throw new Error('No se proporcionaron campos para actualizar');
    }
  
    const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE id_usuario = ?`;
    params.push(id_usuario);
  
    const [result] = await pool.execute(query, params);
    return result.affectedRows;
  }

  static async eliminar(id) {
    const query = "DELETE FROM usuarios WHERE id_usuario = ?";
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows;
  }
}

module.exports = Usuario;
