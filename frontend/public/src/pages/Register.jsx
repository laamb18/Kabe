import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/pages/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    direccion: '',
    telefono: '',
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

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
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

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
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
    setErrors({});
    
    try {
      // Preparar datos para el backend
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono,
        direccion: formData.direccion
      };

      // Llamar al servicio de registro
      const response = await authService.register(userData);
      
      console.log('Usuario registrado exitosamente:', response);
      
      // Mostrar mensaje de éxito
      alert(`¡Registro exitoso! Bienvenido ${response.nombre} ${response.apellido} a K'abé`);
      
      // Redirigir al login
      navigate('/login', { 
        state: { 
          message: 'Registro exitoso. Ahora puedes iniciar sesión.',
          email: formData.email 
        } 
      });
      
    } catch (error) {
      console.error('Error en el registro:', error);
      
      // Manejar errores específicos
      if (error.message.includes('El email ya está registrado')) {
        setErrors({ email: 'Este email ya está registrado. Intenta con otro.' });
      } else if (error.message.includes('422')) {
        setErrors({ general: 'Los datos proporcionados no son válidos. Verifica todos los campos.' });
      } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
        setErrors({ general: 'Error interno del servidor. Por favor, intenta más tarde.' });
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setErrors({ general: 'No se puede conectar al servidor. Verifica tu conexión a internet.' });
      } else if (error.message.includes('CORS')) {
        setErrors({ general: 'Error de configuración del servidor. Contacta al administrador.' });
      } else {
        // Para cualquier otro error, mostrar un mensaje genérico pero útil
        setErrors({ 
          general: `Error al crear la cuenta: ${error.message || 'Por favor, intenta nuevamente.'}` 
        });
      }
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
              {/* Mostrar error general si existe */}
              {errors.general && (
                <div className="general-error">
                  <div className="error-icon">⚠️</div>
                  <span className="error-message">{errors.general}</span>
                  <button 
                    type="button" 
                    className="retry-button"
                    onClick={() => setErrors({})}
                  >
                    Cerrar
                  </button>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={errors.nombre ? 'error' : ''}
                  placeholder="Tu nombre"
                />
                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className={errors.apellido ? 'error' : ''}
                  placeholder="Tu apellido"
                />
                {errors.apellido && <span className="error-message">{errors.apellido}</span>}
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
                <label htmlFor="direccion">Dirección</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className={errors.direccion ? 'error' : ''}
                  placeholder="Tu dirección completa"
                />
                {errors.direccion && <span className="error-message">{errors.direccion}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className={errors.telefono ? 'error' : ''}
                  placeholder="(555) 123-4567"
                />
                {errors.telefono && <span className="error-message">{errors.telefono}</span>}
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