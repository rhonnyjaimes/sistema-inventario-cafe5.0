const pool = require("../config/database");

class Proveedor {
  static async crear(nombre_empresa, tipo_documento, rif, telefono_prefijo, telefono_numero, ubicacion, correo) {
    const query = `
      INSERT INTO proveedores 
      (nombre_empresa, tipo_documento, rif, telefono_prefijo, telefono_numero, ubicacion, correo) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      nombre_empresa,
      tipo_documento,
      rif,
      telefono_prefijo,
      telefono_numero,
      ubicacion,
      correo
    ]);
    return result.insertId;
  }

  static async obtenerTodos() {
    const query = "SELECT * FROM proveedores";
    const [results] = await pool.execute(query);
    return results;
  }

  static async actualizar(id_proveedor, { nombre_empresa, tipo_documento, rif, telefono_prefijo, telefono_numero, ubicacion, correo }) {
    let updates = [];
    let params = [];
    
    if (nombre_empresa) {
      updates.push('nombre_empresa = ?');
      params.push(nombre_empresa);
    }
    if (tipo_documento) {
      updates.push('tipo_documento = ?');
      params.push(tipo_documento);
    }
    if (rif) {
      updates.push('rif = ?');
      params.push(rif);
    }
    if (telefono_prefijo) {
      updates.push('telefono_prefijo = ?');
      params.push(telefono_prefijo);
    }
    if (telefono_numero) {
      updates.push('telefono_numero = ?');
      params.push(telefono_numero);
    }
    if (ubicacion) {
      updates.push('ubicacion = ?');
      params.push(ubicacion);
    }
    if (correo) {
      updates.push('correo = ?');
      params.push(correo);
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
