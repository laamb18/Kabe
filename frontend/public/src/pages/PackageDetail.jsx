import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paquetesService } from '../services/api';
import '../styles/pages/PackageDetail.css';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [paquete, setPaquete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const loadPaquete = async () => {
      try {
        setLoading(true);
        const data = await paquetesService.getById(id);
        setPaquete(data);
      } catch (err) {
        setError('Error al cargar el paquete');
        console.error('Error loading paquete:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPaquete();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate('/paquetes');
  };

  const handleSolicitarCotizacion = () => {
    if (isAuthenticated()) {
      // Si está autenticado, proceder con la cotización
      // TODO: Implementar lógica de cotización
      console.log('Proceder con cotización');
    } else {
      // Si no está autenticado, mostrar modal
      setShowLoginModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToRegister = () => {
    navigate('/registro');
  };

  if (loading) {
    return (
      <div className="package-detail-page">
        <div className="package-detail-container">
          <div className="package-detail-loading">
            <div className="package-detail-spinner"></div>
            <p>Cargando paquete...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !paquete) {
    return (
      <div className="package-detail-page">
        <div className="package-detail-container">
          <div className="package-detail-error">
            <h2>Paquete no encontrado</h2>
            <p>{error || 'El paquete que buscas no existe o no está disponible.'}</p>
            <button 
              className="package-detail-back-btn"
              onClick={handleGoBack}
            >
              Volver a Paquetes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calcular precio con descuento
  const finalPrice = paquete.descuento_porcentaje 
    ? paquete.precio_por_dia * (1 - paquete.descuento_porcentaje / 100) 
    : paquete.precio_por_dia;
  const hasDiscount = paquete.descuento_porcentaje && paquete.descuento_porcentaje > 0;

  return (
    <div className="package-detail-page">
      <div className="package-detail-container">
        {/* Breadcrumb */}
        <nav className="package-breadcrumb">
          <button onClick={handleGoBack} className="breadcrumb-link">
            Paquetes
          </button>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{paquete.nombre}</span>
        </nav>

        <div className="package-detail-content">
          {/* Imagen del paquete */}
          <div className="package-detail-image">
            {paquete.imagen_url ? (
              <img src={paquete.imagen_url} alt={paquete.nombre} />
            ) : (
              <div className="package-detail-no-image">
                <span>📦</span>
                <p>Sin imagen</p>
              </div>
            )}
          </div>

          {/* Información del paquete */}
          <div className="package-detail-info">
            <div className="package-detail-header">
              <span className="package-detail-category">PAQUETE</span>
              <h1 className="package-detail-title">{paquete.nombre}</h1>
              <p className="package-detail-code">Código: {paquete.codigo_paquete}</p>
            </div>

            <div className="package-detail-description">
              <h3>Descripción</h3>
              <p>{paquete.descripcion || 'Sin descripción disponible'}</p>
            </div>

            <div className="package-detail-pricing">
              <h3>Precio</h3>
              <div className="pricing-info">
                {hasDiscount && (
                  <span className="original-price">${paquete.precio_por_dia}/día</span>
                )}
                <span className="final-price">${finalPrice.toFixed(2)}/día</span>
                {hasDiscount && (
                  <span className="discount-badge">{paquete.descuento_porcentaje}% OFF</span>
                )}
              </div>
            </div>

            {paquete.capacidad_personas && (
              <div className="package-detail-capacity">
                <h3>Capacidad</h3>
                <p>👥 {paquete.capacidad_personas} personas</p>
              </div>
            )}

            <div className="package-detail-actions">
              <button 
                className="package-detail-btn primary"
                onClick={handleSolicitarCotizacion}
              >
                Solicitar Cotización
              </button>
              <button className="package-detail-btn secondary" onClick={handleGoBack}>
                Ver Otros Paquetes
              </button>
            </div>

            {/* Información adicional */}
            <div className="package-detail-metadata">
              <p className="package-status">
                Estado: <span className={paquete.activo ? 'active' : 'inactive'}>
                  {paquete.activo ? 'Disponible' : 'No disponible'}
                </span>
              </p>
              {paquete.fecha_creacion && (
                <p className="package-created">
                  Disponible desde: {new Date(paquete.fecha_creacion).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="login-modal-overlay" onClick={handleCloseModal}>
          <div 
            className="login-modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button className="login-modal-close" onClick={handleCloseModal}>
              ✕
            </button>
            
            <h2 className="login-modal-title">Inicia Sesión</h2>
            <p className="login-modal-message">
              Para solicitar una cotización necesitas iniciar sesión primero
            </p>
            
            <div className="login-modal-actions">
              <button 
                className="login-modal-btn primary"
                onClick={handleGoToLogin}
              >
                Iniciar Sesión
              </button>
              <button 
                className="login-modal-btn secondary"
                onClick={handleGoToRegister}
              >
                Crear Cuenta
              </button>
            </div>
            
            <button 
              className="login-modal-cancel"
              onClick={handleCloseModal}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetail;