const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");

exports.registrar = async (req, res) => {
  const { nombre, email, contrasena, rol } = req.body;
  try {
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) return res.status(400).json({ msg: "El usuario ya existe" });

    const id = await Usuario.crear(nombre, email, contrasena, rol);
    res.json({ msg: "Usuario registrado", id });
  } catch (error) {
    res.status(500).json({ msg: "Error al registrar usuario" });
  }
};
