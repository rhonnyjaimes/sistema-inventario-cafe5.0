const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");
const { JWT_SECRET } = process.env;

router.post("/login", async (req, res) => {
  const { email, contrasena } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario || !bcrypt.compareSync(contrasena, usuario.contrasena)) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, {
    expiresIn: "8h",
  });
  res.json({ token });
});

module.exports = router;