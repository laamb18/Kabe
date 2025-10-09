import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../styles/pages/Profile.css';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <h1>Mi Perfil</h1>
          <p className="profile-subtitle">Información de tu cuenta en K'abé</p>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Información Personal</h2>
            <div className="profile-info">
              <div className="info-group">
                <label>Nombre:</label>
                <span>{user?.nombre}</span>
              </div>
              <div className="info-group">
                <label>Apellido:</label>
                <span>{user?.apellido}</span>
              </div>
              <div className="info-group">
                <label>Email:</label>
                <span>{user?.email}</span>
              </div>
              <div className="info-group">
                <label>Teléfono:</label>
                <span>{user?.telefono || 'No especificado'}</span>
              </div>
              <div className="info-group">
                <label>Dirección:</label>
                <span>{user?.direccion || 'No especificada'}</span>
              </div>
              <div className="info-group">
                <label>Miembro desde:</label>
                <span>{new Date(user?.fecha_registro).toLocaleDateString('es-ES')}</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-primary" disabled>
              Editar Perfil
              <small>(Próximamente)</small>
            </button>
            <button className="btn-secondary" disabled>
              Cambiar Contraseña
              <small>(Próximamente)</small>
            </button>
            <button className="btn-danger" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;