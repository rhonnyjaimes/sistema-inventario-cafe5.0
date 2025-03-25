const pool = require("../config/database");

class LoteTostado {
  static async crear(fecha, temperatura, perdida_peso, peso_inicial_kg, peso_final_kg, id_grano) {
    const query = `INSERT INTO lotestostado 
      (fecha, temperatura, perdida_peso, peso_inicial_kg, peso_final_kg, id_grano) 
      VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [
      fecha,
      temperatura,
      perdida_peso,
      peso_inicial_kg,
      peso_final_kg,
      id_grano
    ]);
    return result.insertId;
  }

  static async obtenerTodos() {
    const query = "SELECT * FROM lotestostado";
    const [results] = await pool.execute(query);
    return results;
  }

  static async actualizar(id_lote_tostado, camposActualizados) {
    let updates = [];
    let params = [];
    
    // Campos permitidos para actualizar
    const camposPermitidos = ['fecha', 'temperatura', 'perdida_peso', 'peso_inicial_kg', 'peso_final_kg', 'id_grano'];
    
    for (const [campo, valor] of Object.entries(camposActualizados)) {
      if (camposPermitidos.includes(campo)) {
        updates.push(`${campo} = ?`);
        params.push(valor);
      }
    }

    if (updates.length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }

    const query = `UPDATE lotestostado SET ${updates.join(', ')} WHERE id_lote_tostado = ?`;
    params.push(id_lote_tostado);

    const [result] = await pool.execute(query, params);
    return result.affectedRows;
  }

  static async eliminar(id_lote_tostado) {
    const query = "DELETE FROM lotestostado WHERE id_lote_tostado = ?";
    const [result] = await pool.execute(query, [id_lote_tostado]);
    return result.affectedRows;
  }
}

module.exports = LoteTostado;