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
const usuarioRoutes = require("./src/routes/usuarioRoutes"); 
const proveedorRoutes = require('./src/routes/proveedorroutes');
const granoRoutes = require('./src/routes/granoroutes');
const lotetostadoRoutes = require('./src/routes/lotetostadoroutes');
const loteMolidoRoutes = require('./src/routes/lotemolidoroutes');
const productoterminadoroutes  = require('./src/routes/productoterminadoroutes');
const pedidosroutes  = require('./src/routes/pedidoroutes');



// Registrar rutas
app.use("/auth", authRoutes);
app.use("/api", usuarioRoutes); 
app.use("/api", proveedorRoutes); 
app.use("/api", granoRoutes); 
app.use("/api", lotetostadoRoutes);
app.use('/api', loteMolidoRoutes);
app.use("/api",productoterminadoroutes);
app.use("/api",pedidosroutes);


app.get("/", (req, res) => {
  res.send("Servidor corriendo...");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});