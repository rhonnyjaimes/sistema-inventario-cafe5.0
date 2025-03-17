import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Ventas = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('id');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Datos de ejemplo
  const [pedidos, setPedidos] = useState([
    { id: 1, cliente: 'Cliente 5', cantidad: 10, fechaPedido: '2025-03-15', fechaEntrega: '2025-03-20' },
    { id: 2, cliente: 'Cliente 2', cantidad: 5, fechaPedido: '2025-03-16', fechaEntrega: '2025-03-21' },
    { id: 3, cliente: 'Cliente 3', cantidad: 8, fechaPedido: '2025-03-17', fechaEntrega: '2025-03-22' },
  ]);
  
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
    }, 500);
  };

  // Función de filtrado de la tabla para ID, pedido y fecha
  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = () => {
      if (filterType === 'id') return pedido.id.toString().includes(searchTerm);
      if (filterType === 'cliente') return pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase());
      return true;
    };

    const matchesDate = dateFilter ? 
      pedido.fechaPedido === dateFilter || pedido.fechaEntrega === dateFilter : 
      true;

    return matchesSearch() && matchesDate;
  });

  // Paginación de la tabla
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPedidos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);

  const handleFilterChange = (type) => {
    setFilterType(type);
    setSearchTerm('');
    setCurrentPage(1);
  };

  
  if (!userData) return <div className="p-4 text-gray-600">Cargando...</div>;


  return (
    <div className="min-h-screen bg-[#8FBC8F] font-sans">
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

      {/* Header de la pagina */}
      <div className={`ml-64 p-6 ${isLoggingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
        <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-4 shadow">
          <h1 className="text-2xl font-bold text-[#4A2C2A]">SISTEMA DE INVENTARIO</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-[#4A2C2A]">{userData.nombre}</p>
              <p className="text-sm text-gray-600">{userData.email}</p>
            </div>
            <button onClick={handleLogout} className="rounded-lg bg-[#4A2C2A] px-4 py-2 text-white hover:bg-[#3a231f] transition-all duration-300">Cerrar Sesión</button>
          </div>
      </div>

        {/* Tabla y filtrado */}
        <div className="flex gap-6">
          {/* Sección de Filtros */}
          <div className="w-64 flex-shrink-0">
            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="text-lg font-semibold text-[#4A2C2A] mb-4">Filtros</h2>
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="filter" 
                      checked={filterType === 'id'}
                      onChange={() => handleFilterChange('id')}
                      className="h-4 w-4 accent-[#4A2C2A]" 
                    />
                    <span className="text-sm">Filtrar por ID</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="filter" 
                      checked={filterType === 'cliente'}
                      onChange={() => handleFilterChange('cliente')}
                      className="h-4 w-4 accent-[#4A2C2A]" 
                    />
                    <span className="text-sm">Filtrar por Cliente</span>
                  </label>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-[#4A2C2A] mb-2">Filtrar por fecha</h3>
                  <input 
                    type="date" 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full p-1 border rounded text-sm"
                  />
                  <button 
                    onClick={() => setDateFilter('')}
                    className="mt-2 text-sm text-[#4A2C2A] hover:text-[#3a231f]"
                  >
                    Limpiar fecha
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sección Principal */}
          <div className="flex-grow">
            <div className="mb-6 flex justify-center">
              <div className="w-96 relative">
                <input 
                  type="text" 
                  placeholder={`Buscar por ${filterType === 'id' ? 'ID...' : 'Cliente...'}`} 
                  value={searchTerm} 
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }} 
                  className="w-full rounded-full py-2 px-4 border-2 border-[#4A2C2A] focus:outline-none focus:ring-2 focus:ring-[#4A2C2A]"
                />
              </div>
            </div>

            <div className="rounded-lg bg-white shadow overflow-hidden">
              <div className="max-h-[500px] overflow-auto">
                <table className="w-full">
                  <thead className="bg-[#4A2C2A] text-white sticky top-0">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">ID Pedido</th>
                    <th className="p-3 text-left text-sm font-medium">Cliente</th>
                    <th className="p-3 text-center text-sm font-medium">Cantidad</th>
                    <th className="p-3 text-left text-sm font-medium">Fecha Pedido</th>
                    <th className="p-3 text-left text-sm font-medium">Fecha Entrega</th>
                    <th className="p-3 text-center text-sm font-medium">Acciones</th>
                  </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((pedido) => (
                    <tr key={pedido.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{pedido.id}</td>
                    <td className="p-3 text-sm font-medium text-[#4A2C2A]">{pedido.cliente}</td>
                    <td className="p-3 text-center text-sm">{pedido.cantidad}</td>
                    <td className="p-3 text-sm">{pedido.fechaPedido}</td>
                    <td className="p-3 text-sm">{pedido.fechaEntrega}</td>
                    <td className="p-3 text-center">
                      <button className="text-[#4A2C2A] hover:text-[#3a231f]">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 inline-block" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </td>
                  </tr>                    ))}
                    {currentItems.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-4 text-center text-gray-500">
                          No se encontraron resultados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Paginación dinámica */}
              <div className="flex justify-between items-center p-3 bg-gray-50 border-t">
                <span className="text-sm text-gray-600">
                  Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPedidos.length)} de {filteredPedidos.length} resultados
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-[#8FBC8F] text-[#4A2C2A] hover:bg-[#7da57d] disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-[#8FBC8F] text-[#4A2C2A] hover:bg-[#7da57d] disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        
  );
};

export default Ventas;
