const Grano = require('../models/Grano');

const granoController = {
  crear: async (req, res) => {
    try {
      const { origen, cantidad_kg, fecha_despacho, fecha_caducidad, id_proveedor, lote_pagado, metodo_pago } = req.body;
      
      // Validación de campos
      if (
        !origen || 
        !cantidad_kg || 
        !fecha_despacho || 
        !fecha_caducidad || 
        !id_proveedor || 
        lote_pagado === undefined || 
        !metodo_pago
      ) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }

      const nuevoGranoId = await Grano.crear(
        origen,
        cantidad_kg,
        fecha_despacho,
        fecha_caducidad,
        id_proveedor,
        lote_pagado,
        metodo_pago
      );
      
      // Se puede devolver el objeto completo o solo el ID
      res.status(201).json({ 
        id: nuevoGranoId,
        mensaje: 'Lote de granos registrado exitosamente' 
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al registrar granos' });
    }
  },

  obtenerTodos: async (req, res) => {
    try {
      const granos = await Grano.obtenerTodos();
      res.status(200).json(granos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los granos' });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;

      const affectedRows = await Grano.actualizar(id, datosActualizados);
      
      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Registro de granos no encontrado' });
      }
      
      res.status(200).json({ mensaje: 'Registro actualizado correctamente' });
      
    } catch (error) {
      if (error.message === 'No se proporcionaron campos válidos para actualizar') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al actualizar el registro' });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const affectedRows = await Grano.eliminar(id);
      
      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Registro de granos no encontrado' });
      }
      
      res.status(204).end();
      
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el registro' });
    }
  }
};

module.exports = granoController;
