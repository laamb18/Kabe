import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/Carrito.css';

const Carrito = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cuponCodigo, setCuponCodigo] = useState('');

  // Datos de ejemplo - En producción vendrían del backend
  const [itemsCarrito] = useState([
    {
      id: 1,
      tipo: 'producto',
      nombre: 'Silla Tiffany Blanca',
      codigo: 'SILLA-001',
      imagen: 'https://via.placeholder.com/150',
      precioPorDia: 15000,
      cantidad: 10,
      diasRenta: 3,
      fechaInicio: '2025-11-01',
      fechaFin: '2025-11-03',
      disponible: true
    },
    {
      id: 2,
      tipo: 'producto',
      nombre: 'Mesa Rectangular 2m',
      codigo: 'MESA-005',
      imagen: 'https://via.placeholder.com/150',
      precioPorDia: 35000,
      cantidad: 5,
      diasRenta: 3,
      fechaInicio: '2025-11-01',
      fechaFin: '2025-11-03',
      disponible: true
    },
    {
      id: 3,
      tipo: 'paquete',
      nombre: 'Paquete Boda Premium',
      codigo: 'PKG-BODA-01',
      imagen: 'https://via.placeholder.com/150',
      precioPorDia: 250000,
      cantidad: 1,
      diasRenta: 2,
      fechaInicio: '2025-11-05',
      fechaFin: '2025-11-06',
      descuento: 15,
      disponible: true,
      capacidad: 100
    }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calcularSubtotal = (item) => {
    const precioBase = item.precioPorDia * item.cantidad * item.diasRenta;
    if (item.descuento) {
      return precioBase * (1 - item.descuento / 100);
    }
    return precioBase;
  };

  const subtotal = itemsCarrito.reduce((sum, item) => sum + calcularSubtotal(item), 0);
  const descuentoCupon = 0; // Se calculará cuando se aplique un cupón
  const iva = subtotal * 0.19;
  const total = subtotal - descuentoCupon + iva;

  const handleContinuarCompra = () => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      // Aquí iría la lógica para proceder al checkout
      console.log('Proceder al checkout');
    }
  };

  const handleAplicarCupon = () => {
    console.log('Aplicar cupón:', cuponCodigo);
    // Lógica para aplicar cupón
  };

  return (
    <div className="carrito-page">
      <div className="carrito-container">
        <div className="carrito-header">
          <div className="carrito-avatar">
            <svg className="avatar-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h1>Carrito de Compras</h1>
          <p className="carrito-subtitle">Revisa y confirma tu pedido antes de continuar</p>
        </div>

        <div className="carrito-content">
          {itemsCarrito.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🛒</div>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega productos o paquetes para comenzar tu reserva.</p>
              <button className="btn-primary" onClick={() => navigate('/productos')}>
                Ver Productos
              </button>
            </div>
          ) : (
            <div className="carrito-layout">
              {/* Lista de items */}
              <div className="carrito-items-section">
                <div className="section-header">
                  <h2>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    Items en tu carrito ({itemsCarrito.length})
                  </h2>
                </div>

                <div className="items-list">
                  {itemsCarrito.map(item => (
                    <div key={item.id} className={`cart-item ${!item.disponible ? 'no-disponible' : ''}`}>
                      <div className="item-image">
                        <img src={item.imagen} alt={item.nombre} />
                        {item.tipo === 'paquete' && (
                          <span className="item-badge badge-paquete">Paquete</span>
                        )}
                        {item.descuento && (
                          <span className="item-badge badge-descuento">-{item.descuento}%</span>
                        )}
                      </div>

                      <div className="item-details">
                        <div className="item-header">
                          <div>
                            <h3>{item.nombre}</h3>
                            <span className="item-codigo">{item.codigo}</span>
                          </div>
                          {!item.disponible && (
                            <span className="badge-no-disponible">No disponible</span>
                          )}
                        </div>

                        <div className="item-info-grid">
                          <div className="info-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <div>
                              <span className="info-label">Fechas</span>
                              <span className="info-value">{formatDate(item.fechaInicio)} - {formatDate(item.fechaFin)}</span>
                            </div>
                          </div>

                          <div className="info-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <div>
                              <span className="info-label">Duración</span>
                              <span className="info-value">{item.diasRenta} {item.diasRenta === 1 ? 'día' : 'días'}</span>
                            </div>
                          </div>

                          <div className="info-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="12" y1="1" x2="12" y2="23"></line>
                              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                            <div>
                              <span className="info-label">Precio/día</span>
                              <span className="info-value">{formatCurrency(item.precioPorDia)}</span>
                            </div>
                          </div>

                          {item.capacidad && (
                            <div className="info-item">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                              <div>
                                <span className="info-label">Capacidad</span>
                                <span className="info-value">{item.capacidad} personas</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="item-actions">
                          <div className="quantity-control">
                            <button className="qty-btn">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                            </button>
                            <span className="quantity">{item.cantidad}</span>
                            <button className="qty-btn">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                            </button>
                          </div>

                          <button className="btn-remove">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </div>

                      <div className="item-subtotal">
                        <span className="subtotal-label">Subtotal</span>
                        <span className="subtotal-value">{formatCurrency(calcularSubtotal(item))}</span>
                        {item.descuento && (
                          <span className="precio-original">{formatCurrency(item.precioPorDia * item.cantidad * item.diasRenta)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cupón de descuento */}
                <div className="cupon-section">
                  <h3>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    ¿Tienes un cupón de descuento?
                  </h3>
                  <div className="cupon-input-group">
                    <input
                      type="text"
                      placeholder="Ingresa tu código"
                      value={cuponCodigo}
                      onChange={(e) => setCuponCodigo(e.target.value)}
                      className="cupon-input"
                    />
                    <button className="btn-aplicar-cupon" onClick={handleAplicarCupon}>
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>

              {/* Resumen del pedido */}
              <div className="carrito-summary-section">
                <div className="summary-card">
                  <h2>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Resumen del Pedido
                  </h2>

                  <div className="summary-content">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>

                    {descuentoCupon > 0 && (
                      <div className="summary-row discount">
                        <span>Descuento cupón</span>
                        <span>-{formatCurrency(descuentoCupon)}</span>
                      </div>
                    )}

                    <div className="summary-row">
                      <span>IVA (19%)</span>
                      <span>{formatCurrency(iva)}</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row total">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>

                    <button className="btn-checkout" onClick={handleContinuarCompra}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                      Continuar con el Pago
                    </button>

                    <button className="btn-continue-shopping" onClick={() => navigate('/productos')}>
                      Seguir Comprando
                    </button>
                  </div>

                  {/* Información adicional */}
                  <div className="summary-info">
                    <div className="info-item-summary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <span>Pago 100% seguro</span>
                    </div>
                    <div className="info-item-summary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Garantía de calidad</span>
                    </div>
                    <div className="info-item-summary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>Entrega a domicilio</span>
                    </div>
                  </div>
                </div>

                {/* Ayuda */}
                <div className="help-card">
                  <h3>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    ¿Necesitas ayuda?
                  </h3>
                  <p>Nuestro equipo está disponible para asistirte</p>
                  <button className="btn-help">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Contactar Soporte
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

export default Carrito;
