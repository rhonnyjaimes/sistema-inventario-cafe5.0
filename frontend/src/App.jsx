import React from "react";
import { Routes, Route } from "react-router-dom";
import Registro from "./pages/Registro";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
