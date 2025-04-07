import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const checkAuth = (navigate) => {
  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (!token || !storedUser) {
    navigate('/login');
    return false;
  }
  return true;
};

const ProductosTerminados = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const [productosTerminados, setProductosTerminados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [formData, setFormData] = useState({
    id_lote_molido: '',
    presentacion: '0.25',
    cantidad_paquetes: 1
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const [productosRes, lotesRes] = await Promise.all([
          fetch('http://localhost:3001/api/productosterminados', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:3001/api/lotesmolidos', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!productosRes.ok || !lotesRes.ok) throw new Error('Error fetching data');
        
        const productosData = await productosRes.json();
        const lotesData = await lotesRes.json();

        setProductosTerminados(productosData);
        setLotes(lotesData.filter(l => l.cantidad_procesada_kg > 0));
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    if (!checkAuth(navigate)) return;
    
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUserData(storedUser);
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.clear();
      navigate('/login');
    }, 500);
  };

  const openEditModal = (producto) => {
    setFormData({
      id_lote_molido: producto.id_lote_molido,
      presentacion: producto.presentacion,
      cantidad_paquetes: producto.cantidad_paquetes
    });
    setSelectedProductId(producto.id_producto);
    setShowFormModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const method = selectedProductId ? 'PUT' : 'POST';
      const url = selectedProductId 
        ? `http://localhost:3001/api/productosterminados/${selectedProductId}`
        : 'http://localhost:3001/api/productosterminados';

      const body = {
        ...formData,
        id_lote_molido: Number(formData.id_lote_molido), // Convertir a número
        cantidad_paquetes: Number(formData.cantidad_paquetes),
        presentacion: formData.presentacion.toString()
      };

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error guardando datos');
      }

      // Actualizar lista
      const updatedData = await fetch('http://localhost:3001/api/productosterminados', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json());
      
      setProductosTerminados(updatedData);
      setSuccess('Operación exitosa');
      setTimeout(() => setShowFormModal(false), 1500);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  const calcularMaxPaquetes = () => {
    const lote = lotes.find(l => l.id_lote_molido == formData.id_lote_molido);
    return lote ? Math.floor(lote.cantidad_procesada_kg / formData.presentacion) : 0;
  };

  const formatPresentacion = (presentacion) => ({
    '0.25': '250g',
    '0.5': '500g',
    '1': '1kg'
  }[presentacion] || presentacion);

  const formatFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES');
    } catch {
      return '--/--/----';
    }
  };

  if (!userData) return <div className="p-4 text-center">Cargando...</div>;

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
            { name: 'Gestión de Usuarios', path: '/usuarios' }
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
          <h1 className="text-2xl font-bold text-[#4A2C2A]">INVENTARIO PRODUCTOS TERMINADOS</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-[#4A2C2A]">{userData.nombre}</p>
              <p className="text-sm text-gray-600">{userData.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-[#4A2C2A] px-4 py-2 text-white hover:bg-[#3a231f] duration-300"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="fixed bottom-4 right-4 z-10">
            <button 
              onClick={() => {
                setFormData({ id_lote_molido: '', presentacion: '0.25', cantidad_paquetes: 1 });
                setSelectedProductId(null);
                setShowFormModal(true);
              }}
              className="bg-[#4A2C2A] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#3a231f] duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Nuevo Producto
            </button>
          </div>

          <div className="rounded-lg bg-white shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#4A2C2A] text-white">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Presentación</th>
                  <th className="p-3 text-left">Lote Molido</th>
                  <th className="p-3 text-center">Paquetes</th>
                  <th className="p-3 text-center">Stock Total</th>
                  <th className="p-3 text-left">Caducidad</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A2C2A] mx-auto"></div>
                    </td>
                  </tr>
                ) : productosTerminados.length === 0 ? (
                  <tr><td colSpan="6" className="p-4 text-center">No hay productos registrados</td></tr>
                ) : (productosTerminados.map(item => (
                  <tr key={item.id_producto} className="border-b hover:bg-gray-50">
                     <td className="p-3">{item.id_producto}</td>
                    <td className="p-3">{formatPresentacion(item.presentacion)}</td>
                    <td className="p-3">Lote #{item.id_lote_molido}</td>
                    <td className="p-3 text-center">{item.cantidad_paquetes}</td>
                    <td className="p-3 text-center">{(item.cantidad_paquetes * item.presentacion).toFixed(2)} kg</td>
                    <td className="p-3">{formatFecha(item.fecha_vencimiento)}</td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => openEditModal(item)}
                        className="text-[#4A2C2A] hover:text-[#3a231f] px-2 py-1 rounded hover:bg-gray-100"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        {showFormModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-[#4A2C2A]">
                {selectedProductId ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>

              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
              {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Lote Molido</label>
                  <select
                    value={formData.id_lote_molido}
                    onChange={e => setFormData({...formData, id_lote_molido: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#4A2C2A]"
                    required
                  >
                    <option value="">Seleccionar lote</option>
                    {lotes.map(lote => (
                      <option key={lote.id_lote_molido} value={lote.id_lote_molido}>
                        Lote #{lote.id_lote_molido} - {lote.cantidad_procesada_kg}kg
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Presentación</label>
                  <select
                    value={formData.presentacion}
                    onChange={e => setFormData({...formData, presentacion: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#4A2C2A]"
                    required
                  >
                    <option value="0.25">250 gramos</option>
                    <option value="0.5">500 gramos</option>
                    <option value="1">1 kilogramo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cantidad de Paquetes
                    {formData.id_lote_molido && (
                      <span className="text-sm text-gray-600 ml-2">
                        (Máximo: {calcularMaxPaquetes()})
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    max={calcularMaxPaquetes()}
                    value={formData.cantidad_paquetes}
                    onChange={e => setFormData({...formData, cantidad_paquetes: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#4A2C2A]"
                    required
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="flex-1 py-2 px-4 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-[#4A2C2A] text-white rounded hover:bg-[#3a231f]"
                  >
                    {selectedProductId ? 'Actualizar' : 'Crear'} Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductosTerminados;