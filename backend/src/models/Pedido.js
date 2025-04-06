const pool = require("../config/database");

class Pedido {
  static async crear(fecha_pedido, fecha_entrega, cantidad_paquetes, id_producto, estado_pago) {
    const query = `INSERT INTO pedidos 
      (fecha_pedido, fecha_entrega, cantidad_paquetes, id_producto, estado_pago) 
      VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [
      fecha_pedido,
      fecha_entrega,
      cantidad_paquetes,
      id_producto,
      estado_pago
    ]);
    return result.insertId;
  }

  static async obtenerTodos() {
    const query = "SELECT * FROM pedidos";
    const [results] = await pool.execute(query);
    return results;
  }

  static async obtenerPorId(id_pedido) {
    const query = "SELECT * FROM pedidos WHERE id_pedido = ?";
    const [results] = await pool.execute(query, [id_pedido]);
    return results[0];
  }

  static async actualizar(id_pedido, camposActualizados) {
    let updates = [];
    let params = [];
    
    const camposPermitidos = ['fecha_pedido', 'fecha_entrega', 'cantidad_paquetes', 'estado_pago'];
    
    for (const [campo, valor] of Object.entries(camposActualizados)) {
      if (camposPermitidos.includes(campo)) {
        updates.push(`${campo} = ?`);
        params.push(valor);
      }
    }

    if (updates.length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }

    const query = `UPDATE pedidos SET ${updates.join(', ')} WHERE id_pedido = ?`;
    params.push(id_pedido);

    const [result] = await pool.execute(query, params);
    return result.affectedRows;
  }

  static async eliminar(id_pedido) {
    const query = "DELETE FROM pedidos WHERE id_pedido = ?";
    const [result] = await pool.execute(query, [id_pedido]);
    return result.affectedRows;
  }
}

module.exports = Pedido;