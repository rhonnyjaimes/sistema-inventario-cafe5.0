import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Ventas = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pedidos, setPedidos] = useState([
    { id: 1, cliente: 'Cliente 1', cantidad: 10, fechaPedido: '2025-03-15', fechaEntrega: '2025-03-20' },
    { id: 2, cliente: 'Cliente 2', cantidad: 5, fechaPedido: '2025-03-16', fechaEntrega: '2025-03-21' },
    { id: 3, cliente: 'Cliente 3', cantidad: 8, fechaPedido: '2025-03-17', fechaEntrega: '2025-03-22' },
    // Agrega más pedidos según sea necesario
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

  if (!userData) return <div className="p-4 text-gray-600">Cargando...</div>;

  // Filtrar los pedidos según el término de búsqueda
  const filteredPedidos = pedidos.filter(pedido => 
    pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pedido.id.toString().includes(searchTerm)
  );

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
            { name: 'Ventas', path: '/ventas' }
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

        {/* Barra de búsqueda */}
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Buscar por ID o Cliente..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="rounded-lg w-full p-2 border border-gray-300"
          />
        </div>

        {/* Tabla de pedidos */}
        <table className="min-w-full rounded-lg bg-white shadow">
          <thead>
            <tr>
              <th>ID del Pedido</th>
              <th>Cliente</th>
              <th>Cantidad</th>
              <th>Fecha de Pedido</th>
              <th>Fecha de Entrega</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.length > 0 ? (
              filteredPedidos.map(pedido => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{pedido.cliente}</td>
                  <td>{pedido.cantidad}</td>
                  <td>{pedido.fechaPedido}</td>
                  <td>{pedido.fechaEntrega}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No hay pedidos que mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ventas;
