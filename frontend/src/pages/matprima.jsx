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

  const [showNuevoProveedor, setShowNuevoProveedor] = useState(false);

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


  const [NuevoProveedor, setNuevoProveedor] = useState({
    nombre_empresa: '',
    documento: '',
    correo: '',
    telefono: '',
    ubicacion: ''
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

  const handleNewProveedorSubmit = () => {
    console.log("Datos a enviar:", NuevoProveedor); // 👀 Verifica si los datos están correctos antes de enviarlos
  
    // Si ya has validado los datos y todo está correcto, haz la solicitud para guardar el proveedor
    fetch('http://localhost:3001/api/proveedores', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(NuevoProveedor),  // Envia los datos al servidor
    })
    .then((response) => {
      console.log("Respuesta del servidor:", response); // Imprime la respuesta completa para verificar
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json(); // Parsear la respuesta a JSON
    })
    .then((data) => {
      console.log("Respuesta JSON:", data); // Imprime la respuesta en formato JSON
  
      // Verificar si el servidor devuelve un campo `id_proveedor` como indicativo de éxito
      if (data && data.id_proveedor) {
        // Si la respuesta es exitosa, puedes resetear el formulario y cerrar el modal
        setNuevoProveedor({
          nombre_empresa: '',
          documento: '',
          correo: '',
          telefono: '',
          ubicacion: ''
        });
        setShowNuevoProveedor(false);
      } else {
        console.error("Error del servidor:", data); // Imprime el error detallado
        setError("Hubo un error al guardar el proveedor.");
      }
    })
    .catch((error) => {
      console.error("Error al guardar el proveedor:", error);
      setError("Ocurrió un error al intentar guardar el proveedor.");
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


      <div className="fixed bottom-8 right-8 flex gap-4">
        {/* Botón flotante para nuevo lote */}
        <button 
          onClick={() => setShowNewLoteModal(true)}
          className="bg-[#4A2C2A] text-white p-4 rounded-full shadow-lg hover:bg-[#3a231f] transition-all"
        >
          + Nuevo Lote
        </button>

        {/* Botón flotante para nuevo proveedor */}
        <button 
          onClick={() => setShowNuevoProveedor(true)}
          className="bg-[#4A2C2A] text-white p-4 rounded-full shadow-lg hover:bg-[#3a231f] transition-all"
        >
          + Nuevo Proveedor
        </button>
      </div>

      {/* Modal de Aprobación Edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"   data-testid="approval-modal-overlay">
          <div className="bg-white rounded-lg p-6 w-full max-w-md" data-testid="approval-modal">
            <h3 className="text-lg font-bold mb-4">Aprobación Requerida</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Contraseña de Supervisor
                <div className="relative">
                  <input
                    data-testid="password-input"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"   data-testid="edit-form-modal-overlay">
          <div className="bg-white rounded-lg p-6 w-full max-w-md"   data-testid="edit-form-modal">
            <h3 className="text-lg font-bold mb-4">Editar Lote</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Origen</label>
                <input
                  data-testid="origen-input"
                  type="text"
                  value={editData.origen}
                  onChange={(e) => setEditData({...editData, origen: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cantidad (kg)</label>
                <input
                  data-testid="origen-input"
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
                value={newLoteData.id_proveedor}
                onChange={(e) => setNewLoteData({...newLoteData, id_proveedor: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map(proveedor => (
                  <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                    {proveedor.nombre_empresa} {/* Cambiado de 'nombre' a 'nombre_empresa' */}
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
                  {proveedor.nombre_empresa} {/* Cambiado de 'nombre' a 'nombre_empresa' */}
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
                  <option value="Pago Pendiente">Pago Pendiente</option>
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
      
{/* Modal para nuevo proveedor */} 
{showNuevoProveedor && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 className="text-lg font-bold mb-4">Registrar Nuevo Proveedor</h3>
      <div className="space-y-4">

        {/* Nombre de la Empresa */}
        <div>
          <label className="block text-sm font-medium mb-1">Nombre de la Empresa</label>
          <input
            type="text"
            value={NuevoProveedor.nombre_empresa}
            onChange={(e) => setNuevoProveedor({...NuevoProveedor, nombre_empresa: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* RIF/CI (ahora llamado "documento") */}
        <div>
          <label className="block text-sm font-medium mb-1">RIF/CI</label>
          <div className="flex gap-2">
            <select
              value={NuevoProveedor.tipo_documento}
              onChange={(e) => setNuevoProveedor({
                ...NuevoProveedor,
                tipo_documento: e.target.value,
                documento: e.target.value + "-" + NuevoProveedor.documento.substring(1), // Inserta el guion entre tipo y número
              })}
              className="p-2 border rounded"
            >
              <option value="V">V</option>
              <option value="J">J</option>
              <option value="K">K</option> {/* Agregado K */}
            </select>
            <input
              type="text"
              value={NuevoProveedor.documento.substring(2)} // Extrae solo los números después del tipo y el guion
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Solo permite números
                setNuevoProveedor({
                  ...NuevoProveedor,
                  documento: NuevoProveedor.tipo_documento + "-" + value, // Guarda el tipo, el guion y el número juntos
                });
              }}
              className="flex-1 p-2 border rounded"
              placeholder="Ej: 12345678"
              maxLength={8} // Máximo de 8 dígitos (después del tipo de documento)
            />
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-medium mb-1">Ubicación</label>
          <input
            type="text"
            value={NuevoProveedor.ubicacion}
            onChange={(e) => setNuevoProveedor({...NuevoProveedor, ubicacion: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Número de Teléfono (con prefijo seleccionado) */}
        <div>
          <label className="block text-sm font-medium mb-1">Número de Teléfono</label>
          <div className="flex gap-2">
            <select
              value={NuevoProveedor.telefono.substring(0, 4)} // Extrae el prefijo del teléfono
              onChange={(e) => {
                setNuevoProveedor({
                  ...NuevoProveedor,
                  telefono: e.target.value + NuevoProveedor.telefono.substring(4), // Mantiene el resto del número
                });
              }}
              className="p-2 border rounded"
            >
              <option value="0412">0412</option>
              <option value="0424">0424</option>
              <option value="0414">0414</option>
              <option value="0426">0426</option>
              <option value="0416">0416</option>
            </select>
            <input
              type="text"
              maxLength={7} // Limita a 7 caracteres
              value={NuevoProveedor.telefono.substring(4)} // Extrae solo los últimos 7 dígitos
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Solo permite números
                setNuevoProveedor({
                  ...NuevoProveedor,
                  telefono: NuevoProveedor.telefono.substring(0, 4) + value, // Une prefijo y número
                });
              }}
              className="flex-1 p-2 border rounded"
              placeholder="Ej: 1234567"
            />
          </div>
          {/* Validación de longitud del número */}
          {NuevoProveedor.telefono.length > 0 && NuevoProveedor.telefono.length < 11 && (
            <p className="text-red-500 text-sm mt-1">Debe completar los 7 dígitos restantes</p>
          )}
        </div>

        {/* Correo Electrónico */}
        <div>
          <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
          <input
            type="email"
            value={NuevoProveedor.correo}
            onChange={(e) => setNuevoProveedor({...NuevoProveedor, correo: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="ejemplo@correo.com"
          />
        </div>

        {/* Mensaje de error si los campos están vacíos */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => {
              // Al cancelar, resetear el estado del formulario
              setNuevoProveedor({
                nombre_empresa: '',
                tipo_documento: 'V',
                documento: '',
                ubicacion: '',
                telefono: '0412', // Se inicia con un prefijo predeterminado
                correo: ''
              });
              setShowNuevoProveedor(false);
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              // Validar si todos los campos están completos
              if (
                !NuevoProveedor.nombre_empresa ||
                !NuevoProveedor.tipo_documento ||
                !NuevoProveedor.documento ||
                !NuevoProveedor.ubicacion ||
                !NuevoProveedor.telefono ||
                !NuevoProveedor.correo
              ) {
                setError("Todos los campos son obligatorios.");
                return;
              }

              // Validar si el número de teléfono tiene 11 dígitos
              if (NuevoProveedor.telefono.length !== 11) {
                setError("Introduzca un número de teléfono válido de 11 dígitos.");
                return;
              }

              setError(""); // Limpiar mensaje de error
              handleNewProveedorSubmit(); // Ejecuta la función de guardar
            }}
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
                      <td className="p-3 text-center">{grano.id_proveedor}</td>
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
                        data-testid="edit-button"
                        onClick={handleEditClick}
                        className="text-[#4A2C2A] hover:text-[#3a231f] font-medium">
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
                    <th className="p-3">Empresa</th>
                    <th className="p-3">Documento</th>
                    <th className="p-3">Teléfono</th>
                    <th className="p-3">Ubicación</th>
                    <th className="p-3">Correo</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {proveedores.map((proveedor) => (
                    <tr key={proveedor.id_proveedor} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-center">{proveedor.id_proveedor}</td>
                      <td className="p-3">{proveedor.nombre_empresa}</td>
                      <td className="p-3">{proveedor.documento}</td>
                      <td className="p-3">{proveedor.telefono}</td>
                      <td className="p-3">{proveedor.ubicacion}</td>
                      <td className="p-3">{proveedor.correo}</td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleEditClick(proveedor)}
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