const pool = require("../config/database");

class ProductoTerminado {
  static async crear(id_lote_molido, presentacion, cantidad_paquetes) {
    const query = `INSERT INTO productosterminados 
      (id_lote_molido, presentacion, cantidad_paquetes) 
      VALUES (?, ?, ?)`;
    const [result] = await pool.execute(query, [
      id_lote_molido,
      presentacion,
      cantidad_paquetes
    ]);
    return result.insertId;
  }

  static async obtenerTodos() {
    const query = "SELECT * FROM productosterminados";
    const [results] = await pool.execute(query);
    return results;
  }

  static async actualizar(id_producto, camposActualizados) {
    let updates = [];
    let params = [];
    
    const camposPermitidos = ['id_lote_molido', 'presentacion', 'cantidad_paquetes'];
    
    for (const [campo, valor] of Object.entries(camposActualizados)) {
      if (camposPermitidos.includes(campo)) {
        updates.push(`${campo} = ?`);
        params.push(valor);
      }
    }

    if (updates.length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }

    const query = `UPDATE productosterminados SET ${updates.join(', ')} WHERE id_producto = ?`;
    params.push(id_producto);

    const [result] = await pool.execute(query, params);
    return result.affectedRows;
  }

  static async eliminar(id_producto) {
    const query = "DELETE FROM productosterminados WHERE id_producto = ?";
    const [result] = await pool.execute(query, [id_producto]);
    return result.affectedRows;
  }
}

module.exports = ProductoTerminado;