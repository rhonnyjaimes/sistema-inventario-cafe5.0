const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) return res.status(403).json({ message: "Token no proporcionado" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });
    req.userId = decoded.id;
    req.userRol = decoded.rol;
    next();
  });
};

const isGerente = (req, res, next) => {
  if (req.userRol !== "gerente") {
    return res.status(403).json({ message: "Requiere rol de gerente" });
  }
  next();
};

module.exports = { verifyToken, isGerente };