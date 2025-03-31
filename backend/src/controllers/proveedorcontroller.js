const Proveedor = require('../models/Proveedor');

exports.obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.obtenerTodos();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearProveedores = async (req, res) => {
  try {
    const { nombre_empresa, documento, telefono, ubicacion, correo } = req.body;
    const nuevoId = await Proveedor.crear(nombre_empresa, documento, telefono, ubicacion, correo);
    res.status(201).json({ id_proveedor: nuevoId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.actualizarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Proveedor.actualizar(id, req.body);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Proveedor.eliminar(id);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};