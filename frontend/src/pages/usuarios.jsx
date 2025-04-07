import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Usuarios = () => {
  // Estados
  const [userData, setUserData] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: 'usuario',
    contrasena: ''
  });
  const [createFormData, setCreateFormData] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    rol: 'operario'
  });

  // Hooks de navegación
  const navigate = useNavigate();
  const location = useLocation();

  // Efecto para autenticación y carga inicial
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !storedUser) {
      navigate('/login');
    } else {
      setUserData(storedUser);
      cargarUsuarios();
    }
  }, [navigate]);

  // Cargar usuarios desde la API
  const cargarUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Error al cargar usuarios');
      
      const data = await response.json();
      setUsuarios(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Mostrar mensaje de éxito con animación
  const showSuccessAnimation = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Manejar logout
  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.clear();
      navigate('/login');
    }, 500);
  };

  // Editar usuario
  const handleEdit = (usuario) => {
    setSelectedUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      contrasena: ''
    });
    setShowEditModal(true);
  };

  // Eliminar usuario
  const handleDelete = (usuario) => {
    setSelectedUser(usuario);
    setShowDeleteModal(true);
  };

  // Actualizar usuario
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const datosActualizados = {
        nombre: formData.nombre,
        email: formData.email,
        rol: formData.rol,
        ...(formData.contrasena && { contrasena: formData.contrasena })
      };

      const response = await fetch(`http://localhost:3001/api/usuarios/${selectedUser.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosActualizados)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al actualizar usuario');
      }

      await cargarUsuarios();
      setShowEditModal(false);
      showSuccessAnimation('Usuario actualizado correctamente');
      setError('');
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  // Crear nuevo usuario
  const handleCreateChange = (e) => {
    setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createFormData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        let errorMsg = 'Error al crear usuario';
        if (data.tipo === 'email_invalido') errorMsg = 'Formato de email inválido';
        if (data.tipo === 'usuario_existente') errorMsg = 'El correo ya está registrado';
        if (data.tipo === 'contrasena_debil') errorMsg = 'La contraseña debe tener al menos 8 caracteres';
        throw new Error(errorMsg);
      }

      await cargarUsuarios();
      setShowCreateModal(false);
      showSuccessAnimation('Usuario creado exitosamente');
      setCreateFormData({
        nombre: '',
        email: '',
        contrasena: '',
        rol: 'operario'
      });
      
    } catch (error) {
      setError(error.message);
    }
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    try {
      if (selectedUser.rol === 'gerente') {
        setError('No se puede eliminar usuarios gerente');
        setShowDeleteModal(false);
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/usuarios/${selectedUser.id_usuario}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al eliminar usuario');
      
      await cargarUsuarios();
      setShowDeleteModal(false);
      showSuccessAnimation('Usuario eliminado correctamente');
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="p-4 text-gray-600">Cargando usuarios...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-[#8FBC8F] font-sans">
      {/* Notificación de éxito */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
            </svg>
            <span>{successMessage}</span>
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

      {/* Contenido principal */}
      <div className={`ml-64 p-6 ${isLoggingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-4 shadow">
          <h1 className="text-2xl font-bold text-[#4A2C2A]">Gestión de Usuarios</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-[#4A2C2A]">{userData?.nombre}</p>
              <p className="text-sm text-gray-600">{userData?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-[#4A2C2A] px-4 py-2 text-white hover:bg-[#3a231f] transition-all duration-300"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-lg bg-[#4A2C2A] px-4 py-2 text-white hover:bg-[#3a231f] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Nuevo Usuario
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-[#8FBC8F]">
                  <th className="px-4 py-3 text-left text-[#4A2C2A]">Nombre</th>
                  <th className="px-4 py-3 text-left text-[#4A2C2A]">Email</th>
                  <th className="px-4 py-3 text-left text-[#4A2C2A]">Rol</th>
                  <th className="px-4 py-3 text-left text-[#4A2C2A]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{usuario.nombre}</td>
                    <td className="px-4 py-3">{usuario.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-sm capitalize ${
                        usuario.rol === 'gerente' 
                          ? 'bg-[#4A2C2A] text-white' 
                          : 'bg-[#8FBC8F]/30 text-[#4A2C2A]'
                      }`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="rounded bg-[#4A2C2A]/10 px-3 py-1 text-[#4A2C2A] hover:bg-[#4A2C2A]/20"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(usuario)}
                          className="rounded bg-red-100 px-3 py-1 text-red-600 hover:bg-red-200"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Edición */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold mb-4 text-[#4A2C2A]">Editar Usuario</h3>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              <form onSubmit={handleUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#4A2C2A]">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full rounded border border-[#8FBC8F] p-2 focus:ring-2 focus:ring-[#4A2C2A]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#4A2C2A]">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full rounded border border-[#8FBC8F] p-2 focus:ring-2 focus:ring-[#4A2C2A]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#4A2C2A]">
                      Rol
                    </label>
                    <select
                      value={formData.rol}
                      onChange={(e) => setFormData({...formData, rol: e.target.value})}
                      className="w-full rounded border border-[#8FBC8F] p-2 focus:ring-2 focus:ring-[#4A2C2A] bg-white"
                    >
                      <option value="supervisor">Supervisor</option>
                      <option value="operario">Operario</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#4A2C2A]">
                      Nueva Contraseña (opcional)
                    </label>
                    <input
                      type="password"
                      value={formData.contrasena}
                      onChange={(e) => setFormData({...formData, contrasena: e.target.value})}
                      className="w-full rounded border border-[#8FBC8F] p-2 focus:ring-2 focus:ring-[#4A2C2A]"
                      placeholder="Dejar vacío para mantener la actual"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setError('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4A2C2A] text-white rounded-lg hover:bg-[#3a231f] transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Creación */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="mx-4 w-full max-w-md animate-scale-in rounded-lg bg-white p-6">
              <h3 className="mb-6 text-2xl font-bold text-[#4A2C2A]">Nuevo Usuario</h3>
              
              {error && (
                <div className="mb-4 animate-shake rounded-lg bg-red-100 p-3 text-red-700">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#4A2C2A]">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={createFormData.nombre}
                    onChange={handleCreateChange}
                    className="w-full rounded-lg border border-[#8FBC8F]/20 px-4 py-2 focus:border-[#4A2C2A] focus:ring-2 focus:ring-[#4A2C2A]/50"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[#4A2C2A]">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={createFormData.email}
                    onChange={handleCreateChange}
                    className="w-full rounded-lg border border-[#8FBC8F]/20 px-4 py-2 focus:border-[#4A2C2A] focus:ring-2 focus:ring-[#4A2C2A]/50"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[#4A2C2A]">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="contrasena"
                    value={createFormData.contrasena}
                    onChange={handleCreateChange}
                    className="w-full rounded-lg border border-[#8FBC8F]/20 px-4 py-2 focus:border-[#4A2C2A] focus:ring-2 focus:ring-[#4A2C2A]/50"
                    minLength="8"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[#4A2C2A]">
                    Rol
                  </label>
                  <select
                    name="rol"
                    value={createFormData.rol}
                    onChange={handleCreateChange}
                    className="w-full rounded-lg border border-[#8FBC8F]/20 px-4 py-2 focus:ring-2 focus:ring-[#4A2C2A]/50"
                    required
                  >
                    <option value="operario">Operario</option>
                    <option value="supervisor">Supervisor</option>
                  </select>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setError('');
                    }}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-[#4A2C2A] px-4 py-2 text-white hover:bg-[#3a231f]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Crear Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Eliminación */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md animate-fade-in-up">
              <h3 className="text-lg font-bold mb-4">Confirmar Eliminación</h3>
              
              {selectedUser?.rol === 'gerente' ? (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3 text-red-700">
                    <svg 
                      className="w-5 h-5 flex-shrink-0" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                      />
                    </svg>
                    <p>Los usuarios con rol Gerente no pueden ser eliminados del sistema</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-6">¿Estás seguro de eliminar al usuario {selectedUser?.nombre}?</p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 text-gray-500 hover:text-gray-700"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Usuarios;