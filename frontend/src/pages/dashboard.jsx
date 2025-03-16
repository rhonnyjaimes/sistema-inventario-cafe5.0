import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !storedUser) navigate('/login');
    else setUserData(storedUser);
  }, [navigate]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.clear();
      navigate('/login');
    }, 500); // Duración de la animación
  };

  if (!userData) return <div className="p-4 text-gray-600">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#8FBC8F] font-sans">
      {/* Sidebar con animación */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-[#4A2C2A] p-4 ${isLoggingOut ? 'animate-slide-out-left' : 'animate-slide-in-left'}`}>
        <div className="mb-8 flex items-center gap-4 border-b border-[#8FBC8F] pb-4">
          <img 
            src="/img/logo.jpg"
            alt="Logo Café 5.0"
            className="h-12 w-12 rounded-full border-2 border-white"
          />
          <span className="text-xl font-bold text-white">Café 5.0</span>
        </div>
        
        <nav className="space-y-2">
          {[
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Materia Prima', path: '/matprima' },
            { name: 'Producción', path: '/prod' },
            { name: 'Productos Terminados', path: '/prodterm' },
            { name: 'Ventas', path: '/ventas' },
            { name: 'Gestion de Usuarios', path: '/usuarios' }

          ].map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="w-full rounded-lg p-3 text-left text-white hover:bg-[#8FBC8F]/20 hover:transition-colors duration-200"
            >
              {item.name}
            </button>
          ))}
        </nav>      </div>

      {/* Main Content con animación */}
      <div className={`ml-64 p-6 ${isLoggingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-4 shadow">
          <h1 className="text-2xl font-bold text-[#4A2C2A]">SISTEMA DE INVENTARIO</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-[#4A2C2A]">{userData.nombre}</p>
              <p className="text-sm text-gray-600">{userData.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-[#4A2C2A] px-4 py-2 text-white hover:bg-[#3a231f] transition-all duration-300"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-bold text-[#4A2C2A]">Materia Prima</h3>
            <div className="h-32 rounded-lg bg-[#8FBC8F]/30 p-4">
              <p className="text-3xl font-bold">120kg</p>
              <p className="text-sm text-gray-600">Granos de café en stock</p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-bold text-[#4A2C2A]">Productos Terminados</h3>
            <div className="h-32 rounded-lg bg-[#8FBC8F]/30 p-4">
              <p className="text-3xl font-bold">320</p>
              <p className="text-sm text-gray-600">Paquetes listos</p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-bold text-[#4A2C2A]">Alertas Activas</h3>
            <div className="space-y-3">
              <div className="rounded-lg bg-[#FFD700]/20 p-3">
                <p className="font-medium text-[#FFD700]">Stock bajo</p>
                <p className="text-sm">Bolsas de 1kg (50 unidades)</p>
              </div>
              <div className="rounded-lg bg-[#FF0000]/20 p-3">
                <p className="font-medium text-[#FF0000]">Caducidad próxima</p>
                <p className="text-sm">Lote #2023-10 (15 días)</p>
              </div>
            </div>
          </div>
        </div>

        

        {/* Gráfico de ejemplo */}
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-bold text-[#4A2C2A]">Producción Mensual</h3>
          <div className="h-64 rounded-lg bg-[#8FBC8F]/30 p-4">
            <div className="flex h-full items-center justify-center text-gray-400">
              Gráfico de producción vs ventas
            </div>
          </div>
        </div>

        {/* Botón flotante */}
        <button className="fixed bottom-8 right-8 rounded-full bg-[#4A2C2A] p-4 text-white shadow-lg hover:bg-[#3a231f]">
          + Nuevo Lote
        </button>
      </div>
    </div>
  );
};

export default Dashboard;