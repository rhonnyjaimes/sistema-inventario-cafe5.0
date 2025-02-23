import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app.jsx";
import "./index.css"; // Importación CORREGIDA (Tailwind)
// import "bootstrap/dist/css/bootstrap.min.css"; // Eliminar Bootstrap si no es necesario

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);