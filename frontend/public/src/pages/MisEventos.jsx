import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../styles/pages/UserPages.css';

const MisEventos = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="user-page">
      <div className="user-page-container">
        <div className="page-header">
          <div className="header-icon">🎉</div>
          <h1>Mis Eventos</h1>
          <p>Gestiona y consulta tus eventos programados</p>
        </div>

        <div className="content-section">
          <div className="empty-state">
            <div className="empty-icon">🎪</div>
            <h3>No tienes eventos programados</h3>
            <p>Cuando planifiques un evento con nuestros productos, aparecerá aquí con todos los detalles.</p>
            <button className="btn-primary" disabled>
              Planificar Evento
              <small>(Próximamente)</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisEventos;