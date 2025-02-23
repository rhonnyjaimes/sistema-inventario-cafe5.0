import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/index";
import Registro from "./pages/registro";
import Login from "./pages/login";
import TestPage from './pages/TestPage';
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/test" element={<TestPage />} />
      
      {/* Ruta protegida */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirección para rutas no definidas */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;