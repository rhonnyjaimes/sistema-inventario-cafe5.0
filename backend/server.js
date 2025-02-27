require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware para procesar JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());

// Importar rutas
const authRoutes = require("./src/routes/authroutes");
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Servidor corriendo...");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
