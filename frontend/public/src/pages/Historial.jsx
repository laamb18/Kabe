import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../styles/pages/Historial.css';

const Historial = () => {
  const { isAuthenticated } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [selectedYear] = useState('2025');

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Datos de ejemplo - En producción vendrían del backend
  const historial = [
    {
      id: 1,
      tipo: 'alquiler',
      descripcion: 'Alquiler de sillas y mesas para evento',
      fecha: '2025-10-15',
      monto: 850000,
      estado: 'completado',
      evento: 'Boda de María y Juan',
      items: 15
    },
    {
      id: 2,
      tipo: 'pago',
      descripcion: 'Pago inicial - Evento Corporativo',
      fecha: '2025-10-10',
      monto: 2000000,
      estado: 'aprobado',
      evento: 'Tech Summit 2025',
      metodoPago: 'Transferencia'
    },
    {
      id: 3,
      tipo: 'devolucion',
      descripcion: 'Devolución de equipos de sonido',
      fecha: '2025-10-05',
      monto: 0,
      estado: 'completado',
      evento: 'Cumpleaños de Sofía',
      items: 8
    },
    {
      id: 4,
      tipo: 'alquiler',
      descripcion: 'Paquete Premium - Decoración completa',
      fecha: '2025-09-28',
      monto: 3500000,
      estado: 'completado',
      evento: 'Aniversario Empresa XYZ',
      items: 25
    },
    {
      id: 5,
      tipo: 'pago',
      descripcion: 'Pago final - Cumpleaños infantil',
      fecha: '2025-09-20',
      monto: 650000,
      estado: 'aprobado',
      evento: 'Cumpleaños de Sofía',
      metodoPago: 'Tarjeta de crédito'
    },
    {
      id: 6,
      tipo: 'cancelacion',
      descripcion: 'Cancelación de reserva',
      fecha: '2025-09-15',
      monto: -500000,
      estado: 'reembolsado',
      evento: 'Evento Familiar',
      metodoPago: 'Reembolso'
    }
  ];

  const getTipoIcon = (tipo) => {
    const icons = {
      alquiler: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
      ),
      pago: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      ),
      devolucion: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
      ),
      cancelacion: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      )
    };
    return icons[tipo] || icons.alquiler;
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      alquiler: 'Alquiler',
      pago: 'Pago',
      devolucion: 'Devolución',
      cancelacion: 'Cancelación'
    };
    return labels[tipo] || tipo;
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      completado: { text: 'Completado', class: 'badge-completed' },
      aprobado: { text: 'Aprobado', class: 'badge-approved' },
      pendiente: { text: 'Pendiente', class: 'badge-pending' },
      reembolsado: { text: 'Reembolsado', class: 'badge-refunded' },
      cancelado: { text: 'Cancelado', class: 'badge-cancelled' }
    };
    return badges[estado] || badges.pendiente;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredHistorial = historial.filter(item => {
    if (selectedFilter === 'todos') return true;
    return item.tipo === selectedFilter;
  });

  // Calcular estadísticas
  const totalGastado = historial
    .filter(item => item.monto > 0)
    .reduce((sum, item) => sum + item.monto, 0);
  
  const totalEventos = new Set(historial.map(item => item.evento)).size;
  const totalTransacciones = historial.length;

  return (
    <div className="historial-page">
      <div className="historial-container">
        <div className="historial-header">
          <div className="historial-avatar">
            <svg className="avatar-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h1>Historial</h1>
          <p className="historial-subtitle">Consulta el historial completo de tus actividades</p>
        </div>

        <div className="historial-content">
          {/* Estadísticas */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon stat-icon-primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Gastado</span>
                <span className="stat-value">{formatCurrency(totalGastado)}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-secondary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">Eventos Realizados</span>
                <span className="stat-value">{totalEventos}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-tertiary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">Transacciones</span>
                <span className="stat-value">{totalTransacciones}</span>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="historial-filters">
            <button 
              className={`filter-btn ${selectedFilter === 'todos' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('todos')}
            >
              Todos
            </button>
            <button 
              className={`filter-btn ${selectedFilter === 'alquiler' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('alquiler')}
            >
              Alquileres
            </button>
            <button 
              className={`filter-btn ${selectedFilter === 'pago' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('pago')}
            >
              Pagos
            </button>
            <button 
              className={`filter-btn ${selectedFilter === 'devolucion' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('devolucion')}
            >
              Devoluciones
            </button>
          </div>

          {/* Lista de historial */}
          <div className="historial-section">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Actividad Reciente
            </h2>
            
            {filteredHistorial.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>No hay registros en esta categoría</h3>
                <p>Intenta cambiar el filtro para ver más actividades.</p>
              </div>
            ) : (
              <div className="historial-list">
                {filteredHistorial.map(item => (
                  <div key={item.id} className={`historial-item tipo-${item.tipo}`}>
                    <div className="item-icon">
                      {getTipoIcon(item.tipo)}
                    </div>
                    
                    <div className="item-content">
                      <div className="item-header">
                        <div className="item-title-section">
                          <h3>{item.descripcion}</h3>
                          <span className="item-tipo">{getTipoLabel(item.tipo)}</span>
                        </div>
                        <span className={`item-badge ${getEstadoBadge(item.estado).class}`}>
                          {getEstadoBadge(item.estado).text}
                        </span>
                      </div>

                      <div className="item-details">
                        <div className="detail-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          <span>{formatDate(item.fecha)}</span>
                        </div>

                        <div className="detail-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10H3M16 2v4M8 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
                          </svg>
                          <span>{item.evento}</span>
                        </div>

                        {item.items && (
                          <div className="detail-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                            </svg>
                            <span>{item.items} items</span>
                          </div>
                        )}

                        {item.metodoPago && (
                          <div className="detail-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                              <line x1="1" y1="10" x2="23" y2="10"></line>
                            </svg>
                            <span>{item.metodoPago}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`item-amount ${item.monto < 0 ? 'negative' : 'positive'}`}>
                      {item.monto < 0 ? '-' : ''}{formatCurrency(item.monto)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón de exportar */}
          <div className="historial-actions">
            <button className="btn-export">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Exportar Historial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historial;