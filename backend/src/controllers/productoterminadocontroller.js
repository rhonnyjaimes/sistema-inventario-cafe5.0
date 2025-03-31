const ProductoTerminado = require("../models/Productoterminado");
const LoteMolido = require("../models/Lotemolido");

const productosTerminadosController = {
  crear: async (req, res) => {
    try {
      const { id_lote_molido, presentacion, cantidad_paquetes } = req.body;
      
      // Verificar existencia del lote molido
      const loteExistente = await LoteMolido.obtenerTodos();
      const loteValido = loteExistente.some(lote => lote.id_lote_molido === id_lote_molido);
      
      if (!loteValido) {
        return res.status(400).json({ error: 'Lote molido no válido' });
      }

      const nuevoProductoId = await ProductoTerminado.crear(
        id_lote_molido,
        presentacion,
        cantidad_paquetes
      );
      
      res.status(201).json({ 
        id_producto: nuevoProductoId,
        mensaje: 'Producto creado exitosamente' 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  obtenerTodos: async (req, res) => {
    try {
      const productos = await ProductoTerminado.obtenerTodos();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const affectedRows = await ProductoTerminado.actualizar(id, req.body);
      
      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      res.json({ mensaje: 'Producto actualizado correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const affectedRows = await ProductoTerminado.eliminar(id);
      
      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = productosTerminadosController;