// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/usuarios', usuarioController.obtenerTodos);
router.put('/usuarios/:id', usuarioController.actualizar);
router.delete('/usuarios/:id', usuarioController.eliminar);

module.exports = router;