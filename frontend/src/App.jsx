import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/index";
import Login from "./pages/login";
import TestPage from './pages/TestPage';
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MateriaPrima from './pages/matprima';
import Produccion from './pages/prod';
import ProductosTerminados from './pages/prodterm';
import Ventas from './pages/ventas';
import Usuarios from './pages/usuarios';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/test" element={<TestPage />} />

      <Route path="/matprima" element={<MateriaPrima />} />
      <Route path="/prod" element={<Produccion />} />
      <Route path="/prodterm/" element={<ProductosTerminados />} />
      <Route path="/ventas" element={<Ventas />} />
      <Route path="/usuarios" element={<Usuarios />} />

      
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