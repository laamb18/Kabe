import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { adminAuthService, adminDashboardService } from '../../services/api';
import '../../styles/pages/AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  // Colores para las gráficas
  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4', '#CDDC39', '#795548'];

  useEffect(() => {
    const checkAuth = () => {
      if (!adminAuthService.isAuthenticated()) {
        navigate('/admin/login');
        return false;
      }
      
      const adminData = adminAuthService.getAdminData();
      setAdmin(adminData);
      return true;
    };

    const loadDashboardData = async () => {
      if (!checkAuth()) return;

      try {
        setLoading(true);
        const data = await adminDashboardService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError(err.message || 'Error al cargar datos del dashboard');
        if (err.message.includes('401')) {
          adminAuthService.logout();
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Dashboard - Panel de Administración</h1>
          <div className="admin-header-actions">
            <span className="admin-welcome">
              Bienvenido, {admin?.nombre} {admin?.apellido}
            </span>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Estadísticas Generales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">P</div>
          <div className="stat-content">
            <h3>Total Productos</h3>
            <p className="stat-number">{dashboardData?.stats_generales?.total_productos || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">P</div>
          <div className="stat-content">
            <h3>Total Paquetes</h3>
            <p className="stat-number">{dashboardData?.stats_generales?.total_paquetes || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">U</div>
          <div className="stat-content">
            <h3>Total Usuarios</h3>
            <p className="stat-number">{dashboardData?.stats_generales?.total_usuarios || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">O</div>
          <div className="stat-content">
            <h3>Total Pedidos</h3>
            <p className="stat-number">{dashboardData?.stats_generales?.total_pedidos || 0}</p>
          </div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="charts-grid">
        {/* Productos Más Pedidos */}
        <div className="chart-card">
          <h3>Productos Más Pedidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData?.productos_populares || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="nombre" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="veces_pedido" fill="#4CAF50" name="Veces Pedido" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Categorías Más Populares */}
        <div className="chart-card">
          <h3>Categorías Más Populares</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData?.categorias_populares || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total_pedidos"
              >
                {(dashboardData?.categorias_populares || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de Productos Populares */}
      <div className="table-card">
        <h3>Top 10 Productos Más Pedidos</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Veces Pedido</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {(dashboardData?.productos_populares || []).map((producto, index) => (
                <tr key={producto.producto_id}>
                  <td>
                    <div className="product-info">
                      <span className="rank">#{index + 1}</span>
                      {producto.nombre}
                    </div>
                  </td>
                  <td>{producto.categoria_nombre}</td>
                  <td>
                    <span className="pedidos-count">{producto.veces_pedido}</span>
                  </td>
                  <td>
                    <span className="status-badge active">Activo</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="actions-grid">
          <button 
            className="action-button products"
            onClick={() => navigate('/admin/productos')}
          >
            <span className="action-icon">P</span>
            <span>Gestionar Productos</span>
          </button>
          
          <button 
            className="action-button packages"
            onClick={() => navigate('/admin/paquetes')}
          >
            <span className="action-icon">P</span>
            <span>Gestionar Paquetes</span>
          </button>
          
          <button 
            className="action-button users"
            onClick={() => navigate('/admin/usuarios')}
          >
            <span className="action-icon">U</span>
            <span>Gestionar Usuarios</span>
          </button>
          
          <button 
            className="action-button reports"
            onClick={() => alert('Próximamente: Reportes detallados')}
          >
            <span className="action-icon">R</span>
            <span>Ver Reportes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;