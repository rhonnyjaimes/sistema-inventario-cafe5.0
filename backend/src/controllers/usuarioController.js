// controllers/usuarioController.js
const Usuario = require('../models/Usuario');

const usuarioController = {
  obtenerTodos: async (req, res) => {
    try {
      const usuarios = await Usuario.obtenerTodos();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
  },

  actualizar: async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;
  
    try {
      // Validar que el ID sea numérico
      if (isNaN(id)) {
        return res.status(400).json({ mensaje: 'ID de usuario inválido' });
      }
  
      // Validar campos vacíos
      if (Object.keys(datosActualizados).length === 0) {
        return res.status(400).json({ mensaje: 'No se enviaron datos para actualizar' });
      }
  
      const affectedRows = await Usuario.actualizar(id, datosActualizados);
      
      if (affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      
      res.status(200).json({ 
        mensaje: 'Usuario actualizado correctamente',
        cambios: datosActualizados
      });
      
    } catch (error) {
      console.error('Error en actualización:', error);
      res.status(500).json({ 
        mensaje: 'Error al actualizar usuario',
        error: error.message
      });
    }
  },

  eliminar: async (req, res) => {
    const { id } = req.params;

    try {
      const affectedRows = await Usuario.eliminar(id);
      if (affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar usuario' });
    }
  }
};

module.exports = usuarioController;