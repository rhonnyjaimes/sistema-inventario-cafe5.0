const express = require('express');
const router = express.Router();
const loteTostadoController = require('../controllers/lotetostadocontroller');

router.post('/lotestostados', loteTostadoController.crearLoteTostado);
router.get('/lotestostados', loteTostadoController.obtenerLotesTostados);
router.put('/lotestostados/:id', loteTostadoController.actualizarLoteTostado);
router.delete('/lotestostados/:id', loteTostadoController.eliminarLoteTostado);

module.exports = router;