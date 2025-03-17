import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Produccion = () => {
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


  const [produccionType, setProduccionType] = useState('tostado');
  const [producciones, setProducciones] = useState([
    {
      id: 1,
      produccion: "Productos Terminados",
      lote: "0011",
      fecha: "2/2/2025 7:35 PM",
      temperatura: "---°",
      perdida: "---",
      tiempo: "1 hr",
      acciones: "Editar"
    }
  ]);

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calcular totales
  const totalProduccion = producciones.length;
  const totalTiempo = producciones.reduce((acc, curr) => acc + parseInt(curr.tiempo), 0);
  const promedioPerdida = producciones.reduce((acc, curr) => acc + (curr.perdida === '---' ? 0 : parseFloat(curr.perdida)), 0) / producciones.length;

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
        </nav>      
      </div>

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
          <div className="space-y-6">

          {/* Selector de Tipo de Producción */}

          <div className="rounded-lg bg-white p-4 shadow flex justify-between items-center w-64">
            <div className="w-48">
              <h2 className="text-lg font-semibold text-[#4A2C2A] mb-2">TIPO DE PRODUCCIÓN</h2>
              <select 
                value={produccionType}
                onChange={(e) => setProduccionType(e.target.value)}
                className="w-full p-2 border rounded bg-white text-sm"
              >
                <option value="tostado">Tostado</option>
                <option value="molido">Molido</option>
              </select>
            </div>
          </div>
          
          {/* Tabla */}
          <div className="table-container rounded-lg bg-white shadow overflow-hidden">
          <table className="w-full border-collapse">
              <thead className="bg-white text-[#4A2C2A]">
                <tr>
                  <th className="p-3 text-left text-sm font-bold">Producción</th>
                  <th className="p-3 text-left text-sm font-bold">ID de Lote</th>
                  <th className="p-3 text-left text-sm font-bold">Fecha</th>
                  <th className="p-3 text-center text-sm font-bold">Temperatura</th>
                  <th className="p-3 text-center text-sm font-bold">Pérdida de Peso</th>
                  <th className="p-3 text-center text-sm font-bold">Tiempo</th>
                  <th className="p-3 text-center text-sm font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {producciones.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{item.produccion}</td>
                    <td className="p-3 text-sm font-medium text-[#4A2C2A]">{item.lote}</td>
                    <td className="p-3 text-sm">{item.fecha}</td>
                    <td className="p-3 text-center text-sm">{item.temperatura}</td>
                    <td className="p-3 text-center text-sm">{item.perdida}</td>
                    <td className="p-3 text-center text-sm">{item.tiempo}</td>
                    <td className="p-3 text-center">
                      <button className="text-[#4A2C2A] hover:text-[#3a231f] flex items-center gap-1">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="flex justify-between items-center p-3 border-t">
              <span className="text-sm text-gray-600">
                Mostrando {producciones.length} resultados
              </span>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 rounded bg-[#8FBC8F] text-[#4A2C2A] hover:bg-[#7da57d]"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  Anterior
                </button>
                <span className="px-3 py-1">{currentPage}</span>
                <button 
                  className="px-3 py-1 rounded bg-[#8FBC8F] text-[#4A2C2A] hover:bg-[#7da57d]"
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          {/* Total en Producción */}
          <div className="fixed bottom-0 left-64 right-0 bg-[#8FBC8F] z-10">
            <div className="p-4 shadow-lg">
              <div className="rounded-lg bg-white p-4 shadow">
                <h2 className="text-lg font-semibold text-[#4A2C2A] mb-4">TOTAL EN PRODUCCIÓN</h2>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-[#8FBC8F]/20 rounded">
                    <p className="text-sm text-[#4A2C2A]">Total Items</p>
                    <p className="text-2xl font-bold mt-1">{totalProduccion}</p>
                  </div>
                  <div className="text-center p-3 bg-[#8FBC8F]/20 rounded">
                    <p className="text-sm text-[#4A2C2A]">Tiempo Total</p>
                    <p className="text-2xl font-bold mt-1">{totalTiempo}h</p>
                  </div>
                  <div className="text-center p-3 bg-[#8FBC8F]/20 rounded">
                    <p className="text-sm text-[#4A2C2A]">Pérdida Promedio</p>
                    <p className="text-2xl font-bold mt-1">{promedioPerdida.toFixed(1)}%</p>
                  </div>
                  <div className="text-center p-3 bg-[#8FBC8F]/20 rounded">
                    <p className="text-sm text-[#4A2C2A]">Lotes Activos</p>
                    <p className="text-2xl font-bold mt-1">{producciones.filter(p => p.status === 'activo').length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Produccion;