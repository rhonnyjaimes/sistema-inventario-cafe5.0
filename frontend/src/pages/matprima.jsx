import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MateriaPrima = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const [showSection, setShowSection] = useState('granos');
  const [showEditModal, setShowEditModal] = useState(false);
  const [approvalPass, setApprovalPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showNewLoteModal, setShowNewLoteModal] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const [newLoteData, setNewLoteData] = useState({
    origen: '',
    cantidad_kg: '',
    fecha_despacho: '',
    fecha_caducidad: '',
    id_proveedor: '',
    lote_pagado: false,
    metodo_pago: 'Efectivo'
  });

  // Estados para los datos obtenidos de la API
  const [granos, setGranos] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  // Verificar autenticación del usuario
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!token || !storedUser) navigate('/login');
    else setUserData(storedUser);
  }, [navigate]);

  // Fetch de datos de la API
  const refreshData = () => {
    fetch('http://localhost:3001/api/granos')
      .then((response) => response.json())
      .then((data) => setGranos(data))
      .catch((err) => console.error('Error fetching granos:', err));

    fetch('http://localhost:3001/api/proveedores')
      .then((response) => response.json())
      .then((data) => setProveedores(data))
      .catch((err) => console.error('Error fetching proveedores:', err));
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

  const handleEditClick = (grano) => {
    setEditData(grano);
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

  const handleEditSubmit = () => {
    fetch(`http://localhost:3001/api/granos/${editData.id_grano}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editData)
    })
    .then(response => response.json())
    .then(data => {
      refreshData();
      setShowEditForm(false);
      setEditData(null);
    })
    .catch(err => {
      console.error('Error updating lote:', err);
      setError('Error al actualizar el lote');
    });
  };

  const handleNewLoteSubmit = () => {
    if (!newLoteData.origen || !newLoteData.cantidad_kg || !newLoteData.id_proveedor) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    fetch('http://localhost:3001/api/granos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLoteData)
    })
    .then(response => response.json())
    .then(data => {
      setShowNewLoteModal(false);
      setShowSuccessAnimation(true);
      refreshData();
      
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 2000);

      setNewLoteData({
        origen: '',
        cantidad_kg: '',
        fecha_despacho: '',
        fecha_caducidad: '',
        id_proveedor: '',
        lote_pagado: false,
        metodo_pago: 'Efectivo'
      });
      setError('');
    })
    .catch(err => {
      console.error('Error creating lote:', err);
      setError('Error al crear el lote');
    });
  };

  if (!userData) return <div className="p-4 text-gray-600">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#8FBC8F] font-sans">
      {/* Animación de éxito */}
      {showSuccessAnimation && (
        <div className="fixed top-4 right-4 animate-fade-in-out bg-green-500 text-white px-4 py-2 rounded-lg">
          ✔ Lote registrado exitosamente!
        </div>
      )}

      {/* Botón flotante para nuevo lote */}
      <button 
        onClick={() => setShowNewLoteModal(true)}
        className="fixed bottom-8 right-8 bg-[#4A2C2A] text-white p-4 rounded-full shadow-lg hover:bg-[#3a231f] transition-all"
      >
        + Nuevo Lote
      </button>

      {/* Modal de Aprobación Edición */}
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

      {/* Modal para edición */}
      {showEditForm && editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Editar Lote</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Origen</label>
                <input
                  type="text"
                  value={editData.origen}
                  onChange={(e) => setEditData({...editData, origen: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cantidad (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={editData.cantidad_kg}
                  onChange={(e) => setEditData({...editData, cantidad_kg: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Proveedor</label>
                <select
                  value={editData.id_proveedor}
                  onChange={(e) => setEditData({...editData, id_proveedor: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map(proveedor => (
                    <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                      {proveedor.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fecha Despacho</label>
                <input
                  type="date"
                  value={editData.fecha_despacho}
                  onChange={(e) => setEditData({...editData, fecha_despacho: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fecha Caducidad</label>
                <input
                  type="date"
                  value={editData.fecha_caducidad}
                  onChange={(e) => setEditData({...editData, fecha_caducidad: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editData.lote_pagado}
                  onChange={(e) => setEditData({...editData, lote_pagado: e.target.checked})}
                  className="h-4 w-4"
                />
                <label className="text-sm">Lote Pagado</label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Método de Pago</label>
                <select
                  value={editData.metodo_pago}
                  onChange={(e) => setEditData({...editData, metodo_pago: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

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

      {/* Modal para nuevo lote */}
      {showNewLoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Registrar Nuevo Lote</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Origen</label>
                <input
                  type="text"
                  value={newLoteData.origen}
                  onChange={(e) => setNewLoteData({...newLoteData, origen: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cantidad (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={newLoteData.cantidad_kg}
                  onChange={(e) => setNewLoteData({...newLoteData, cantidad_kg: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Proveedor</label>
                <select
                  value={newLoteData.id_proveedor}
                  onChange={(e) => setNewLoteData({...newLoteData, id_proveedor: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map(proveedor => (
                    <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                      {proveedor.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha de Despacho</label>
                <input
                  type="date"
                  value={newLoteData.fecha_despacho}
                  onChange={(e) => setNewLoteData({...newLoteData, fecha_despacho: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>


              <div>
                <label className="block text-sm font-medium mb-1">Fecha Caducidad</label>
                <input
                  type="date"
                  value={newLoteData.fecha_caducidad}
                  onChange={(e) => setNewLoteData({...newLoteData, fecha_caducidad: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newLoteData.lote_pagado}
                  onChange={(e) => setNewLoteData({...newLoteData, lote_pagado: e.target.checked})}
                  className="h-4 w-4"
                />
                <label className="text-sm">Lote Pagado</label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Método de Pago</label>
                <select
                  value={newLoteData.metodo_pago}
                  onChange={(e) => setNewLoteData({...newLoteData, metodo_pago: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowNewLoteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleNewLoteSubmit}
                  className="px-4 py-2 bg-[#4A2C2A] text-white rounded hover:bg-[#3a231f]"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              className="w-full rounded-lg p-3 text-left text-white hover:bg-[#8FBC8F]/20 hover:transition-colors duration-200"
            >
              {item.name}
            </button>
          ))}
        </nav>      
      </div>

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

        {/* Selector de Sección */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-[#4A2C2A]">MATERIA PRIMA</h1>
            <div className="flex gap-4">
              {['granos', 'proveedores'].map((section) => (
                <button
                  key={section}
                  onClick={() => setShowSection(section)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    showSection === section 
                      ? 'bg-[#4A2C2A] text-white' 
                      : 'bg-gray-100 text-[#4A2C2A] hover:bg-gray-200'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla de Granos */}
        {showSection === 'granos' && (
        <div className="rounded-lg bg-white p-4 shadow mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#4A2C2A] text-white">
                <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Origen</th>
                    <th className="p-3">Cantidad (kg)</th>
                    <th className="p-3">Proveedor</th>
                    <th className="p-3">Pagado</th>
                    <th className="p-3">Método Pago</th>
                    <th className="p-3">Fecha Despacho</th>
                    <th className="p-3">Fecha Caducidad</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {granos.map((grano) => (
                    <tr key={grano.id_grano} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-center">{grano.id_grano}</td>
                      <td className="p-3">{grano.origen}</td>
                      <td className="p-3 text-center">{grano.cantidad_kg}</td>
                      <td className="p-3">
                        {proveedores.find(p => p.id_proveedor === grano.id_proveedor)?.nombre}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          grano.lote_pagado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {grano.lote_pagado ? 'Pagado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="p-3 text-center">{grano.metodo_pago}</td>
                      <td className="p-3 text-center">{new Date(grano.fecha_caducidad).toLocaleDateString()}</td>
                      <td className="p-3 text-center">{new Date(grano.fecha_despacho).toLocaleDateString()}</td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={handleEditClick}
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
          </div>
        )}

        {/* Tabla de Proveedores */}
        {showSection === 'proveedores' && (
          <div className="rounded-lg bg-white p-4 shadow mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#4A2C2A] text-white">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Teléfono 1</th>
                    <th className="p-3">Teléfono 2</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {proveedores.map((proveedor) => (
                    <tr key={proveedor.id_proveedor} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-center">{proveedor.id_proveedor}</td>
                      <td className="p-3">{proveedor.nombre}</td>
                      <td className="p-3">{proveedor.telefono1}</td>
                      <td className="p-3">{proveedor.telefono2}</td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={handleEditClick}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MateriaPrima;