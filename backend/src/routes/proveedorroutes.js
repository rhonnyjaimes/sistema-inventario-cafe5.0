const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorcontroller');

// Crear un nuevo proveedor
router.post('/proveedores', proveedorController.crearProveedores);

// Obtener todos los proveedores
router.get('/proveedores', proveedorController.obtenerProveedores);

// Actualizar un proveedor
router.put('/proveedores/:id', proveedorController.actualizarProveedor);

// Eliminar un proveedor
router.delete('/proveedores/:id', proveedorController.eliminarProveedor);

module.exports = router;