const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidocontroller");

// Crear nuevo pedido
router.post("/pedidos", pedidoController.crearPedido);

// Obtener todos los pedidos
router.get("/pedidos", pedidoController.obtenerPedidos);


// Actualizar pedido
router.put("/pedidos/:id", pedidoController.actualizarPedido);

// Eliminar pedido
router.delete("/pedidos/:id", pedidoController.eliminarPedido);

module.exports = router;