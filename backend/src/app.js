const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Conectar a la base de datos
sequelize.sync({ force: false })
  .then(() => console.log("Base de datos conectada"))
  .catch((err) => console.error("Error de conexión:", err));

// Rutas
app.use("/api/auth", authRoutes);

// Manejo de errores
app.use(errorHandler);

module.exports = app;