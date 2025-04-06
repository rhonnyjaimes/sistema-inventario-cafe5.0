const LoteTostado = require("../models/lotetostado");

const loteTostadoController = {
  crearLoteTostado: async (req, res) => {
    try {
      const { fecha, temperatura, peso_inicial_kg, peso_final_kg, id_grano } = req.body;
      
      // Calcular pérdida de peso automáticamente
      const perdida_peso = parseFloat(peso_inicial_kg) - parseFloat(peso_final_kg);
      
      const nuevoLote = await LoteTostado.crear(
        fecha || new Date().toISOString().split('T')[0], // Fecha actual si no viene
        temperatura || null,  // Convertir undefined a null
        perdida_peso,         // Calculado automáticamente
        peso_inicial_kg,
        peso_final_kg,
        id_grano
      );
      
      res.status(201).json({ id: nuevoLote, mensaje: 'Lote de tostado creado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  obtenerLotesTostados: async (req, res) => {
    try {
      const lotes = await LoteTostado.obtenerTodos();
      res.json(lotes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  actualizarLoteTostado: async (req, res) => {
    try {
      const { id } = req.params;
      const campos = req.body;
      
      const affectedRows = await LoteTostado.actualizar(id, campos);
      
      if (affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Lote de tostado no encontrado' });
      }
      
      res.json({ mensaje: 'Lote de tostado actualizado correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  eliminarLoteTostado: async (req, res) => {
    try {
      const { id } = req.params;
      const affectedRows = await LoteTostado.eliminar(id);
      
      if (affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Lote de tostado no encontrado' });
      }
      
      res.json({ mensaje: 'Lote de tostado eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = loteTostadoController;