const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

exports.verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) return res.status(403).json({ mensaje: "Token no proporcionado" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ mensaje: "Token inválido" });
    req.userId = decoded.id;
    req.userRol = decoded.rol;
    next();
  });
};