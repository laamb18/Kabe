import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../styles/pages/UserPages.css';

const MisPedidos = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="user-page">
      <div className="user-page-container">
        <div className="page-header">
          <div className="header-icon">📦</div>
          <h1>Mis Pedidos</h1>
          <p>Historial y estado de tus pedidos de alquiler</p>
        </div>

        <div className="content-section">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No tienes pedidos aún</h3>
            <p>Cuando realices tu primer pedido de alquiler, aparecerá aquí.</p>
            <button className="btn-primary" disabled>
              Ver Catálogo
              <small>(Próximamente)</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisPedidos;