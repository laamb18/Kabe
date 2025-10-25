import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/api';
import { showSuccessNotification, showErrorNotification } from '../utils/notifications';
import '../styles/pages/Profile.css';

const Profile = () => {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(profileData);
      
      // Actualizar el contexto con los nuevos datos
      updateUser(updatedUser);
      
      showSuccessNotification('Perfil actualizado exitosamente');
      setIsEditingProfile(false);
    } catch (error) {
      showErrorNotification(error.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelEdit = () => {
    setProfileData({
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      telefono: user?.telefono || '',
      direccion: user?.direccion || ''
    });
    setIsEditingProfile(false);
  };
  
  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      showErrorNotification('Las contraseñas no coinciden');
      return;
    }
    
    if (passwordData.new_password.length < 6) {
      showErrorNotification('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    try {
      await authService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      showSuccessNotification('Contraseña cambiada exitosamente');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setIsChangingPassword(false);
    } catch (error) {
      showErrorNotification(error.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelPasswordChange = () => {
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setIsChangingPassword(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <svg className="avatar-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h1>Mi Perfil</h1>
          <p className="profile-subtitle">Información de tu cuenta en K'abé</p>
        </div>

        <div className="profile-content">
          {/* Sección de información personal */}
          {!isEditingProfile && !isChangingPassword && (
            <>
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
                <button className="btn-primary" onClick={() => setIsEditingProfile(true)}>
                  Editar Perfil
                </button>
                <button className="btn-secondary" onClick={() => setIsChangingPassword(true)}>
                  Cambiar Contraseña
                </button>
                <button className="btn-danger" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}

          {/* Formulario de edición de perfil */}
          {isEditingProfile && (
            <div className="profile-section">
              <h2>Editar Perfil</h2>
              <div className="profile-form">
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={profileData.nombre}
                    onChange={handleProfileChange}
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="form-group">
                  <label>Apellido:</label>
                  <input
                    type="text"
                    name="apellido"
                    value={profileData.apellido}
                    onChange={handleProfileChange}
                    placeholder="Tu apellido"
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono:</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={profileData.telefono}
                    onChange={handleProfileChange}
                    placeholder="Tu teléfono"
                  />
                </div>
                <div className="form-group">
                  <label>Dirección:</label>
                  <input
                    type="text"
                    name="direccion"
                    value={profileData.direccion}
                    onChange={handleProfileChange}
                    placeholder="Tu dirección"
                  />
                </div>
                <div className="form-actions">
                  <button 
                    className="btn-primary" 
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Formulario de cambio de contraseña */}
          {isChangingPassword && (
            <div className="profile-section">
              <h2>Cambiar Contraseña</h2>
              <div className="profile-form">
                <div className="form-group">
                  <label>Contraseña Actual:</label>
                  <input
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    placeholder="Tu contraseña actual"
                  />
                </div>
                <div className="form-group">
                  <label>Nueva Contraseña:</label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    placeholder="Nueva contraseña (mínimo 6 caracteres)"
                  />
                </div>
                <div className="form-group">
                  <label>Confirmar Nueva Contraseña:</label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
                <div className="form-actions">
                  <button 
                    className="btn-primary" 
                    onClick={handleChangePassword}
                    disabled={loading}
                  >
                    {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={handleCancelPasswordChange}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;