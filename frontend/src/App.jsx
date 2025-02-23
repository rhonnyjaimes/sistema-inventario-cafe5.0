import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/index"; // Nombre con mayúscula
import Registro from "./pages/registro";
import Login from "./pages/login";
import TestPage from './pages/TestPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} /> {/* Ruta principal */}
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/test" element={<TestPage />} />
    </Routes>
  );
}

export default App;