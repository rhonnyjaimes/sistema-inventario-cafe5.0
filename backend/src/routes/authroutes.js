const express = require("express");
const { registrar, login } = require("../controllers/authcontroller"); // Importa ambos controladores

const router = express.Router();

// Ruta para registro de usuarios
router.post("/registro", registrar);

// Nueva ruta para inicio de sesión
router.post("/login", login);

module.exports = router;