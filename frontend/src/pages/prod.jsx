import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Produccion = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showNewLoteModal, setShowNewLoteModal] = useState(false);
  const [lotesTostados, setLotesTostados] = useState([]);
  const [lotesMolidos, setLotesMolidos] = useState([]);
  const [granos, setGranos] = useState([]);
  const [tipoProduccion, setTipoProduccion] = useState('tostado');


  const [newLote, setNewLote] = useState({
    fecha: '',
    temperatura: '',
    peso_inicial_kg: '',
    cantidad_procesada: '',
    id_grano: '',
    // Nuevos campos para molido
    tipo_molido: 'medio',
    tiempo_produccion: '00:00',
    id_lote_tostado: ''
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
      const [lotesTostadosRes, lotesMolidosRes, granosRes] = await Promise.all([
        fetch('http://localhost:3001/api/lotestostados', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/lotesmolidos', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/granos', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const lotesTostadosData = await lotesTostadosRes.json();
      const lotesMolidosData = await lotesMolidosRes.json();
      const granosData = await granosRes.json();

      setLotesTostados(lotesTostadosData);
      setLotesMolidos(lotesMolidosData);
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
      const endpoint = tipoProduccion === 'tostado' ? 'lotestostados' : 'lotesmolidos';

          // Validación de stock solo para tostado
      if (tipoProduccion === 'tostado' && selectedGrano.cantidad_kg < newLote.peso_inicial_kg) {
        alert('Stock insuficiente en el grano seleccionado');
        return;
      }

    // Crear cuerpo dinámico
    const body = tipoProduccion === 'tostado' ? {
      fecha: new Date().toISOString().split('T')[0], // Fecha actual
      temperatura: newLote.temperatura,
      peso_inicial_kg: newLote.peso_inicial_kg,
      id_grano: newLote.id_grano
    } : {
      fecha: new Date().toISOString().split('T')[0],
      tipo_molido: newLote.tipo_molido,
      cantidad_procesada_kg: newLote.cantidad_procesada, // Notar el _kg
      tiempo_produccion: newLote.tiempo_produccion,
      id_lote_tostado: newLote.id_lote_tostado,
      id_grano: newLote.id_grano
    };

    const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

      if (!response.ok) throw new Error('Error al crear lote');

      const createdLote = await response.json();
      
      if (tipoProduccion === 'tostado') {
        setLotesTostados([...lotesTostados, createdLote]);
      } else {
        setLotesMolidos([...lotesMolidos, createdLote]);
      }
      
      setShowNewLoteModal(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const currentLotes = tipoProduccion === 'tostado' ? lotesTostados : lotesMolidos;
  
// Total producido
const totalKg = currentLotes.reduce((acc, lote) => {
  return acc + parseFloat(
    tipoProduccion === 'tostado' 
      ? lote.peso_final_kg || 0 
      : lote.cantidad_procesada || 0
  );
}, 0);


const perdidaPromedio = tipoProduccion === 'tostado' 
  ? (currentLotes.reduce((acc, lote) => acc + parseFloat(lote.perdida_peso || 0), 0) / currentLotes.length) || 0
  : 0;

// Lotes activos
const lotesActivos = currentLotes.length;

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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nuevo Lote {tipoProduccion === 'tostado' ? 'Tostado' : 'Molido'}</h2>

            <form onSubmit={handleCreateLote}>
              <div className="block text-sm font-medium mb-1">
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
                          
              {tipoProduccion === 'tostado' ? (
                <>
                  <div className="block text-sm font-medium mb-1">
                    <label>Peso Inicial (kg):</label>
                    <input
                      type="number"
                      step="0.01"
                      onChange={(e) => setNewLote({...newLote, peso_inicial_kg: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="block text-sm font-medium mb-1">
                    <label>Temperatura (°C):</label>
                    <input
                      type="number"
                      onChange={(e) => setNewLote({...newLote, temperatura: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
              {/* Dentro del else del conditional rendering para Molido */}
              <div className="block text-sm font-medium mb-1">
                <label>Tipo de Molido:</label>
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => setNewLote({...newLote, tipo_molido: e.target.value})}
                  required
                >
                  <option value="fino">Fino</option>
                  <option value="medio">Medio</option>
                  <option value="grueso">Grueso</option>
                </select>
              </div>

              <div className="block text-sm font-medium mb-1">
                <label>ID Lote Tostado:</label>
                <input
                  type="number"
                  onChange={(e) => setNewLote({...newLote, id_lote_tostado: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="block text-sm font-medium mb-1">
                <label>Tiempo de Producción:</label>
                <input
                  type="time"
                  onChange={(e) => setNewLote({...newLote, tiempo_produccion: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
                <div className="block text-sm font-medium mb-1">
                  <label>Cantidad Procesada (kg):</label>
                  <input
                    type="number"
                    step="0.01"
                    onChange={(e) => setNewLote({...newLote, cantidad_procesada: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                </>
              )}

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
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-[#4A2C2A]">SISTEMA DE INVENTARIO</h1>
  
          </div>
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

        <div className="mb-4 flex gap-4">
              <button
                onClick={() => setTipoProduccion('tostado')}
                className={`px-4 py-2 rounded ${
                  tipoProduccion === 'tostado' ? 'bg-[#4A2C2A] text-white' : 'bg-gray-200'
                }`}
              >
                Tostado
              </button>
              <button
                onClick={() => setTipoProduccion('molido')}
                className={`px-4 py-2 rounded ${
                  tipoProduccion === 'molido' ? 'bg-[#4A2C2A] text-white' : 'bg-gray-200'
                }`}
              >
                Molido
              </button>
        </div>
                
        {/* Tabla de producción */}
        <div className="rounded-lg bg-white shadow overflow-hidden">
          <table className="w-full border-collapse">
          <thead className="bg-[#4A2C2A] text-white">
            <tr>
              <th className="p-3 text-left text-sm font-bold">Producción</th>
              <th className="p-3 text-left text-sm font-bold">ID de Lote</th>
              <th className="p-3 text-left text-sm font-bold">Fecha</th>
              {tipoProduccion === 'tostado' ? (
                <>
                <th className="p-3 text-center text-sm font-bold">Temperatura</th>
                <th className="p-3 text-center text-sm font-bold">Peso Inicial</th>
                <th className="p-3 text-center text-sm font-bold">Pérdida de Peso</th>
                <th className="p-3 text-center text-sm font-bold">Peso Final</th>
              </>
              ) : (
                <th className="p-3 text-center text-sm font-bold">Cantidad Procesada</th>
              )}
              <th className="p-3 text-center text-sm font-bold">ID de Grano</th>
              <th className="p-3 text-center text-sm font-bold">Acciones</th>
            </tr>
          </thead>

            <tbody>
              {currentLotes.map((lote) => (
                <tr 
                  key={tipoProduccion === 'tostado' ? lote.id_lote_tostado : lote.id_lote_molido} 
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3 text-sm">
                    {tipoProduccion === 'tostado' ? 'Lote Tostado' : 'Lote Molido'}
                  </td>
                  <td className="p-3 text-sm font-medium text-[#4A2C2A]">
                    {tipoProduccion === 'tostado' ? lote.id_lote_tostado : lote.id_lote_molido}
                  </td>
                  <td className="p-3 text-sm">{new Date(lote.fecha).toLocaleDateString()}</td>
                  
                  {tipoProduccion === 'tostado' ? (
                    <>
                      <td className="p-3 text-center text-sm">{lote.temperatura}°C</td>
                      <td className="p-3 text-center text-sm">{lote.peso_inicial_kg}kg</td>
                      <td className="p-3 text-center text-sm">{lote.perdida_peso}kg</td>
                      <td className="p-3 text-center text-sm">{lote.peso_final_kg}kg</td>
                    </>                  
                    ) : (

                      <td className="p-3 text-center text-sm">{lote.cantidad_procesada}kg</td>
                    )}
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
          
          {tipoProduccion === 'tostado' && (
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-lg font-semibold text-[#4A2C2A]">Pérdida Promedio</h3>
              <p className="text-2xl font-bold mt-2">{perdidaPromedio.toFixed(2)} kg</p>
            </div>
          )}
          
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-lg font-semibold text-[#4A2C2A]">
              {tipoProduccion === 'tostado' ? 'Lotes Activos' : 'Lotes Procesados'}
            </h3>
            <p className="text-2xl font-bold mt-2">{currentLotes.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Produccion;