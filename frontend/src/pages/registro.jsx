import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    rol: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:3001/auth/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        let mensajeError = 'Error en el registro';
        switch(data.tipo) {
          case 'campos_vacios':
            mensajeError = 'Todos los campos son obligatorios';
            break;
          case 'email_invalido':
            mensajeError = 'Formato de email inválido';
            break;
          case 'usuario_existente':
            mensajeError = 'El correo ya está registrado';
            break;
          case 'contrasena_debil':
            mensajeError = 'La contraseña debe tener al menos 8 caracteres';
            break;
          default:
            mensajeError = data.msg || 'Error desconocido';
        }
        setError(mensajeError);
        return;
      }

      setShowSuccess(true);
      setTimeout(() => navigate("/"), 3000);

    } catch (error) {
      setError('Error de conexión con el servidor');
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Modal de éxito */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-xl text-center max-w-sm animate-scale-in">
            <div className="mx-auto mb-4 w-16 h-16">
              <svg
                className="checkmark animate-check"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className="checkmark__circle"
                  fill="none"
                  cx="26"
                  cy="26"
                  r="25"
                  stroke="#4A2C2A"
                  strokeWidth="2"
                />
                <path
                  className="checkmark__check"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  stroke="#4A2C2A"
                  strokeWidth="3"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-coffee mb-4">
              ¡Registro Exitoso!
            </h3>
            <p className="text-gray-600 mb-6">
              Serás redirigido automáticamente al inicio
            </p>
            <Link
              to="/"
              className="bg-coffee text-white px-6 py-2 rounded-lg font-medium hover:bg-coffee/90 transition-colors"
            >
              Volver Ahora
            </Link>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
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

        <div className="p-8">
          <h2 className="text-2xl font-bold text-coffee text-center mb-6 animate-slide-in-top">
            Crear Cuenta
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg animate-shake">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-coffee mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej: Juan Pérez"
                className="w-full px-4 py-2 border border-coffee/20 rounded-lg focus:ring-2 focus:ring-coffee/50 focus:border-coffee"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Mínimo 8 caracteres"
                className="w-full px-4 py-2 border border-coffee/20 rounded-lg focus:ring-2 focus:ring-coffee/50 focus:border-coffee"
                value={formData.contrasena}
                onChange={handleChange}
                minLength="8"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee mb-1">
                Rol
              </label>
              <select
                name="rol"
                className="w-full px-4 py-2 border border-coffee/20 rounded-lg focus:ring-2 focus:ring-coffee/50 focus:border-coffee"
                value={formData.rol}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un rol</option>
                <option value="operario">Operario</option>
                <option value="supervisor">Supervisor</option>
                <option value="gerente">Gerente</option>
              </select>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <button
                type="submit"
                className="w-full bg-coffee text-white py-2 rounded-lg font-medium hover:bg-coffee/90 transition-colors animate-rise"
              >
                Registrar cuenta
              </button>

              <Link
                to="/"
                className="w-full text-center bg-gray-100 text-coffee py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors animate-rise delay-100"
              >
                Volver al Inicio
              </Link>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-coffee/80">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-coffee font-medium hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;