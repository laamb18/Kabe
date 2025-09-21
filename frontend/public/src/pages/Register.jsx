import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pages/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
    acceptTerms: false
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
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
      // TODO: Implementar lógica de registro
      console.log('Datos de registro:', formData);
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('¡Registro exitoso! Bienvenido a K\'abé');
      
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Error al registrar usuario. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Botón de regreso */}
      <button 
        className="back-button"
        onClick={() => navigate('/')}
        title="Volver al inicio"
      >
        ← Volver al inicio
      </button>
      
      <div className="register-container">
        {/* Imagen lado izquierdo */}
        <div className="register-image">
          <div className="image-overlay">
            <div className="overlay-content">
              <h2>Únete a K'abé</h2>
              <p>Descubre la mejor experiencia en renta de mobiliario para eventos</p>
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Productos de calidad premium</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Servicio personalizado</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Entrega puntual garantizada</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario lado derecho */}
        <div className="register-form-section">
          <div className="form-container">
            <div className="form-header">
              <h1 className="form-title">Empieza tu Registro!</h1>
              <p className="form-subtitle">
                Crea tu cuenta y accede a nuestros servicios exclusivos
              </p>
            </div>

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Nombre Completo</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                  placeholder="Tu nombre completo"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

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
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Repite tu contraseña"
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">Dirección</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="Tu dirección completa"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className={errors.acceptTerms ? 'error' : ''}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">
                    Acepto los <Link to="/terminos" className="link">términos y condiciones</Link> y la <Link to="/privacidad" className="link">política de privacidad</Link>
                  </span>
                </label>
                {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Usuario'
                )}
              </button>
            </form>

            <div className="form-footer">
              <p className="login-link">
                ¿Ya tienes cuenta? <Link to="/login" className="link">Inicia sesión aquí</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;