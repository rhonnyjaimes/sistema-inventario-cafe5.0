import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    contrasena: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.contrasena) {
      alert("Por favor complete todos los campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Inicio de sesión exitoso");
        navigate("/dashboard");
      } else {
        alert(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Sección de imagen */}
        <div className="relative h-32 bg-coffee">
          <img
            src="/img/cafe.jpg"
            alt="Café 5.0"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <img 
              src="/img/logo.jpg"
              alt="Logo Café 5.0"
              className="h-16 w-16 rounded-full border-2 border-white"
            />
          </div>
        </div>

        {/* Formulario */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-coffee text-center mb-6">
            Iniciar Sesión
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-coffee mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                placeholder="usuario@correo.com"
                className="w-full px-4 py-2 border border-coffee/20 rounded-lg focus:ring-2 focus:ring-coffee/50 focus:border-coffee"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="contrasena"
                placeholder="Ingrese su contraseña"
                className="w-full px-4 py-2 border border-coffee/20 rounded-lg focus:ring-2 focus:ring-coffee/50 focus:border-coffee"
                value={formData.contrasena}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-coffee text-white py-2 rounded-lg font-medium hover:bg-coffee/90 transition-colors"
            >
              Ingresar al sistema
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-coffee/80">
            ¿No tienes cuenta?{" "}
            <a href="/registro" className="text-coffee font-medium hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;