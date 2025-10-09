import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../styles/pages/UserPages.css';

const Direcciones = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="user-page">
      <div className="user-page-container">
        <div className="page-header">
          <div className="header-icon">📍</div>
          <h1>Mis Direcciones</h1>
          <p>Gestiona tus direcciones de entrega</p>
        </div>

        <div className="content-section">
          <div className="empty-state">
            <div className="empty-icon">🏠</div>
            <h3>No tienes direcciones guardadas</h3>
            <p>Agrega direcciones para facilitar tus entregas y recolecciones.</p>
            <button className="btn-primary" disabled>
              Agregar Dirección
              <small>(Próximamente)</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Direcciones;