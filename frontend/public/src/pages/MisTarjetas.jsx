import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../styles/pages/MisTarjetas.css';

const MisTarjetas = () => {
  const { isAuthenticated } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Datos de ejemplo - En producción vendrían del backend
  const tarjetas = [
    {
      id: 1,
      tipo: 'tarjeta_credito',
      marca: 'Visa',
      ultimos4: '4532',
      nombreTitular: 'Juan Pérez García',
      mesExpiracion: 12,
      anioExpiracion: 2026,
      esPredeterminada: true,
      activo: true,
      fechaCreacion: '2024-01-15'
    },
    {
      id: 2,
      tipo: 'tarjeta_debito',
      marca: 'Mastercard',
      ultimos4: '8765',
      nombreTitular: 'Juan Pérez García',
      mesExpiracion: 8,
      anioExpiracion: 2025,
      esPredeterminada: false,
      activo: true,
      fechaCreacion: '2024-03-20'
    },
    {
      id: 3,
      tipo: 'tarjeta_credito',
      marca: 'American Express',
      ultimos4: '1234',
      nombreTitular: 'Juan Pérez García',
      mesExpiracion: 5,
      anioExpiracion: 2027,
      esPredeterminada: false,
      activo: true,
      fechaCreacion: '2024-06-10'
    }
  ];

  const getMarcaIcon = (marca) => {
    const icons = {
      'Visa': (
        <svg width="40" height="24" viewBox="0 0 48 32" fill="none">
          <rect width="48" height="32" rx="4" fill="#1A1F71"/>
          <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">VISA</text>
        </svg>
      ),
      'Mastercard': (
        <svg width="40" height="24" viewBox="0 0 48 32" fill="none">
          <rect width="48" height="32" rx="4" fill="#EB001B"/>
          <circle cx="18" cy="16" r="8" fill="#FF5F00" opacity="0.8"/>
          <circle cx="30" cy="16" r="8" fill="#F79E1B" opacity="0.8"/>
        </svg>
      ),
      'American Express': (
        <svg width="40" height="24" viewBox="0 0 48 32" fill="none">
          <rect width="48" height="32" rx="4" fill="#006FCF"/>
          <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">AMEX</text>
        </svg>
      )
    };
    return icons[marca] || icons['Visa'];
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      tarjeta_credito: 'Crédito',
      tarjeta_debito: 'Débito',
      transferencia: 'Transferencia',
      efectivo: 'Efectivo'
    };
    return labels[tipo] || tipo;
  };

  const formatExpiracion = (mes, anio) => {
    return `${String(mes).padStart(2, '0')}/${String(anio).slice(-2)}`;
  };

  const isExpiringSoon = (mes, anio) => {
    const now = new Date();
    const expDate = new Date(anio, mes - 1);
    const monthsDiff = (expDate.getFullYear() - now.getFullYear()) * 12 + expDate.getMonth() - now.getMonth();
    return monthsDiff <= 3 && monthsDiff >= 0;
  };

  const isExpired = (mes, anio) => {
    const now = new Date();
    const expDate = new Date(anio, mes - 1);
    return expDate < now;
  };

  return (
    <div className="tarjetas-page">
      <div className="tarjetas-container">
        <div className="tarjetas-header">
          <div className="tarjetas-avatar">
            <svg className="avatar-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <h1>Mis Tarjetas</h1>
          <p className="tarjetas-subtitle">Administra tus métodos de pago de forma segura</p>
        </div>

        <div className="tarjetas-content">
          {/* Información de seguridad */}
          <div className="security-notice">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <div>
              <strong>Tus datos están protegidos</strong>
              <p>Solo almacenamos los últimos 4 dígitos de tu tarjeta. La información completa está encriptada.</p>
            </div>
          </div>

          {/* Lista de tarjetas */}
          <div className="tarjetas-section">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              Tarjetas Guardadas
            </h2>
            
            {tarjetas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💳</div>
                <h3>No tienes tarjetas guardadas</h3>
                <p>Agrega una tarjeta para realizar pagos más rápido.</p>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                  Agregar Tarjeta
                </button>
              </div>
            ) : (
              <div className="tarjetas-grid">
                {tarjetas.map(tarjeta => (
                  <div key={tarjeta.id} className={`tarjeta-card ${tarjeta.esPredeterminada ? 'predeterminada' : ''}`}>
                    {tarjeta.esPredeterminada && (
                      <div className="badge-predeterminada">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                        </svg>
                        Predeterminada
                      </div>
                    )}

                    {isExpired(tarjeta.mesExpiracion, tarjeta.anioExpiracion) && (
                      <div className="badge-expirada">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        Expirada
                      </div>
                    )}

                    {!isExpired(tarjeta.mesExpiracion, tarjeta.anioExpiracion) && 
                     isExpiringSoon(tarjeta.mesExpiracion, tarjeta.anioExpiracion) && (
                      <div className="badge-por-expirar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        Por expirar
                      </div>
                    )}

                    <div className="tarjeta-marca">
                      {getMarcaIcon(tarjeta.marca)}
                    </div>

                    <div className="tarjeta-numero">
                      <span className="dots">••••</span>
                      <span className="dots">••••</span>
                      <span className="dots">••••</span>
                      <span className="ultimos4">{tarjeta.ultimos4}</span>
                    </div>

                    <div className="tarjeta-info">
                      <div className="info-group">
                        <span className="info-label">Titular</span>
                        <span className="info-value">{tarjeta.nombreTitular}</span>
                      </div>
                      <div className="info-group">
                        <span className="info-label">Vence</span>
                        <span className="info-value">
                          {formatExpiracion(tarjeta.mesExpiracion, tarjeta.anioExpiracion)}
                        </span>
                      </div>
                    </div>

                    <div className="tarjeta-tipo">
                      <span className="tipo-badge">{getTipoLabel(tarjeta.tipo)}</span>
                      <span className="marca-text">{tarjeta.marca}</span>
                    </div>

                    <div className="tarjeta-actions">
                      {!tarjeta.esPredeterminada && (
                        <button className="btn-action btn-default" title="Establecer como predeterminada">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                          </svg>
                        </button>
                      )}
                      <button className="btn-action btn-edit" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button className="btn-action btn-delete" title="Eliminar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón agregar tarjeta */}
          {tarjetas.length > 0 && (
            <div className="tarjetas-actions">
              <button className="btn-add" onClick={() => setShowAddModal(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Agregar Nueva Tarjeta
              </button>
            </div>
          )}

          {/* Información adicional */}
          <div className="info-section">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Información Importante
            </h3>
            <ul>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Tus datos están encriptados con tecnología de última generación
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Solo almacenamos los últimos 4 dígitos de tu tarjeta
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Puedes eliminar tus tarjetas en cualquier momento
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                La tarjeta predeterminada se usará automáticamente en tus pagos
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisTarjetas;
