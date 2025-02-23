import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    rol: "operario",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/auth/registro", formData);
      alert("Usuario registrado con éxito");
      navigate("/login");
    } catch (error) {
      alert("Error al registrar usuario");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" name="contrasena" value={formData.contrasena} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select className="form-control" name="rol" value={formData.rol} onChange={handleChange}>
            <option value="operario">Operario</option>
            <option value="supervisor">Supervisor</option>
            <option value="gerente">Gerente</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Registrar</button>
      </form>
    </div>
  );
};

export default Registro;
