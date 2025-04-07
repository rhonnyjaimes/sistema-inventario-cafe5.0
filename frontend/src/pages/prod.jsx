import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Produccion = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [approvalPass, setApprovalPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showNewLoteModal, setShowNewLoteModal] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const [lotesTostados, setLotesTostados] = useState([]);
  const [lotesMolidos, setLotesMolidos] = useState([]);
  const [granos, setGranos] = useState([]);
  const [tipoProduccion, setTipoProduccion] = useState('tostado');

  const [newLote, setNewLote] = useState({
    fecha: new Date().toISOString().split('T')[0],
    temperatura: '',
    peso_inicial_kg: '',
    peso_final_kg: '',
    cantidad_procesada: '',
    id_grano: '',
    tipo_molido: 'medio',
    tiempo_produccion: '00:00',
    id_lote_tostado: ''
  });

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!token || !storedUser) navigate('/login');
    else setUserData(storedUser);
  }, [navigate]);

  // Fetch de datos
  const refreshData = async () => {
    try {
      const [lotesTostadosRes, lotesMolidosRes, granosRes] = await Promise.all([
        fetch('http://localhost:3001/api/lotestostados'),
        fetch('http://localhost:3001/api/lotesmolidos'),
        fetch('http://localhost:3001/api/granos')
      ]);

      const lotesTostadosData = await lotesTostadosRes.json();
      const lotesMolidosData = await lotesMolidosRes.json();
      const granosData = await granosRes.json();

      setLotesTostados(lotesTostadosData.filter(l => l.cantidad_disponible_kg > 0));
      setLotesMolidos(lotesMolidosData);
      setGranos(granosData.filter(g => g.cantidad_kg > 0));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.clear();
      navigate('/login');
    }, 500);
  };

  const handleEditClick = (lote) => {
    setEditData(lote);
    setShowEditModal(true);
    setError('');
    setApprovalPass('');
  };

  const handleApprovalSubmit = () => {
    if (approvalPass === 'SUPERVISOR1234') {
      setShowEditModal(false);
      setShowEditForm(true);
    } else {
      setError('Contraseña de aprobación incorrecta');
    }
  };

  const handleEditSubmit = async () => {
    try {
      const endpoint = tipoProduccion === 'tostado' 
        ? `lotestostados/${editData.id_lote_tostado}`
        : `lotesmolidos/${editData.id_lote_molido}`;

      const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });

      if (!response.ok) throw new Error('Error al actualizar');
      
      refreshData();
      setShowEditForm(false);
      setEditData(null);
    } catch (err) {
      console.error('Error updating:', err);
      setError('Error al actualizar el lote');
    }
  };

  const handleCreateLote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const selectedGrano = granos.find(g => g.id_grano === parseInt(newLote.id_grano));
      const endpoint = tipoProduccion === 'tostado' ? 'lotestostados' : 'lotesmolidos';

      if (tipoProduccion === 'tostado' && selectedGrano.cantidad_kg < newLote.peso_inicial_kg) {
        alert('Stock insuficiente en el grano seleccionado');
        return;
      }

      if (tipoProduccion === 'tostado') {
        if (parseFloat(newLote.peso_final_kg) >= parseFloat(newLote.peso_inicial_kg)) {
          alert('El peso final debe ser menor al peso inicial');
          return;
        }
      }

    // Validación al estilo Materia Prima
    const requiredFields = tipoProduccion === 'tostado' 
      ? ['peso_inicial_kg', 'peso_final_kg', 'id_grano']
      : ['cantidad_procesada', 'id_lote_tostado', 'tipo_molido'];

    const missingFields = requiredFields.filter(field => !newLote[field]);
    if (missingFields.length > 0) {
      setError(`Faltan campos requeridos: ${missingFields.join(', ')}`);
      return;
    }

    // Convertir tiempo de producción al formato HH:mm:ss
    const [hours, minutes] = newLote.tiempo_produccion.split(':').map(Number);
    const tiempoProduccionFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

    const body = tipoProduccion === 'tostado' ? {
      fecha: newLote.fecha,
      temperatura: newLote.temperatura || null,
      peso_inicial_kg: newLote.peso_inicial_kg,
      peso_final_kg: newLote.peso_final_kg,
      id_grano: newLote.id_grano
    } : {
      fecha: newLote.fecha || new Date().toISOString().split('T')[0],
      tipo_molido: newLote.tipo_molido,
      cantidad_procesada_kg: parseFloat(newLote.cantidad_procesada),
      tiempo_produccion: tiempoProduccionFormatted, // Guardar en formato HH:mm:ss
      id_lote_tostado: parseInt(newLote.id_lote_tostado),
      id_grano: parseInt(newLote.id_grano)
    };

      const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error al crear lote tostado: ${error.message}`);
      }

    // Actualización al estilo Materia Prima
    setShowNewLoteModal(false);
    setShowSuccessAnimation(true);
    refreshData();  // ← Esto fuerza la actualización de datos
    
    setTimeout(() => setShowSuccessAnimation(false), 2000);
    
    // Reset del formulario como en Materia Prima
    setNewLote({
      fecha: new Date().toISOString().split('T')[0],
      temperatura: '',
      peso_inicial_kg: '',
      peso_final_kg: '',
      cantidad_procesada: '',
      id_grano: '',
      tipo_molido: 'medio',
      tiempo_produccion: '00:00',
      id_lote_tostado: ''
    });
    setError('');

    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message);
    }
  };

  const currentLotes = tipoProduccion === 'tostado' ? lotesTostados : lotesMolidos;
  
  const totalKg = currentLotes.reduce((acc, lote) => {
    return acc + parseFloat(
      tipoProduccion === 'tostado' 
        ? lote.peso_final_kg || 0 
        : lote.cantidad_procesada_kg || 0
    );
  }, 0);

  const perdidaPromedio = tipoProduccion === 'tostado' 
    ? (currentLotes.reduce((acc, lote) => acc + parseFloat(lote.perdida_peso || 0), 0) / currentLotes.length) || 0
    : 0;

  if (!userData) return <div className="p-4 text-gray-600">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#8FBC8F] font-sans">
      {showSuccessAnimation && (
        <div className="fixed top-4 right-4 animate-fade-in-out bg-green-500 text-white px-4 py-2 rounded-lg">
          ✔ Lote registrado exitosamente!
        </div>
      )}

      <div className="fixed bottom-8 right-8 flex gap-4">
        <button 
          onClick={() => setShowNewLoteModal(true)}
          className="bg-[#4A2C2A] text-white p-4 rounded-full shadow-lg hover:bg-[#3a231f] transition-all"
        >
          + Nuevo Lote
        </button>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Aprobación Requerida</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Contraseña de Supervisor
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={approvalPass}
                    onChange={(e) => setApprovalPass(e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-3 text-sm text-gray-600"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </label>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleApprovalSubmit}
                className="px-4 py-2 bg-[#4A2C2A] text-white rounded hover:bg-[#3a231f]"
              >
                Aprobar Edición
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditForm && editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Editar Lote {tipoProduccion}</h3>
            <div className="space-y-4">
              {tipoProduccion === 'tostado' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Peso Inicial (kg)</label>
                    <input
                      type="number"
                      value={editData.peso_inicial_kg}
                      onChange={(e) => setEditData({...editData, peso_inicial_kg: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Peso Final (kg)</label>
                    <input
                      type="number"
                      value={editData.peso_final_kg}
                      onChange={(e) => setEditData({...editData, peso_final_kg: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Temperatura (°C)</label>
                    <input
                      type="number"
                      value={editData.temperatura}
                      onChange={(e) => setEditData({...editData, temperatura: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Molido</label>
                    <select
                      value={editData.tipo_molido}
                      onChange={(e) => setEditData({...editData, tipo_molido: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="fino">Fino</option>
                      <option value="medio">Medio</option>
                      <option value="grueso">Grueso</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cantidad Procesada (kg)</label>
                    <input
                      type="number"
                      value={editData.cantidad_procesada_kg}
                      onChange={(e) => setEditData({...editData, cantidad_procesada_kg: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tiempo de Producción</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Horas"
                        min="0"
                        value={editData.tiempo_produccion.split(':')[0] || ''}
                        onChange={(e) => {
                          const horas = parseInt(e.target.value) || 0;
                          const [_, minutos] = editData.tiempo_produccion.split(':').map(Number);
                          setEditData({
                            ...editData,
                            tiempo_produccion: `${horas}:${minutos || '00'}`
                          });
                        }}
                        className="w-1/2 p-2 border rounded"
                      />
                      <input
                        type="number"
                        placeholder="Minutos"
                        min="0"
                        max="59"
                        value={editData.tiempo_produccion.split(':')[1] || ''}
                        onChange={(e) => {
                          const minutos = parseInt(e.target.value) || 0;
                          const [horas] = editData.tiempo_produccion.split(':').map(Number);
                          setEditData({
                            ...editData,
                            tiempo_produccion: `${horas || '0'}:${minutos}`
                          });
                        }}
                        className="w-1/2 p-2 border rounded"
                      />
                    </div>
                  </div>
                </>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-4 py-2 bg-[#4A2C2A] text-white rounded hover:bg-[#3a231f]"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewLoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nuevo Lote {tipoProduccion === 'tostado' ? 'Tostado' : 'Molido'}</h2>
            <form onSubmit={handleCreateLote}>
              {tipoProduccion === 'tostado' ? (
                <>
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
                    <label>Peso Final (kg):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newLote.peso_final_kg}
                      onChange={(e) => setNewLote({...newLote, peso_final_kg: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                      min="0.01"
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
                    <label>Lote Tostado:</label>
                    <select
                      className="w-full p-2 border rounded"
                      onChange={(e) => {
                        const lote = lotesTostados.find(
                          l => l.id_lote_tostado === parseInt(e.target.value)
                        );
                        setNewLote({
                          ...newLote,
                          id_lote_tostado: parseInt(e.target.value),
                          id_grano: lote?.id_grano || ''
                        });
                      }}
                      required
                    >
                      <option value="">Seleccionar lote tostado</option>
                      {lotesTostados.map(lote => (
                        <option key={lote.id_lote_tostado} value={lote.id_lote_tostado}>
                          Lote {lote.id_lote_tostado} - {lote.cantidad_disponible_kg}kg
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="block text-sm font-medium mb-1">
                    <label>Tiempo de Producción:</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Horas"
                        min="0"
                        onChange={(e) => {
                          const horas = parseInt(e.target.value) || 0;
                          const [_, minutos] = newLote.tiempo_produccion.split(':').map(Number);
                          setNewLote({
                            ...newLote,
                            tiempo_produccion: `${horas}:${minutos || '00'}`
                          });
                        }}
                        className="w-1/2 p-2 border rounded"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Minutos"
                        min="0"
                        max="59"
                        onChange={(e) => {
                          const minutos = parseInt(e.target.value) || 0;
                          const [horas] = newLote.tiempo_produccion.split(':').map(Number);
                          setNewLote({
                            ...newLote,
                            tiempo_produccion: `${horas || '0'}:${minutos}`
                          });
                        }}
                        className="w-1/2 p-2 border rounded"
                        required
                      />
                    </div>
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
            // Solo muestra esta opción si el usuario es gerente
            ...(userData?.rol === 'gerente' 
              ? [{ name: 'Gestion de Usuarios', path: '/usuarios' }] 
              : [])
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

      <div className={`ml-64 p-6 ${isLoggingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
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
                    <th className="p-3 text-center text-sm font-bold">ID de Grano</th>
                  </>
                ) : (
                  <>
                    <th className="p-3 text-center text-sm font-bold">Cantidad Procesada</th>
                    <th className="p-3 text-center text-sm font-bold">Tipo de Molido</th>
                    <th className="p-3 text-center text-sm font-bold">Tiempo de Producción</th>
                    <th className="p-3 text-center text-sm font-bold">ID de Tostado</th>
                  </>
                )}
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
                  <td className="p-3 text-sm">
                    {lote.fecha ? new Date(lote.fecha).toLocaleDateString() : 'Fecha no válida'}
                  </td>
                  
                  {tipoProduccion === 'tostado' ? (
                    <>
                      <td className="p-3 text-center text-sm">{lote.temperatura}°C</td>
                      <td className="p-3 text-center text-sm">{lote.peso_inicial_kg}kg</td>
                      <td className="p-3 text-center text-sm">{lote.perdida_peso}kg</td>
                      <td className="p-3 text-center text-sm">{lote.peso_final_kg}kg</td>
                      <td className="p-3 text-sm font-medium text-[#4A2C2A]">{lote.id_grano}</td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 text-center text-sm">{lote.cantidad_procesada_kg}kg</td>
                      <td className="p-3 text-center text-sm">{lote.tipo_molido}</td>
                      <td className="p-3 text-center text-sm">
                        {lote.tiempo_produccion
                          ? (() => {
                              const [hours, minutes, seconds] = lote.tiempo_produccion.split(':').map(Number);
                              return `${hours || 0}h ${minutes || 0}m`;
                            })()
                          : 'Tiempo no válido'}
                      </td>
                      <td className="p-3 text-center text-sm">{lote.id_lote_tostado}</td>
                    </>
                  )}
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => handleEditClick(lote)}
                      className="text-[#4A2C2A] hover:text-[#3a231f] font-medium"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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