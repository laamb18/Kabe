import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pages/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implementar lógica de login
      console.log('Datos de login:', formData);
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('¡Bienvenido de vuelta a K\'abé!');
      
    } catch (error) {
      console.error('Error en el login:', error);
      setErrors({ general: 'Credenciales incorrectas. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Botón de regreso */}
      <button 
        className="back-button"
        onClick={() => navigate('/')}
        title="Volver al inicio"
      >
        ← Volver al inicio
      </button>
      
      <div className="login-container">
        {/* Imagen lado izquierdo */}
        <div className="login-image">
          <div className="image-overlay">
            <div className="overlay-content">
              <h2>Bienvenido de vuelta</h2>
              <p>Accede a tu cuenta y continúa planificando eventos increíbles</p>
              <div className="welcome-features">
                <div className="welcome-item">
                  <span className="welcome-icon">🎉</span>
                  <span>Gestiona tus eventos</span>
                </div>
                <div className="welcome-item">
                  <span className="welcome-icon">📋</span>
                  <span>Historial de pedidos</span>
                </div>
                <div className="welcome-item">
                  <span className="welcome-icon">💬</span>
                  <span>Soporte personalizado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario lado derecho */}
        <div className="login-form-section">
          <div className="form-container">
            <div className="form-header">
              <h1 className="form-title">Iniciar Sesión</h1>
              <p className="form-subtitle">
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>

            {errors.general && (
              <div className="error-banner">
                {errors.general}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="tu@email.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Tu contraseña"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">Recordarme</span>
                </label>
                
                <Link to="/forgot-password" className="forgot-link">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            <div className="form-footer">
              <p className="register-link">
                ¿No tienes cuenta? <Link to="/registro" className="link">Regístrate aquí</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;