const pool = require("../config/database");

class Proveedor {
  static async crear(nombre, telefono1, telefono2) {
    const query = `INSERT INTO proveedores 
                  (nombre, telefono1, telefono2) 
                  VALUES (?, ?, ?)`;
    const [result] = await pool.execute(query, [
      nombre,
      telefono1,
      telefono2
    ]);
    return result.insertId;
  }

  static async obtenerTodos() {
    const query = "SELECT * FROM proveedores";
    const [results] = await pool.execute(query);
    return results;
  }

  static async actualizar(id_proveedor, { nombre, telefono1, telefono2 }) {
    let updates = [];
    let params = [];
    
    if (nombre) {
      updates.push('nombre = ?');
      params.push(nombre);
    }
    if (telefono1) {
      updates.push('telefono1 = ?');
      params.push(telefono1);
    }
    if (telefono2) {
      updates.push('telefono2 = ?');
      params.push(telefono2);
    }

    if (updates.length === 0) {
      throw new Error('No se proporcionaron campos para actualizar');
    }

    const query = `UPDATE proveedores SET ${updates.join(', ')} WHERE id_proveedor = ?`;
    params.push(id_proveedor);

    const [result] = await pool.execute(query, params);
    return result.affectedRows;
  }

  static async eliminar(id_proveedor) {
    const query = "DELETE FROM proveedores WHERE id_proveedor = ?";
    const [result] = await pool.execute(query, [id_proveedor]);
    return result.affectedRows;
  }
}

module.exports = Proveedor;