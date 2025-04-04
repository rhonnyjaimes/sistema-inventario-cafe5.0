import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductosTerminados = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('empaquetado');


  const [cafeEmpaquetado] = useState([
    { id: 1, presentacion: "250g", tipo: "Meseta especial", stock: "---", caducidad: "XX/XX/XXXX" },
    { id: 2, presentacion: "500g", tipo: "Robusto", stock: "---", caducidad: "XX/XX/XXXX" },
    { id: 3, presentacion: "10g", tipo: "Meseta especial", stock: "---", caducidad: "XX/XX/XXXX" },
    { id: 4, presentacion: "50g", tipo: "Robusto", stock: "---", caducidad: "XX/XX/XXXX" },
    { id: 5, presentacion: "100g", tipo: "Robusto", stock: "---", caducidad: "XX/XX/XXXX" },
    { id: 6, presentacion: "200g", tipo: "Arábigos", stock: "---", caducidad: "XX/XX/XXXX" },
  ]);

  // Datos de ejemplo para Empaques
  const [empaques] = useState([
    { id: 1, tipo: "Caja", material: "Mezcla especial", stock: "---", proveedor: "XXXXXXXXX" },
    { id: 2, tipo: "Caja", material: "Robusto", stock: "---", proveedor: "XXXXXXXXX" },
    { id: 3, tipo: "Bolsa salada", material: "Mezcla especial", stock: "---", proveedor: "XXXXXXXXX" },
    { id: 4, tipo: "Bolsa Salada", material: "Robusto", stock: "---", proveedor: "XXXXXXXXX" },
    { id: 5, tipo: "Bolsa de papel", material: "Robusto", stock: "---", proveedor: "XXXXXXXXX" },
    { id: 6, tipo: "Caja", material: "Arábigo", stock: "---", proveedor: "XXXXXXXXX" },
  ]);


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

      {/* Main Content */}
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


        {/* Contenido Principal */}
        <div className="space-y-6">
            <button 
              className="bg-[#4A2C2A] text-white px-4 py-2 rounded-lg hover:bg-[#3a231f]"
              onClick={() => navigate(currentSection === 'empaquetado' ? '/nuevo-empaquetado' : '/nuevo-empaque')}
              >
              + Agregar Nuevo
            </button>
            
          {/* Tabla */}
          <div className="rounded-lg bg-white shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#4A2C2A] text-white">
                <tr>
                  {currentSection === 'empaquetado' ? (
                    <>
                      <th className="p-3 text-left">Presentación</th>
                      <th className="p-3 text-left">Tipo de Café</th>
                      <th className="p-3 text-center">Stock</th>
                      <th className="p-3 text-left">Caducidad</th>
                    </>
                  ) : (
                    <>
                      <th className="p-3 text-left">ID del Empaque</th>
                      <th className="p-3 text-left">Tipo de Empaque</th>
                      <th className="p-3 text-left">Material</th>
                      <th className="p-3 text-center">Stock</th>
                      <th className="p-3 text-left">Proveedor</th>
                    </>
                  )}
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(currentSection === 'empaquetado' ? cafeEmpaquetado : empaques).map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    {currentSection === 'empaquetado' ? (
                      <>
                        <td className="p-3">{item.presentacion}</td>
                        <td className="p-3">{item.tipo}</td>
                        <td className="p-3 text-center">{item.stock}</td>
                        <td className="p-3">{item.caducidad}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-3">{item.id}</td>
                        <td className="p-3">{item.tipo}</td>
                        <td className="p-3">{item.material}</td>
                        <td className="p-3 text-center">{item.stock}</td>
                        <td className="p-3">{item.proveedor}</td>
                      </>
                    )}
                    <td className="p-3 text-center">
                      <button className="text-[#4A2C2A] hover:text-[#3a231f]">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Navegación Inferior */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentSection('empaquetado')}
                className={`px-4 py-2 rounded-lg ${
                  currentSection === 'empaquetado' 
                    ? 'bg-[#4A2C2A] text-white' 
                    : 'bg-gray-200 text-[#4A2C2A]'
                }`}
              >
                Café Empaquetado
              </button>
              <button
                onClick={() => setCurrentSection('empaques')}
                className={`px-4 py-2 rounded-lg ${
                  currentSection === 'empaques' 
                    ? 'bg-[#4A2C2A] text-white' 
                    : 'bg-gray-200 text-[#4A2C2A]'
                }`}
              >
                Empaques
              </button>
            </div>
            
            {/* Paginación */}
            <div className="flex gap-2 px-4 py-2 rounded-lg bg-[#4A2C2A] text-white">
              <button className="px-3 py-1 rounded bg-[white] text-[#4A2C2A]">
                Anterior
              </button>
              <span className="px-3 py-1">1</span>
              <button className="px-3 py-1 rounded bg-[white] text-[#4A2C2A]">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductosTerminados;