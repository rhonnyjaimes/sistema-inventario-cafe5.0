import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Produccion = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showNewLoteModal, setShowNewLoteModal] = useState(false);
  const [lotesTostados, setLotesTostados] = useState([]);
  const [granos, setGranos] = useState([]);
  const [newLote, setNewLote] = useState({
    fecha: '',
    temperatura: '',
    peso_inicial_kg: '',
    id_grano: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !storedUser) {
      navigate('/login');
    } else {
      setUserData(storedUser);
      fetchData(token);
    }
  }, [navigate]);

  const fetchData = async (token) => {
    try {
      const [lotesRes, granosRes] = await Promise.all([
        fetch('http://localhost:3001/api/lotestostados', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/granos', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const lotesData = await lotesRes.json();
      const granosData = await granosRes.json();

      setLotesTostados(lotesData);
      setGranos(granosData.filter(g => g.cantidad_kg > 0));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreateLote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const selectedGrano = granos.find(g => g.id_grano === newLote.id_grano);

      if (selectedGrano.cantidad_kg < newLote.peso_inicial_kg) {
        alert('Stock insuficiente en el grano seleccionado');
        return;
      }

      const response = await fetch('http://localhost:3001/api/lotestostados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newLote)
      });

      if (!response.ok) throw new Error('Error al crear lote');

      const createdLote = await response.json();
      setLotesTostados([...lotesTostados, createdLote]);
      setShowNewLoteModal(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const totalKg = lotesTostados.reduce((acc, lote) => {
    return acc + parseFloat(lote.peso_final_kg || 0);
  }, 0);
  const perdidaPromedio = lotesTostados.length > 0 
  ? (lotesTostados.reduce((acc, lote) => acc + parseFloat(lote.perdida_peso || 0), 0) / lotesTostados.length) 
  : 0;

  if (!userData) return <div className="p-4 text-gray-600">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#8FBC8F] font-sans">
      {/* Sidebar */}
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
              className="w-full rounded-lg p-3 text-left text-white hover:bg-[#8FBC8F]/20 transition-colors duration-200"
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Modal para nuevo lote */}
      {showNewLoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Nuevo Lote Tostado</h2>
            <form onSubmit={handleCreateLote}>
              <div className="mb-4">
                <label>Grano:</label>
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => setNewLote({...newLote, id_grano: e.target.value})}
                  required
                >
                  <option value="">Seleccionar grano</option>
                  {granos.map(grano => (
                    <option key={grano.id_grano} value={grano.id_grano}>
                      {grano.origen} - {grano.cantidad_kg}kg
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label>Peso Inicial (kg):</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded"
                  onChange={(e) => setNewLote({...newLote, peso_inicial_kg: e.target.value})}
                  required
                />
              </div>

              <div className="mb-4">
                <label>Temperatura (°C):</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  onChange={(e) => setNewLote({...newLote, temperatura: e.target.value})}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowNewLoteModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#4A2C2A] text-white px-4 py-2 rounded"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button 
        onClick={() => setShowNewLoteModal(true)}
        className="fixed bottom-8 right-8 bg-[#4A2C2A] text-white p-4 rounded-full shadow-lg hover:bg-[#3a231f] transition-all z-40"
      >
        + Nuevo Lote
      </button>

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
              onClick={() => {
                setIsLoggingOut(true);
                setTimeout(() => {
                  localStorage.clear();
                  navigate('/login');
                }, 500);
              }}
              className="rounded-lg bg-[#4A2C2A] px-4 py-2 text-white hover:bg-[#3a231f] transition-all duration-300"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Tabla de producción */}
        <div className="rounded-lg bg-white shadow overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-[#4A2C2A] text-white">
              <tr>
                <th className="p-3 text-left text-sm font-bold">Producción</th>
                <th className="p-3 text-left text-sm font-bold">ID de Lote</th>
                <th className="p-3 text-left text-sm font-bold">Fecha</th>
                <th className="p-3 text-center text-sm font-bold">Temperatura</th>
                <th className="p-3 text-center text-sm font-bold">Peso Inicial</th>
                <th className="p-3 text-center text-sm font-bold">Pérdida de Peso</th>
                <th className="p-3 text-center text-sm font-bold">Peso Final</th>
                <th className="p-3 text-center text-sm font-bold">ID de Grano</th>
                <th className="p-3 text-center text-sm font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lotesTostados.map((lote) => (
                <tr key={lote.id_lote_tostado} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm">Lote Tostado</td>
                  <td className="p-3 text-sm font-medium text-[#4A2C2A]">{lote.id_lote_tostado}</td>
                  <td className="p-3 text-sm">{new Date(lote.fecha).toLocaleDateString()}</td>
                  <td className="p-3 text-center text-sm">{lote.temperatura}°C</td>
                  <td className="p-3 text-center text-sm">{lote.peso_inicial_kg}kg</td>
                  <td className="p-3 text-center text-sm">{lote.perdida_peso}kg</td>
                  <td className="p-3 text-center text-sm">{lote.peso_final_kg}kg</td>
                  <td className="p-3 text-sm font-medium text-[#4A2C2A]">{lote.id_grano}</td>

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

        {/* Estadísticas */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-lg font-semibold text-[#4A2C2A]">Total Producido</h3>
            <p className="text-2xl font-bold mt-2">{totalKg.toFixed(2)} kg</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-lg font-semibold text-[#4A2C2A]">Pérdida Promedio</h3>
            <p className="text-2xl font-bold mt-2">{perdidaPromedio.toFixed(2)} kg</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-lg font-semibold text-[#4A2C2A]">Lotes Activos</h3>
            <p className="text-2xl font-bold mt-2">{lotesTostados.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Produccion;