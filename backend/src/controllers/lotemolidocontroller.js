const LoteMolido = require("../models/Lotemolido");

const loteMolidoController = {
  crearLoteMolido: async (req, res) => {
    try {
      const { tipo_molido, cantidad_procesada_kg, fecha, tiempo_produccion, id_lote_tostado } = req.body;
      
      if (!tipo_molido || !cantidad_procesada_kg || !fecha || !tiempo_produccion || !id_lote_tostado) {
        return res.status(400).json({ error: "Faltan campos requeridos" });
      }

      const nuevoLote = await LoteMolido.crear(
        tipo_molido,
        cantidad_procesada_kg,
        fecha,
        tiempo_produccion,
        id_lote_tostado
      );
      
      res.status(201).json({ id: nuevoLote, mensaje: 'Lote de molido creado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  obtenerLotesMolidos: async (req, res) => {
    try {
      const lotes = await LoteMolido.obtenerTodos();
      res.json(lotes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  actualizarLoteMolido: async (req, res) => {
    try {
      const { id } = req.params;
      const campos = req.body;
      
      const affectedRows = await LoteMolido.actualizar(id, campos);
      
      if (affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Lote de molido no encontrado' });
      }
      
      res.json({ mensaje: 'Lote de molido actualizado correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  eliminarLoteMolido: async (req, res) => {
    try {
      const { id } = req.params;
      const affectedRows = await LoteMolido.eliminar(id);
      
      if (affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Lote de molido no encontrado' });
      }
      
      res.json({ mensaje: 'Lote de molido eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = loteMolidoController;