import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center">
        {/* Encabezado con logo - Animación de flotación */}
        <div className="mb-12 animate-float">
          <img 
            src="/img/logo.jpg" 
            alt="Logo Café 5.0" 
            className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-coffee shadow-lg transform transition-transform duration-300 hover:scale-105"
          />
          <h1 className="text-4xl font-bold text-coffee mb-4 animate-slide-in-top">
            Sistema de Inventario
          </h1>
          <h2 className="text-3xl font-semibold text-coffee/80 animate-slide-in-bottom">
            CAFÉ 5.0
          </h2>
          <p className="mt-2 text-lg text-gray-600 animate-fade-in delay-100">
            Gestión integral de producción y distribución
          </p>
        </div>

        {/* Botones principales - Animación escalonada */}
        <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
          <Link
            to="/login"
            className="bg-coffee text-white px-8 py-3 rounded-lg font-medium hover:bg-coffee/90 transition-all text-lg shadow-md transform hover:scale-105 animate-rise delay-200"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/registro"
            className="bg-white text-coffee px-8 py-3 rounded-lg font-medium border-2 border-coffee hover:bg-gray-50 transition-all text-lg shadow-md transform hover:scale-105 animate-rise delay-300"
          >
            Crear Cuenta
          </Link>
        </div>

        {/* Tarjetas de características - Animación en cascada */}
        <div className="grid md:grid-cols-3 gap-8 px-4">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-staggered-card delay-400">
            <h3 className="text-xl font-semibold text-coffee mb-3">
              📦 Gestión de Inventario
            </h3>
            <p className="text-gray-600">
              Control detallado de existencias y caducidades
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-staggered-card delay-500">
            <h3 className="text-xl font-semibold text-coffee mb-3">
              🏭 Seguimiento de Producción
            </h3>
            <p className="text-gray-600">
              Monitoreo en tiempo real de procesos productivos
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-staggered-card delay-600">
            <h3 className="text-xl font-semibold text-coffee mb-3">
              📊 Reportes Automáticos
            </h3>
            <p className="text-gray-600">
              Generación de informes y análisis estadísticos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;