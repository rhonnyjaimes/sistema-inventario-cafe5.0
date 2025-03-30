import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    contrasena: ""
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || "Credenciales incorrectas");
      }

      // Animación de éxito
      setIsLoggingIn(true);
      
      // Esperar a que termine la animación
      setTimeout(() => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.usuario));
        navigate("/dashboard");
      }, 800);

    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden 
        ${isLoggingIn ? 'animate-slide-out-up animate-fade-out' : 'animate-slide-in-up'}`}>
        
        {/* Sección de imagen */}
        <div className="relative h-32 bg-coffee">
          <img
            src="/img/cafe.jpg"
            alt="Café 5.0"
            className="w-full h-full object-cover opacity-75 animate-fade-in"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <img 
              src="/img/logo.jpg"
              alt="Logo Café 5.0"
              className={`h-16 w-16 rounded-full border-2 border-white ${
                isLoggingIn ? 'animate-scale-out' : 'animate-scale-in'
              }`}
            />
          </div>
        </div>

        {/* Formulario */}
        <div className="p-8">
          <h2 className={`text-2xl font-bold text-coffee text-center mb-6 ${
            isLoggingIn ? 'animate-slide-out-top' : 'animate-slide-in-top'
          }`}>
            Iniciar Sesión
          </h2>
          
          {error && (
            <div 
            data-testid="error-message"
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg animate-shake">
              ⚠️ {error}
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-rise delay-100">
              <label className="block text-sm font-medium text-coffee mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                placeholder="usuario@correo.com"
                className="w-full px-4 py-2 border border-coffee/20 rounded-lg focus:ring-2 focus:ring-coffee/50 focus:border-coffee transition-all duration-300 hover:scale-[1.02]"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="animate-rise delay-200">
              <label className="block text-sm font-medium text-coffee mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="contrasena"
                placeholder="Ingrese su contraseña"
                className="w-full px-4 py-2 border border-coffee/20 rounded-lg focus:ring-2 focus:ring-coffee/50 focus:border-coffee transition-all duration-300 hover:scale-[1.02]"
                value={formData.contrasena}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <button
                type="submit"
                data-testid="submit-btn" // 👈 ¡Añade esta línea!
                className="w-full bg-coffee text-white py-2 rounded-lg font-medium hover:bg-coffee/90 transition-all duration-300 hover:scale-[1.02] active:scale-95 animate-rise delay-300 disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className=" w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando...
                  </div>
                ) : (
                  "Ingresar al sistema"
                )}
              </button>

              <Link
                to="/"
                className="w-full text-center bg-gray-100 text-coffee py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 hover:scale-[1.02] active:scale-95 animate-rise delay-400"
              >
                Volver al Inicio
              </Link>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-coffee/80 animate-rise delay-500">
            ¿No tienes cuenta?{" "}
            <Link 
              to="/registro" 
              className="text-coffee font-medium hover:underline transition-all duration-200"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;