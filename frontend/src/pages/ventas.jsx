import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Ventas = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('id_pedido');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pedidos, setPedidos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPedido, setCurrentPedido] = useState(null);
  const [productos, setProductos] = useState([]);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pedidosRes, productosRes] = await Promise.all([
          fetch('http://localhost:3001/api/pedidos'),
          fetch('http://localhost:3001/api/productosterminados')
        ]);
        
        const pedidosData = await pedidosRes.json();
        const productosData = await productosRes.json();
        
        setPedidos(pedidosData);
        setProductos(productosData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
      navigate('/login');
    } else {
      setUserData(user);
      fetchData();
    }
  }, [navigate]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.clear();
      navigate('/login');
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pedidoData = Object.fromEntries(formData.entries());

    try {
      const url = currentPedido 
        ? `http://localhost:3001/api/pedidos/${currentPedido.id_pedido}`
        : 'http://localhost:3001/api/pedidos';

      const method = currentPedido ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pedidoData,
          cantidad_paquetes: Number(pedidoData.cantidad_paquetes)
        })
      });

      if (response.ok) {
        const updatedPedido = await response.json();
        setPedidos(prev => 
          currentPedido 
            ? prev.map(p => p.id_pedido === updatedPedido.id_pedido ? updatedPedido : p)
            : [...prev, updatedPedido]
        );
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error guardando pedido:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este pedido?')) {
      try {
        await fetch(`http://localhost:3001/api/pedidos/${id}`, { method: 'DELETE' });
        setPedidos(prev => prev.filter(p => p.id_pedido !== id));
      } catch (error) {
        console.error('Error eliminando pedido:', error);
      }
    }
  };

  const filteredPedidos = pedidos.filter(pedido => {
    const searchMatch = filterType === 'id_pedido'
      ? pedido.id_pedido.toString().includes(searchTerm)
      : pedido.estado_pago.toLowerCase().includes(searchTerm.toLowerCase());
    
    const dateMatch = dateFilter
      ? pedido.fecha_pedido === dateFilter || pedido.fecha_entrega === dateFilter
      : true;

    return searchMatch && dateMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPedidos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);

  if (!userData) return <div className="p-4 text-gray-600">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#8FBC8F] font-sans">
      {/* Modal para editar/crear */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 animate-scale-in">
            <h2 className="text-xl font-bold mb-4">
              {currentPedido ? 'Editar Pedido' : 'Nuevo Pedido'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Producto</label>
                  <select
                    name="id_producto"
                    className="w-full p-2 border rounded"
                    defaultValue={currentPedido?.id_producto}
                    required
                  >
                    {productos.map(p => (
                      <option key={p.id_producto} value={p.id_producto}>
                        Producto #{p.id_producto}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Cantidad de paquetes</label>
                  <input
                    type="number"
                    name="cantidad_paquetes"
                    min="1"
                    defaultValue={currentPedido?.cantidad_paquetes}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Fecha pedido</label>
                    <input
                      type="date"
                      name="fecha_pedido"
                      defaultValue={currentPedido?.fecha_pedido}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Fecha entrega</label>
                    <input
                      type="date"
                      name="fecha_entrega"
                      defaultValue={currentPedido?.fecha_entrega}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">Estado de pago</label>
                  <select
                    name="estado_pago"
                    className="w-full p-2 border rounded"
                    defaultValue={currentPedido?.estado_pago || 'pendiente'}
                    required
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="cobrado">Cobrado</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4A2C2A] text-white rounded hover:bg-[#3a231f]"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barra lateral */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-[#4A2C2A] p-4 ${isLoggingOut ? 'animate-slide-out-left' : 'animate-slide-in-left'}`}>
        <div className="mb-8 flex items-center gap-4 border-b border-[#8FBC8F] pb-4">
          <img 
            src="/img/logo.jpg"
            alt="Logo"
            className="h-12 w-12 rounded-full border-2 border-white"
          />
          <span className="text-xl font-bold text-white">Café 5.0</span>
        </div>
        
        <nav className="space-y-2">
          {['Dashboard', 'Materia Prima', 'Producción', 'Productos Terminados', 'Ventas', 'Gestión de Usuarios'].map((item) => (
            <button
              key={item}
              onClick={() => navigate(`/${item.toLowerCase().replace(/ /g, '-')}`)}
              className="w-full text-left p-3 text-white rounded-lg hover:bg-[#8FBC8F]/20 transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido principal */}
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
              className="bg-[#4A2C2A] text-white px-4 py-2 rounded hover:bg-[#3a231f] transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Filtros y tabla */}
        <div className="flex gap-6">
          {/* Panel de filtros */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 shadow">
              <h2 className="text-lg font-semibold text-[#4A2C2A] mb-4">Filtros</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Buscar por:</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="filter"
                        checked={filterType === 'id_pedido'}
                        onChange={() => setFilterType('id_pedido')}
                        className="accent-[#4A2C2A]"
                      />
                      <span className="text-sm">ID Pedido</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="filter"
                        checked={filterType === 'estado_pago'}
                        onChange={() => setFilterType('estado_pago')}
                        className="accent-[#4A2C2A]"
                      />
                      <span className="text-sm">Estado de pago</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <label className="block text-sm mb-2">Filtrar por fecha</label>
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
                    Limpiar filtro
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de pedidos */}
          <div className="flex-grow">
            <div className="mb-6 flex justify-between items-center">
              <div className="relative w-96">
                <input
                  type="text"
                  placeholder={filterType === 'id_pedido' ? 'Buscar por ID...' : 'Buscar por estado...'}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-full py-2 px-4 border-2 border-[#4A2C2A] focus:outline-none focus:ring-2 focus:ring-[#4A2C2A]"
                />
              </div>
              <button
                onClick={() => {
                  setCurrentPedido(null);
                  setShowModal(true);
                }}
                className="bg-[#4A2C2A] text-white px-4 py-2 rounded hover:bg-[#3a231f] transition-colors"
              >
                + Nuevo pedido
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="max-h-[500px] overflow-auto">
                <table className="w-full">
                  <thead className="bg-[#4A2C2A] text-white sticky top-0">
                    <tr>
                      <th className="p-3 text-left">ID</th>
                      <th className="p-3 text-left">Producto</th>
                      <th className="p-3 text-center">Paquetes</th>
                      <th className="p-3 text-left">Fecha Pedido</th>
                      <th className="p-3 text-left">Fecha Entrega</th>
                      <th className="p-3 text-center">Estado</th>
                      <th className="p-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(pedido => (
                      <tr key={pedido.id_pedido} className="border-b hover:bg-gray-50">
                        <td className="p-3">{pedido.id_pedido}</td>
                        <td className="p-3">Producto #{pedido.id_producto}</td>
                        <td className="p-3 text-center">{pedido.cantidad_paquetes}</td>
                        <td className="p-3">{pedido.fecha_pedido}</td>
                        <td className="p-3">{pedido.fecha_entrega}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pedido.estado_pago === 'cobrado'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {pedido.estado_pago}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              setCurrentPedido(pedido);
                              setShowModal(true);
                            }}
                            className="text-[#4A2C2A] hover:text-[#3a231f] mr-3"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(pedido.id_pedido)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {currentItems.length === 0 && (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-500">
                          No se encontraron pedidos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div className="flex justify-between items-center p-3 bg-gray-50 border-t">
                <span className="text-sm text-gray-600">
                  Mostrando {Math.min(indexOfFirstItem + 1, filteredPedidos.length)}-
                  {Math.min(indexOfLastItem, filteredPedidos.length)} de {filteredPedidos.length} resultados
                </span>
                <div className="flex items-center gap-2">
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