const pool = require("../config/database");

class Proveedor {
  static async crear(nombre_empresa, documento, correo, telefono, ubicacion) {
    const query = `
      INSERT INTO proveedores 
      (nombre_empresa, documento, correo, telefono, ubicacion) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      nombre_empresa,
      documento,
      correo,
      telefono,
      ubicacion
    ]);
    
    return result.insertId;
  }

  static async obtenerTodos() {
    const query = "SELECT * FROM proveedores";
    const [results] = await pool.execute(query);
    return results;
  }

  static async actualizar(id_proveedor, { nombre_empresa, documento, correo, telefono, ubicacion }) {
    let updates = [];
    let params = [];
    
    if (nombre_empresa) {
      updates.push('nombre_empresa = ?');
      params.push(nombre_empresa);
    }
    if (documento) {
      updates.push('documento = ?');
      params.push(documento);
    }
    if (correo) {
      updates.push('correo = ?');
      params.push(correo);
    }
    if (telefono) {
      updates.push('telefono = ?');
      params.push(telefono);
    }
    if (ubicacion) {
      updates.push('ubicacion = ?');
      params.push(ubicacion);
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