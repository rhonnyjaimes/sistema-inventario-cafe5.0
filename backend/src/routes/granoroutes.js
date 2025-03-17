const express = require('express');
const router = express.Router();
const granoController = require('../controllers/granocontroller');

// Registrar nuevo lote de granos
router.post('/granos', granoController.crear);

// Obtener todos los registros
router.get('/granos', granoController.obtenerTodos);

// Actualizar un registro
router.put('/granos/:id', granoController.actualizar);

// Eliminar un registro
router.delete('/granos/:id', granoController.eliminar);

module.exports = router;