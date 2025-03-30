const Proveedor = require('../models/Proveedor');

const proveedorController = {
  // Crear un nuevo proveedor
  crear: async (req, res) => {
    try {
      const { nombre_empresa, tipo_documento, rif, telefono_prefijo, telefono_numero, ubicacion, correo } = req.body;
      
      // Validar campos obligatorios
      if (!nombre_empresa || !tipo_documento || !rif || !telefono_prefijo || !telefono_numero || !ubicacion || !correo) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      // Validar formato de teléfono (prefijo de 4 dígitos y número de 7 dígitos)
      if (telefono_prefijo.length !== 4 || telefono_numero.length !== 7) {
        return res.status(400).json({ error: 'El teléfono debe tener un formato correcto: prefijo de 4 dígitos y número de 7 dígitos' });
      }

      // Validar formato de correo electrónico
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(correo)) {
        return res.status(400).json({ error: 'Correo electrónico inválido' });
      }

      // Crear el nuevo proveedor en la base de datos
      const nuevoProveedorId = await Proveedor.crear(
        nombre_empresa,
        tipo_documento,
        rif,
        telefono_prefijo,
        telefono_numero,
        ubicacion,
        correo
      );
      
      res.status(201).json({
        success: true, // Asegúrate de enviar success: true en la respuesta
        id_proveedor: nuevoProveedorId,
        mensaje: 'Proveedor creado exitosamente',
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error al crear proveedor' }); // Asegúrate de enviar success: false si hay error
    }
  },

  // Obtener todos los proveedores
  obtenerTodos: async (req, res) => {
    try {
      const proveedores = await Proveedor.obtenerTodos();
      res.status(200).json(proveedores);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener proveedores' });
    }
  },

  // Actualizar un proveedor
  actualizar: async (req, res) => {
    try {
      const { id_proveedor } = req.params;
      const datosActualizados = req.body;

      // Validar si se proporcionaron campos para actualizar
      if (!datosActualizados.nombre_empresa && !datosActualizados.telefono_prefijo && !datosActualizados.telefono_numero && !datosActualizados.ubicacion && !datosActualizados.correo) {
        return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar' });
      }

      // Validar formato de teléfono
      if (datosActualizados.telefono_prefijo && (datosActualizados.telefono_prefijo.length !== 4 || datosActualizados.telefono_numero.length !== 7)) {
        return res.status(400).json({ error: 'El teléfono debe tener un formato correcto' });
      }

      // Actualizar proveedor en la base de datos
      const affectedRows = await Proveedor.actualizar(id_proveedor, datosActualizados);

      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }

      res.status(200).json({ mensaje: 'Proveedor actualizado correctamente' });
      
    } catch (error) {
      console.error(error);
      if (error.message === 'No se proporcionaron campos para actualizar') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
  },

  // Eliminar un proveedor
  eliminar: async (req, res) => {
    try {
      const { id_proveedor } = req.params;
      const affectedRows = await Proveedor.eliminar(id_proveedor);

      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }

      res.status(204).end();
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
  }
};

module.exports = proveedorController;