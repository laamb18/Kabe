import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/components/common/ProductDetailModal.css';

const ProductDetailModal = ({ isOpen, onClose, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Obtener detalles del producto cuando se abre el modal
  useEffect(() => {
    console.log('Modal state changed:', { isOpen, productId });
    if (isOpen && productId) {
      fetchProductDetails();
    }
  }, [isOpen, productId]);

  // Cerrar modal con ESC y manejar scroll del body
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body y compensar por scrollbar
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, onClose]);

  const fetchProductDetails = async () => {
    console.log('Fetching product details for ID:', productId);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8001/api/v1/productos/${productId}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Error al obtener detalles del producto');
      }
      
      const productData = await response.json();
      console.log('Product data received:', productData);
      setProduct(productData);
      setImageLoaded(false); // Reset image loaded state
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    // Solo cerrar si se hizo clic en el overlay, no en el contenido del modal
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    e.target.src = '/images/silla.jpg'; // Imagen de respaldo
    setImageLoaded(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  if (!isOpen) {
    console.log('Modal not open, returning null');
    return null;
  }

  console.log('Rendering modal with:', { isOpen, productId, loading, error, product });

  // Renderizar el modal usando un portal para evitar problemas de z-index
  return createPortal(
    <div 
      className="product-detail-modal-overlay" 
      onClick={handleBackdropClick}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className="product-detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 100000,
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '900px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}
      >
        <button 
          className="product-detail-modal-close"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ×
        </button>

        {loading && (
          <div className="product-detail-loading">
            <div className="loading-spinner"></div>
            <p>Cargando detalles del producto...</p>
          </div>
        )}

        {error && (
          <div className="product-detail-error">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={() => fetchProductDetails()} className="retry-btn">
              Reintentar
            </button>
          </div>
        )}

        {product && !loading && (
          <div className="product-detail-content">
            {/* Imagen del producto */}
            <div className="product-detail-image-container">
              {product.imagen_url ? (
                <img
                  src={product.imagen_url}
                  alt={product.nombre}
                  className={`product-detail-image ${imageLoaded ? 'loaded' : ''}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              ) : (
                <div className="product-detail-no-image">
                  <div className="no-image-icon">📷</div>
                  <p>Sin imagen disponible</p>
                </div>
              )}
              {product.imagen_url && !imageLoaded && (
                <div className="image-loading-placeholder">
                  <div className="loading-spinner small"></div>
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="product-detail-info">
              <div className="product-detail-header">
                <span className="product-detail-code">#{product.codigo_producto}</span>
                <h2 className="product-detail-name">{product.nombre}</h2>
                <span className={`product-detail-status ${product.estado}`}>
                  {product.estado === 'disponible' ? 'Disponible' : 'No disponible'}
                </span>
              </div>

              <div className="product-detail-price">
                <span className="price-amount">{formatPrice(product.precio_por_dia)}</span>
                <span className="price-period">/día</span>
              </div>

              <div className="product-detail-description">
                <h3>Descripción</h3>
                <p>{product.descripcion || 'Sin descripción disponible'}</p>
              </div>

              {product.especificaciones && (
                <div className="product-detail-specifications">
                  <h3>Especificaciones</h3>
                  <p>{product.especificaciones}</p>
                </div>
              )}

              <div className="product-detail-specs-section">
                <h3>Información del Producto</h3>
                <div className="product-detail-specs-grid">
                  {product.dimensiones && (
                    <div className="spec-item">
                      <strong>Dimensiones:</strong>
                      <span>{product.dimensiones}</span>
                    </div>
                  )}
                  
                  {product.peso && (
                    <div className="spec-item">
                      <strong>Peso:</strong>
                      <span>{product.peso} kg</span>
                    </div>
                  )}
                  
                  <div className="spec-item">
                    <strong>Stock total:</strong>
                    <span>{product.stock_total} unidades</span>
                  </div>
                  
                  <div className="spec-item">
                    <strong>Stock disponible:</strong>
                    <span className={product.stock_disponible === 0 ? 'out-of-stock' : ''}>
                      {product.stock_disponible} unidades
                    </span>
                  </div>

                  {product.requiere_deposito && (
                    <div className="spec-item">
                      <strong>Depósito requerido:</strong>
                      <span>{product.deposito_cantidad ? formatPrice(product.deposito_cantidad) : 'Consultar'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="product-detail-actions">
                <button 
                  className="product-detail-btn primary"
                  disabled={product.stock_disponible === 0}
                >
                  {product.stock_disponible === 0 ? 'Sin stock' : 'Rentar ahora'}
                </button>
                
                <button className="product-detail-btn secondary">
                  Agregar a favoritos
                </button>
                
                <button className="product-detail-btn outline">
                  Contactar para más info
                </button>
              </div>

              {/* Información adicional */}
              <div className="product-detail-footer">
                <small className="product-detail-dates">
                  Creado: {formatDate(product.fecha_creacion)}
                  {product.fecha_actualizacion !== product.fecha_creacion && (
                    <span> • Actualizado: {formatDate(product.fecha_actualizacion)}</span>
                  )}
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ProductDetailModal;