const pool = require("../config/database");

class LoteMolido {
  static async crear(tipo_molido, cantidad_procesada_kg, fecha, tiempo_produccion, id_lote_tostado) {
    const query = `INSERT INTO lotesmolido 
      (tipo_molido, cantidad_procesada_kg, fecha, tiempo_produccion, id_lote_tostado) 
      VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [
      tipo_molido,
      cantidad_procesada_kg,
      fecha,
      tiempo_produccion,
      id_lote_tostado
    ]);
    return result.insertId;
  }

  static async obtenerTodos() {
    const query = "SELECT * FROM lotesmolido";
    const [results] = await pool.execute(query);
    return results;
  }

  static async actualizar(id_lote_molido, camposActualizados) {
    let updates = [];
    let params = [];
    
    const camposPermitidos = ['tipo_molido', 'cantidad_procesada_kg', 'fecha', 'tiempo_produccion', 'id_lote_tostado'];
    
    for (const [campo, valor] of Object.entries(camposActualizados)) {
      if (camposPermitidos.includes(campo)) {
        updates.push(`${campo} = ?`);
        params.push(valor);
      }
    }

    if (updates.length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }

    const query = `UPDATE lotesmolido SET ${updates.join(', ')} WHERE id_lote_molido = ?`;
    params.push(id_lote_molido);

    const [result] = await pool.execute(query, params);
    return result.affectedRows;
  }

  static async eliminar(id_lote_molido) {
    const query = "DELETE FROM lotesmolido WHERE id_lote_molido = ?";
    const [result] = await pool.execute(query, [id_lote_molido]);
    return result.affectedRows;
  }
}

module.exports = LoteMolido;