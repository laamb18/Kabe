import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../styles/pages/UserPages.css';

const Tarjetas = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="user-page">
      <div className="user-page-container">
        <div className="page-header">
          <div className="header-icon">💳</div>
          <h1>Mis Tarjetas</h1>
          <p>Gestiona tus métodos de pago</p>
        </div>

        <div className="content-section">
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <h3>No tienes tarjetas guardadas</h3>
            <p>Agrega una tarjeta para hacer más rápidos tus pagos.</p>
            <button className="btn-primary" disabled>
              Agregar Tarjeta
              <small>(Próximamente)</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tarjetas;