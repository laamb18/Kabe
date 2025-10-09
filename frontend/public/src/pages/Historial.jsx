import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../styles/pages/UserPages.css';

const Historial = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="user-page">
      <div className="user-page-container">
        <div className="page-header">
          <div className="header-icon">📋</div>
          <h1>Historial</h1>
          <p>Consulta el historial completo de tus actividades</p>
        </div>

        <div className="content-section">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>Tu historial está vacío</h3>
            <p>Aquí encontrarás un registro detallado de todos tus alquileres, eventos y transacciones.</p>
            <button className="btn-primary" disabled>
              Ver Actividad Reciente
              <small>(Próximamente)</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historial;