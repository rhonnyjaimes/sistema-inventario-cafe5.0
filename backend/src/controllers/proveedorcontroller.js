const Proveedor = require('../models/Proveedor');

const proveedorController = {
  crear: async (req, res) => {
    try {
      const { nombre, telefono1, telefono2 } = req.body;
      
      if (!nombre || !telefono1 || !telefono2) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      const nuevoProveedorId = await Proveedor.crear(nombre, telefono1, telefono2);
      res.status(201).json({ 
        id: nuevoProveedorId,
        mensaje: 'Proveedor creado exitosamente' 
      });
      
    } catch (error) {
      res.status(500).json({ error: 'Error al crear proveedor' });
    }
  },

  obtenerTodos: async (req, res) => {
    try {
      const proveedores = await Proveedor.obtenerTodos();
      res.status(200).json(proveedores);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener proveedores' });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;

      const affectedRows = await Proveedor.actualizar(id, datosActualizados);
      
      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }
      
      res.status(200).json({ mensaje: 'Proveedor actualizado correctamente' });
      
    } catch (error) {
      if (error.message === 'No se proporcionaron campos para actualizar') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const affectedRows = await Proveedor.eliminar(id);
      
      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }
      
      res.status(204).end();
      
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
  }
};

module.exports = proveedorController;