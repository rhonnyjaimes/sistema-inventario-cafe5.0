const express = require('express');
const router = express.Router();
const loteMolidoController = require('../controllers/lotemolidocontroller');

router.post('/lotesmolidos', loteMolidoController.crearLoteMolido);
router.get('/lotesmolidos', loteMolidoController.obtenerLotesMolidos);
router.put('/lotesmolidos/:id', loteMolidoController.actualizarLoteMolido);
router.delete('/lotesmolidos/:id', loteMolidoController.eliminarLoteMolido);

module.exports = router;