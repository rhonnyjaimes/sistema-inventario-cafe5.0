import React from "react";
import { Routes, Route } from "react-router-dom";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import TestPage from './pages/TestPage';  // Importación correcta

function App() {
  return (
    <Routes>
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/test" element={<TestPage />} />  {/* Nueva ruta para pruebas */}
    </Routes>
  );
}

export default App;