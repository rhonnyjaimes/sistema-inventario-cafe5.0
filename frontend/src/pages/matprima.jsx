import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MateriaPrima = () => {
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

  const [showSection, setShowSection] = useState('granos'); // 'granos' o 'proveedores'

  const [granos] = useState([
    { id: 0, origen: "---", stock: 30, peso: 120, proveedor: "Aerobic exit" },
    { id: 1, origen: "---", stock: 45, peso: 140, proveedor: "Aerobic exit" },
    { id: 2, origen: "---", stock: 43, peso: 450, proveedor: "Aerobic exit" },
  ]);

  const [proveedores] = useState([
    { 
      idPago: 4, 
      fechaCompra: "2025-02-02", 
      producto: "Cele XXX", 
      cantidad: 40, 
      precio: "12000$", 
      direccion: "XXXXXXX", 
      proveedor: "XXXXX", 
      status: "Pendiente Page" 
    }
  ]);


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
        <div className="min-h-screen bg-[#8FBC8F] font-sans p-6">
      {/* Header con navegación */}

      
      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#4A2C2A]">MATERIA PRIMA</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowSection('granos')}
              className={`px-4 py-2 rounded-lg ${
                showSection === 'granos' 
                  ? 'bg-[#4A2C2A] text-white' 
                  : 'bg-gray-100 text-[#4A2C2A] hover:bg-gray-200'
              }`}
            >
              Granos
            </button>
            <button
              onClick={() => setShowSection('proveedores')}
              className={`px-4 py-2 rounded-lg ${
                showSection === 'proveedores' 
                  ? 'bg-[#4A2C2A] text-white' 
                  : 'bg-gray-100 text-[#4A2C2A] hover:bg-gray-200'
              }`}
            >
              Proveedores
            </button>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-[#4A2C2A]">
          {showSection === 'granos' ? 'Granos' : 'Proveedores'}
        </h2>
      </div>

      {showSection === 'granos' ? (
        /* Sección Granos */
        <div className="rounded-lg bg-white p-4 shadow mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#4A2C2A] text-white">
                <tr>
                  <th className="p-3 text-center">ID</th>
                  <th className="p-3 text-left">Origen</th>
                  <th className="p-3 text-center">Stock</th>
                  <th className="p-3 text-center">Peso (kg)</th>
                  <th className="p-3 text-left">Proveedor</th>
                  <th className="p-3 text-center">Editar</th>
                </tr>
              </thead>
              <tbody>
                {granos.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-center">{item.id}</td>
                    <td className="p-3">{item.origen}</td>
                    <td className="p-3 text-center">{item.stock}</td>
                    <td className="p-3 text-center">{item.peso}</td>
                    <td className="p-3">{item.proveedor}</td>
                    <td className="p-3 text-center">
                      <button className="text-[#4A2C2A] hover:text-[#3a231f] font-medium">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (

        
        /* Sección Proveedores */
        <div className="rounded-lg bg-white p-4 shadow mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#4A2C2A] text-white">
                <tr>
                  <th className="p-3">ID Pago</th>
                  <th className="p-3">Fecha Compra</th>
                  <th className="p-3">Producto</th>
                  <th className="p-3">Cantidad</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3">Dirección</th>
                  <th className="p-3">Proveedor</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.map((proveedor, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-center">{proveedor.idPago}</td>
                    <td className="p-3">{proveedor.fechaCompra}</td>
                    <td className="p-3">{proveedor.producto}</td>
                    <td className="p-3 text-center">{proveedor.cantidad}</td>
                    <td className="p-3">{proveedor.precio}</td>
                    <td className="p-3">{proveedor.direccion}</td>
                    <td className="p-3">{proveedor.proveedor}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        {proveedor.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button className="fixed bottom-8 right-8 rounded-full bg-[#4A2C2A] p-4 text-white shadow-lg hover:bg-[#3a231f]">
        + Nuevo Registro
      </button>
    </div>
        
      </div>
    </div>
  );
};

export default MateriaPrima;