import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { solicitudesService } from '../services/api';
import '../styles/pages/MisEventos.css';

const MisEventos = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar solicitudes del backend
  useEffect(() => {
    const cargarSolicitudes = async () => {
      if (!isAuthenticated()) return;
      
      try {
        setLoading(true);
        const solicitudes = await solicitudesService.getMisSolicitudes();
        
        // Transformar solicitudes al formato de eventos
        const eventosTransformados = solicitudes.map(sol => ({
          id: sol.solicitud_id,
          nombre: sol.tipo_evento || `Solicitud ${sol.numero_solicitud}`,
          fecha: sol.fecha_evento_inicio,
          hora: '00:00',
          ubicacion: sol.direccion_evento || 'Por definir',
          estado: mapearEstado(sol.estado),
          productos: sol.total_productos || 0,
          paquetes: sol.total_paquetes || 0,
          total: sol.total_cotizacion,
          personas: sol.num_personas_estimado || 0,
          numero_solicitud: sol.numero_solicitud
        }));
        
        setEventos(eventosTransformados);
        setError(null);
      } catch (err) {
        console.error('Error al cargar solicitudes:', err);
        setError('No se pudieron cargar los eventos');
        setEventos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarSolicitudes();
  }, [isAuthenticated]);

  // Mapear estados de solicitud a estados de evento
  const mapearEstado = (estadoSolicitud) => {
    const mapeo = {
      'pendiente': 'pendiente',
      'aprobada': 'confirmado',
      'rechazada': 'cancelado',
      'en_proceso': 'confirmado',
      'completada': 'completado',
      'cancelada': 'cancelado'
    };
    return mapeo[estadoSolicitud] || 'pendiente';
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const getEstadoBadge = (estado) => {
    const badges = {
      confirmado: { text: 'Confirmado', class: 'badge-confirmed' },
      pendiente: { text: 'Pendiente', class: 'badge-pending' },
      completado: { text: 'Completado', class: 'badge-completed' },
      cancelado: { text: 'Cancelado', class: 'badge-cancelled' }
    };
    return badges[estado] || badges.pendiente;
  };

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredEventos = eventos.filter(evento => {
    if (selectedFilter === 'todos') return true;
    return evento.estado === selectedFilter;
  });

  const handleVerDetalles = (evento) => {
    // Mostrar modal con detalles completos del evento
    alert(`Ver detalles de: ${evento.nombre}\nNúmero: ${evento.numero_solicitud}\nTotal: ${formatCurrency(evento.total)}\n\nEsta funcionalidad mostrará un modal con todos los detalles del evento.`);
    // TODO: Implementar modal de detalles
  };

  const handleModificar = (evento) => {
    if (evento.estado !== 'pendiente') {
      alert('Solo puedes modificar eventos en estado pendiente');
      return;
    }
    // Navegar a página de edición o mostrar modal
    alert(`Modificar evento: ${evento.nombre}\n\nEsta funcionalidad permitirá editar los detalles del evento.`);
    // TODO: Implementar edición de evento
  };

  const handleCancelar = async (evento) => {
    if (!confirm(`¿Estás seguro de que deseas cancelar el evento "${evento.nombre}"?`)) {
      return;
    }

    try {
      await solicitudesService.cancelarSolicitud(evento.id);
      alert('Evento cancelado exitosamente');
      // Recargar eventos
      window.location.reload();
    } catch (error) {
      console.error('Error al cancelar evento:', error);
      alert('No se pudo cancelar el evento. Intenta nuevamente.');
    }
  };

  return (
    <div className="eventos-page">
      <div className="eventos-container">
        <div className="eventos-header">
          <div className="eventos-avatar">
            <svg className="avatar-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h1>Mis Eventos</h1>
          <p className="eventos-subtitle">Gestiona y consulta tus eventos programados</p>
        </div>

        <div className="eventos-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando eventos desde la base de datos...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button className="btn-primary" onClick={() => window.location.reload()}>
                Reintentar
              </button>
            </div>
          ) : (
            <>
          {/* Filtros */}
          <div className="eventos-filters">
            <button 
              className={`filter-btn ${selectedFilter === 'todos' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('todos')}
            >
              Todos ({eventos.length})
            </button>
            <button 
              className={`filter-btn ${selectedFilter === 'confirmado' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('confirmado')}
            >
              Confirmados ({eventos.filter(e => e.estado === 'confirmado').length})
            </button>
            <button 
              className={`filter-btn ${selectedFilter === 'pendiente' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('pendiente')}
            >
              Pendientes ({eventos.filter(e => e.estado === 'pendiente').length})
            </button>
          </div>

          {/* Lista de eventos */}
          <div className="eventos-section">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10H3M16 2v4M8 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
              </svg>
              Próximos Eventos
            </h2>
            
            {filteredEventos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎪</div>
                <h3>No hay eventos en esta categoría</h3>
                <p>Intenta cambiar el filtro o planifica un nuevo evento.</p>
                <button className="btn-primary" onClick={() => navigate('/productos')}>
                  Ver Productos
                </button>
              </div>
            ) : (
              <div className="eventos-list">
                {filteredEventos.map(evento => (
                  <div key={evento.id} className="evento-card">
                    <div className="evento-header">
                      <div className="evento-title-section">
                        <h3>{evento.nombre}</h3>
                        <span className={`evento-badge ${getEstadoBadge(evento.estado).class}`}>
                          {getEstadoBadge(evento.estado).text}
                        </span>
                      </div>
                      <div className="evento-date">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {formatDate(evento.fecha)} - {evento.hora}
                      </div>
                    </div>

                    <div className="evento-body">
                      <div className="evento-info-grid">
                        <div className="info-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <div>
                            <span className="info-label">Ubicación</span>
                            <span className="info-value">{evento.ubicacion}</span>
                          </div>
                        </div>

                        <div className="info-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          <div>
                            <span className="info-label">Personas</span>
                            <span className="info-value">{evento.personas} invitados</span>
                          </div>
                        </div>

                        <div className="info-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                            <line x1="7" y1="7" x2="7.01" y2="7"></line>
                          </svg>
                          <div>
                            <span className="info-label">Productos</span>
                            <span className="info-value">{evento.productos} items</span>
                          </div>
                        </div>

                        <div className="info-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                          </svg>
                          <div>
                            <span className="info-label">Paquetes</span>
                            <span className="info-value">{evento.paquetes} paquetes</span>
                          </div>
                        </div>
                      </div>

                      <div className="evento-footer">
                        <div className="evento-total">
                          <span className="total-label">Total:</span>
                          <span className="total-value">{formatCurrency(evento.total)}</span>
                        </div>
                        <div className="evento-actions">
                          <button 
                            className="btn-secondary"
                            onClick={() => handleVerDetalles(evento)}
                          >
                            Ver Detalles
                          </button>
                          <button 
                            className="btn-primary"
                            onClick={() => handleModificar(evento)}
                            disabled={evento.estado !== 'pendiente'}
                          >
                            Modificar
                          </button>
                          {evento.estado === 'pendiente' && (
                            <button 
                              className="btn-danger"
                              onClick={() => handleCancelar(evento)}
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón para crear nuevo evento */}
          <div className="eventos-actions">
            <button className="btn-create" onClick={() => navigate('/productos')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Planificar Nuevo Evento
            </button>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisEventos;
