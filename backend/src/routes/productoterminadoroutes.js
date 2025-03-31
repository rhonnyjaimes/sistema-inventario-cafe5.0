const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoterminadocontroller');

router.post('/productosterminados', controller.crear);
router.get('/productosterminados', controller.obtenerTodos);
router.put('/productosterminados/:id', controller.actualizar);
router.delete('/pruductosterminados/:id', controller.eliminar);

module.exports = router;