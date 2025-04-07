import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [stockData, setStockData] = useState({
    granos: 0,
    tostado: 0,
    molido: 0,
    alertas: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !storedUser) navigate('/login');
    else setUserData(storedUser);
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const [granosRes, tostadoRes, molidoRes] = await Promise.all([
          fetch('http://localhost:3001/api/granos', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:3001/api/lotestostados', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:3001/api/lotesmolidos', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!granosRes.ok) throw new Error('Error en granos');
        if (!tostadoRes.ok) throw new Error('Error en tostado');
        if (!molidoRes.ok) throw new Error('Error en molido');

        const granosData = await granosRes.json();
        const tostadoData = await tostadoRes.json();
        const molidoData = await molidoRes.json();

        const totalGranos = granosData.reduce((acc, item) => acc + parseFloat(item.cantidad_kg), 0);
        const totalTostado = tostadoData.reduce((acc, item) => acc + parseFloat(item.cantidad_disponible_kg), 0);
        const totalMolido = molidoData.reduce((acc, item) => acc + parseFloat(item.cantidad_procesada_kg), 0);

        const nuevasAlertas = [];
        
        // Lógica de alertas para Granos
        if (totalGranos <= 20) {
          nuevasAlertas.push({
            tipo: 'critico',
            mensaje: `Stock CRÍTICO en granos: ${totalGranos.toFixed(2)}kg`
          });
        } else if (totalGranos <= 50) {
          nuevasAlertas.push({
            tipo: 'advertencia',
            mensaje: `Stock bajo en granos: ${totalGranos.toFixed(2)}kg`
          });
        }

        // Lógica de alertas para Tostado
        if (totalTostado <= 20) {
          nuevasAlertas.push({
            tipo: 'critico',
            mensaje: `Stock CRÍTICO en tostado: ${totalTostado.toFixed(2)}kg`
          });
        } else if (totalTostado <= 40) {
          nuevasAlertas.push({
            tipo: 'advertencia',
            mensaje: `Stock bajo en tostado: ${totalTostado.toFixed(2)}kg`
          });
        }

        // Lógica de alertas para Molido
        if (totalMolido <= 20) {
          nuevasAlertas.push({
            tipo: 'critico',
            mensaje: `Stock CRÍTICO en molido: ${totalMolido.toFixed(2)}kg`
          });
        } else if (totalMolido <= 40) {
          nuevasAlertas.push({
            tipo: 'advertencia',
            mensaje: `Stock bajo en molido: ${totalMolido.toFixed(2)}kg`
          });
        }

        setStockData({
          granos: totalGranos,
          tostado: totalTostado,
          molido: totalMolido,
          alertas: nuevasAlertas
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (userData) fetchData();
  }, [userData]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.clear();
      navigate('/login');
    }, 500);
  };

  const getStockColor = (value, type) => {
    const thresholds = {
      granos: { red: 20, yellow: 50 },
      tostado: { red: 20, yellow: 40 },
      molido: { red: 20, yellow: 40 }
    };
  
    if (value <= thresholds[type].red) return 'bg-[#fcc]/100 border-l-4 border-[#fcc]/70';
    if (value <= thresholds[type].yellow) return 'bg-[#fff7cc]/100 border-l-4 border-[#fff7cc]/70';
    return 'bg-white border-l-4 border-[#ffffff]/70';
  };

  // Cálculo de porcentajes
  const totalStock = stockData.granos + stockData.tostado + stockData.molido;
  const chartData = [
    { 
      producto: 'Granos', 
      stock: stockData.granos,
      porcentaje: totalStock > 0 ? (stockData.granos / totalStock * 100).toFixed(0) : 0,
      color: '#4A2C2A'
    },
    { 
      producto: 'Tostado', 
      stock: stockData.tostado,
      porcentaje: totalStock > 0 ? (stockData.tostado / totalStock * 100).toFixed(0) : 0,
      color: '#4A2C2A'
    },
    { 
      producto: 'Molido', 
      stock: stockData.molido,
      porcentaje: totalStock > 0 ? (stockData.molido / totalStock * 100).toFixed(0) : 0,
      color: '#4A2C2A'
    }
  ];

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

        {userData.rol === 'gerente' ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Tarjetas de Stock */}
            <div className={`rounded-lg p-4 shadow ${getStockColor(stockData.granos, 'granos')}`}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-[#4A2C2A]">Materia Prima</h3>
                <p className="text-2xl font-bold text-[#4A2C2A]">
                  {stockData.granos.toFixed(2)}kg
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-1">Granos en stock</p>
            </div>

            <div className={`rounded-lg p-4 shadow ${getStockColor(stockData.tostado, 'tostado')}`}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-[#4A2C2A]">Lotes Tostados</h3>
                <p className="text-2xl font-bold text-[#4A2C2A]">
                  {stockData.tostado.toFixed(2)}kg
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-1">Tostado disponible</p>
            </div>

            <div className={`rounded-lg p-4 shadow ${getStockColor(stockData.molido, 'molido')}`}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-[#4A2C2A]">Lotes Molidos</h3>
                <p className="text-2xl font-bold text-[#4A2C2A]">
                  {stockData.molido.toFixed(2)}kg
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-1">Molido disponible</p>
            </div>

            {/* Sección de Alertas */}
            <div className="col-span-full rounded-lg bg-white p-4 shadow">
              <h3 className="text-lg font-semibold text-[#4A2C2A] mb-3">Alertas Activas</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {stockData.alertas.map((alerta, index) => (
                  <div 
                    key={index}
                    className={`rounded-lg p-3 ${
                      alerta.tipo === 'critico' 
                        ? 'bg-red-100 border-l-4 border-red-500' 
                        : 'bg-yellow-100 border-l-4 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        alerta.tipo === 'critico' ? 'text-red-800' : 'text-yellow-800'
                      }`}>
                        {alerta.tipo === 'critico' ? '⚠️ Crítico' : '⚠️ Advertencia'}
                      </span>
                    </div>
                    <p className="text-sm mt-1 text-gray-700">{alerta.mensaje}</p>
                  </div>
                ))}
                
                {stockData.alertas.length === 0 && (
                  <div className="col-span-full rounded-lg bg-green-100 p-3 border-l-4 border-green-500">
                    <p className="text-sm text-green-800">No hay alertas activas</p>
                  </div>
                )}
              </div>
            </div>

            {/* Gráfico y Porcentajes */}
            <div className="col-span-full rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-bold text-[#4A2C2A]">Distribución de Stock</h3>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="h-64 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#4A2C2A20" />
                      <XAxis 
                        dataKey="producto" 
                        tick={{ fill: '#4A2C2A' }}
                      />
                      <YAxis 
                        tick={{ fill: '#4A2C2A' }}
                        label={{
                          value: 'Kg',
                          angle: -90,
                          position: 'insideLeft',
                          fill: '#4A2C2A'
                        }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#4A2C2A',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                        formatter={(value) => [`${value.toFixed(2)} kg`, 'Stock']}
                      />
                      <Bar 
                        dataKey="stock" 
                        fill="#4A2C2A"
                        radius={[4, 4, 0, 0]}
                        animationDuration={500}
                      >
                        <LabelList 
                          dataKey="producto" 
                          position="insideTop"
                          fill="#FFFFFF"
                          fontSize={12}
                          offset={10}
                        />
                        <LabelList 
                          dataKey="stock" 
                          position="insideBottom"
                          fill="#FFFFFF"
                          fontSize={12}
                          formatter={(value) => `${value.toFixed(0)}kg`}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex-1 space-y-4">
                  {chartData.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-[#4A2C2A]/10 rounded-lg hover:bg-[#4A2C2A]/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#4A2C2A]" />
                        <span className="font-medium text-[#4A2C2A]">{item.producto}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#4A2C2A]">{item.porcentaje}%</p>
                        <p className="text-sm text-[#4A2C2A]/70">{item.stock.toFixed(2)} kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-center text-2xl font-bold text-[#4A2C2A]">Bienvenido al Inventario</h2>
            <p className="text-center mt-2 text-gray-600">Su rol de {userData.rol} no tiene acceso al dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;