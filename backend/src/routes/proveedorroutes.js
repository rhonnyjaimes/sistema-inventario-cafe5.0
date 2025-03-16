const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorcontroller');

// Crear un nuevo proveedor
router.post('/proveedores', proveedorController.crear);

// Obtener todos los proveedores
router.get('/proveedores', proveedorController.obtenerTodos);

// Actualizar un proveedor
router.put('/proveedores/:id', proveedorController.actualizar);

// Eliminar un proveedor
router.delete('/proveedores/:id', proveedorController.eliminar);

module.exports = router;