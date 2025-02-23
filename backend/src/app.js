const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./config/database");
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Sincronizar modelos con la base de datos
sequelize.sync({ force: false }) // ¡Cuidado con `force: true` en producción!
  .then(() => console.log("Base de datos conectada"))
  .catch((err) => console.error("Error de conexión:", err));

// Rutas
const authRoutes = require("./routes/auth.routes");
const proveedorRoutes = require("./routes/proveedor.routes");

app.use("/api/auth", authRoutes);
app.use("/api/proveedores", proveedorRoutes); // Proteger con verifyToken si es necesario

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

module.exports = app;