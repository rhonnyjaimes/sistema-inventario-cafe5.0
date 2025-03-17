const pool = require("../config/database");

class Grano {
  static async crear(origen, cantidad_kg, fecha_despacho, fecha_caducidad, id_proveedor, lote_pagado, metodo_pago) {
    const query = `INSERT INTO granos 
      (origen, cantidad_kg, fecha_despacho, fecha_caducidad, id_proveedor, lote_pagado, metodo_pago) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [
      origen,
      cantidad_kg,
      fecha_despacho,
      fecha_caducidad,
      id_proveedor,
      lote_pagado,
      metodo_pago
    ]);
    return result.insertId;
  }

  static async obtenerTodos() {
    const query = "SELECT * FROM granos";
    const [results] = await pool.execute(query);
    return results;
  }

  static async actualizar(id_grano, camposActualizados) {
    let updates = [];
    let params = [];
    
    // Campos permitidos para actualizar
    const camposPermitidos = ['origen', 'cantidad_kg', 'fecha_despacho', 'fecha_caducidad', 'id_proveedor', 'lote_pagado', 'metodo_pago'];
    
    for (const [campo, valor] of Object.entries(camposActualizados)) {
      if (camposPermitidos.includes(campo)) {
        updates.push(`${campo} = ?`);
        params.push(valor);
      }
    }

    if (updates.length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }

    const query = `UPDATE granos SET ${updates.join(', ')} WHERE id_grano = ?`;
    params.push(id_grano);

    const [result] = await pool.execute(query, params);
    return result.affectedRows;
  }

  static async eliminar(id_grano) {
    const query = "DELETE FROM granos WHERE id_grano = ?";
    const [result] = await pool.execute(query, [id_grano]);
    return result.affectedRows;
  }
}

module.exports = Grano;
