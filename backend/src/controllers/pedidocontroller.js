const Pedido = require("../models/Pedido");

const pedidoController = {
  crearPedido: async (req, res) => {
    try {
      const { fecha_pedido, fecha_entrega, cantidad_paquetes, id_producto, estado_pago } = req.body;
      
      // Validar campos requeridos
      if (!fecha_pedido || !fecha_entrega || !cantidad_paquetes || !id_producto || !estado_pago) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }

      const nuevoPedidoId = await Pedido.crear(
        fecha_pedido,
        fecha_entrega,
        cantidad_paquetes,
        id_producto,
        estado_pago
      );
      
      res.status(201).json({ 
        id_pedido: nuevoPedidoId, 
        ...req.body 
      });
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  obtenerPedidos: async (req, res) => {
    try {
      const pedidos = await Pedido.obtenerTodos();
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  obtenerPedido: async (req, res) => {
    try {
      const pedido = await Pedido.obtenerPorId(req.params.id);
      pedido ? res.json(pedido) : res.status(404).json({ error: "Pedido no encontrado" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  actualizarPedido: async (req, res) => {
    try {
      const filasAfectadas = await Pedido.actualizar(
        req.params.id,
        req.body
      );
      
      filasAfectadas > 0
        ? res.json({ mensaje: "Pedido actualizado correctamente" })
        : res.status(404).json({ error: "Pedido no encontrado" });
        
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  eliminarPedido: async (req, res) => {
    try {
      const filasAfectadas = await Pedido.eliminar(req.params.id);
      filasAfectadas > 0
        ? res.json({ mensaje: "Pedido eliminado correctamente" })
        : res.status(404).json({ error: "Pedido no encontrado" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = pedidoController;