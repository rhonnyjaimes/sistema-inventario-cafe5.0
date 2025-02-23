const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");
const { JWT_SECRET } = process.env;

exports.registro = async (req, res, next) => {
  try {
    const { nombre, email, contrasena, rol } = req.body;
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    
    if (usuarioExistente) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const usuario = await Usuario.create({ nombre, email, contrasena, rol });
    res.status(201).json({ id: usuario.id, email: usuario.email });
  } catch (error) {
    next(error); // Pasa el error al middleware centralizado
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, contrasena } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !bcrypt.compareSync(contrasena, usuario.contrasena)) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
};