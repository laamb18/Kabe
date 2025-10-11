import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '../../services/api';
import '../../styles/pages/AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminAuthService.login(formData.email, formData.password);
      
      // Guardar datos del administrador
      adminAuthService.saveSession(response);
      
      // Redirigir al dashboard de administrador
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Panel de Administración</h1>
          <p>Acceso exclusivo para administradores</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email del Administrador</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@kabe.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-login-button"
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Acceder al Panel'
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>
            <span className="warning-icon">⚠</span>
            Solo administradores autorizados pueden acceder
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="back-to-site-button"
          >
            Volver al Sitio
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;