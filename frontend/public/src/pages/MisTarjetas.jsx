import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { tarjetasService } from '../services/api';
import '../styles/pages/MisTarjetas.css';

const MisTarjetas = () => {
  const { isAuthenticated } = useAuth();
  const [tarjetas, setTarjetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);

  // Cargar tarjetas del backend
  useEffect(() => {
    if (isAuthenticated()) {
      cargarTarjetas();
    }
  }, [isAuthenticated]);

  const cargarTarjetas = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Intentando cargar tarjetas...');
      const response = await tarjetasService.getMisTarjetas();
      console.log('✅ Respuesta del servidor:', response);
      
      // Verificar que la respuesta tenga la estructura correcta
      if (response && Array.isArray(response.tarjetas)) {
        setTarjetas(response.tarjetas);
        console.log(`📋 ${response.tarjetas.length} tarjetas cargadas`);
      } else {
        console.warn('⚠️ Respuesta inesperada del servidor:', response);
        setTarjetas([]);
      }
    } catch (err) {
      console.error('❌ Error al cargar tarjetas:', err);
      console.error('Detalles del error:', {
        message: err.message,
        response: err.response,
        status: err.status
      });
      
      // Solo mostrar error si realmente hay un problema de conexión
      if (err.message && err.message.includes('Failed to fetch')) {
        setError('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
      } else if (err.status === 401) {
        setError('Sesión expirada. Por favor inicia sesión nuevamente.');
      } else {
        setError(`Error al cargar tarjetas: ${err.message || 'Error desconocido'}`);
      }
      setTarjetas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (tarjetaId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarjeta?')) {
      return;
    }

    try {
      await tarjetasService.eliminarTarjeta(tarjetaId);
      alert('Tarjeta eliminada exitosamente');
      cargarTarjetas();
    } catch (err) {
      console.error('Error al eliminar tarjeta:', err);
      alert('No se pudo eliminar la tarjeta');
    }
  };

  const handleEstablecerPredeterminada = async (tarjetaId) => {
    try {
      await tarjetasService.establecerPredeterminada(tarjetaId);
      alert('Tarjeta establecida como predeterminada');
      cargarTarjetas();
    } catch (err) {
      console.error('Error:', err);
      alert('No se pudo establecer como predeterminada');
    }
  };

  const handleEditar = (tarjeta) => {
    setTarjetaSeleccionada(tarjeta);
    setShowEditModal(true);
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const getMarcaIcon = (marca) => {
    const iconos = {
      visa: (
        <svg width="40" height="24" viewBox="0 0 48 32" fill="none">
          <rect width="48" height="32" rx="4" fill="#1434CB"/>
          <text x="24" y="20" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">VISA</text>
        </svg>
      ),
      mastercard: (
        <svg width="40" height="24" viewBox="0 0 48 32">
          <circle cx="18" cy="16" r="10" fill="#EB001B"/>
          <circle cx="30" cy="16" r="10" fill="#F79E1B"/>
        </svg>
      ),
      amex: (
        <svg width="40" height="24" viewBox="0 0 48 32" fill="none">
          <rect width="48" height="32" rx="4" fill="#006FCF"/>
          <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">AMEX</text>
        </svg>
      )
    };
    return iconos[marca] || iconos.visa;
  };

  const formatExpiracion = (mes, anio) => {
    return `${mes.toString().padStart(2, '0')}/${anio.toString().slice(-2)}`;
  };

  return (
    <div className="tarjetas-page">
      <div className="tarjetas-container">
        <div className="tarjetas-header">
          <div className="tarjetas-avatar">
            <svg className="avatar-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <h1>Mis Tarjetas</h1>
          <p className="tarjetas-subtitle">Gestiona tus métodos de pago de forma segura</p>
        </div>

        <div className="tarjetas-content">
          {/* Aviso de seguridad */}
          <div className="security-notice">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <div>
              <strong>Tus datos están seguros</strong>
              <p>Solo almacenamos los últimos 4 dígitos. Toda la información está encriptada.</p>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando tarjetas...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button className="btn-primary" onClick={cargarTarjetas}>
                Reintentar
              </button>
            </div>
          ) : (
            <>
              {/* Lista de tarjetas */}
              {tarjetas.length > 0 ? (
                <div className="tarjetas-grid">
                  {tarjetas.map(tarjeta => (
                    <div 
                      key={tarjeta.tarjeta_id} 
                      className={`tarjeta-card ${tarjeta.es_predeterminada ? 'predeterminada' : ''} ${tarjeta.esta_expirada ? 'expirada' : ''}`}
                    >
                      <div className="tarjeta-header">
                        <div className="tarjeta-marca">
                          {getMarcaIcon(tarjeta.marca)}
                        </div>
                        <div className="tarjeta-tipo">
                          {tarjeta.tipo_tarjeta === 'credito' ? 'Crédito' : 'Débito'}
                        </div>
                      </div>

                      <div className="tarjeta-numero">
                        •••• •••• •••• {tarjeta.ultimos_digitos}
                      </div>

                      <div className="tarjeta-info">
                        <div>
                          <span className="info-label">Titular</span>
                          <span className="info-value">{tarjeta.nombre_titular}</span>
                        </div>
                        <div>
                          <span className="info-label">Expira</span>
                          <span className="info-value">{formatExpiracion(tarjeta.mes_expiracion, tarjeta.anio_expiracion)}</span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="tarjeta-badges">
                        {tarjeta.es_predeterminada && (
                          <span className="badge badge-predeterminada">
                            ⭐ Predeterminada
                          </span>
                        )}
                        {tarjeta.esta_expirada && (
                          <span className="badge badge-expirada">
                            ❌ Expirada
                          </span>
                        )}
                        {tarjeta.expira_pronto && !tarjeta.esta_expirada && (
                          <span className="badge badge-expira-pronto">
                            ⚠️ Por expirar
                          </span>
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="tarjeta-actions">
                        {!tarjeta.es_predeterminada && !tarjeta.esta_expirada && (
                          <button 
                            className="btn-action predeterminada"
                            onClick={() => handleEstablecerPredeterminada(tarjeta.tarjeta_id)}
                            title="Establecer como predeterminada"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            Predeterminada
                          </button>
                        )}
                        <button 
                          className="btn-action editar"
                          onClick={() => handleEditar(tarjeta)}
                          title="Editar tarjeta"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Editar
                        </button>
                        <button 
                          className="btn-action eliminar"
                          onClick={() => handleEliminar(tarjeta.tarjeta_id)}
                          title="Eliminar tarjeta"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">💳</div>
                  <h3>No tienes tarjetas guardadas</h3>
                  <p>Agrega una tarjeta para hacer más rápidos tus pagos.</p>
                </div>
              )}

              {/* Botón agregar tarjeta */}
              <div className="tarjetas-actions">
                <button className="btn-add-card" onClick={() => setShowAddModal(true)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Agregar Nueva Tarjeta
                </button>
              </div>

              {/* Información de seguridad */}
              <div className="security-info">
                <h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Información de Seguridad
                </h3>
                <ul>
                  <li>✅ Tus datos están encriptados con tecnología de última generación</li>
                  <li>✅ Solo almacenamos los últimos 4 dígitos de tu tarjeta</li>
                  <li>✅ Nunca guardamos tu CVV</li>
                  <li>✅ Puedes eliminar tus tarjetas en cualquier momento</li>
                  <li>✅ La tarjeta predeterminada se usará para pagos automáticos</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Agregar Tarjeta */}
      {showAddModal && (
        <ModalAgregarTarjeta 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            cargarTarjetas();
          }}
        />
      )}

      {/* Modal Editar Tarjeta */}
      {showEditModal && tarjetaSeleccionada && (
        <ModalEditarTarjeta 
          tarjeta={tarjetaSeleccionada}
          onClose={() => {
            setShowEditModal(false);
            setTarjetaSeleccionada(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setTarjetaSeleccionada(null);
            cargarTarjetas();
          }}
        />
      )}
    </div>
  );
};

// Modal para agregar tarjeta
const ModalAgregarTarjeta = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    tipo_tarjeta: 'credito',
    marca: 'visa',
    numero_completo: '',
    nombre_titular: '',
    mes_expiracion: '',
    anio_expiracion: '',
    cvv: '',
    es_predeterminada: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar que todos los campos estén completos
      if (!formData.numero_completo || !formData.nombre_titular || 
          !formData.mes_expiracion || !formData.anio_expiracion || !formData.cvv) {
        alert('Por favor completa todos los campos');
        setLoading(false);
        return;
      }

      // Limpiar el número de tarjeta (quitar espacios)
      const numeroLimpio = formData.numero_completo.replace(/\s/g, '');
      
      // Validar longitud del número
      if (numeroLimpio.length < 13 || numeroLimpio.length > 19) {
        alert('El número de tarjeta debe tener entre 13 y 19 dígitos');
        setLoading(false);
        return;
      }
      
      // Extraer últimos 4 dígitos
      const ultimos_digitos = numeroLimpio.slice(-4);
      
      // Convertir a números y validar
      const mes = parseInt(formData.mes_expiracion);
      const anio = parseInt(formData.anio_expiracion);
      
      if (isNaN(mes) || mes < 1 || mes > 12) {
        alert('Mes de expiración inválido');
        setLoading(false);
        return;
      }
      
      if (isNaN(anio) || anio < 2024) {
        alert('Año de expiración inválido');
        setLoading(false);
        return;
      }
      
      const tarjetaData = {
        tipo_tarjeta: formData.tipo_tarjeta,
        marca: formData.marca,
        numero_completo: numeroLimpio,
        ultimos_digitos: ultimos_digitos,
        nombre_titular: formData.nombre_titular.trim(),
        mes_expiracion: mes,
        anio_expiracion: anio,
        cvv: formData.cvv,
        es_predeterminada: formData.es_predeterminada
      };

      console.log('📤 Enviando datos de tarjeta:', {
        ...tarjetaData,
        numero_completo: '****' + ultimos_digitos,
        cvv: '***'
      });

      const response = await tarjetasService.crearTarjeta(tarjetaData);
      console.log('✅ Tarjeta creada:', response);
      alert('✅ Tarjeta agregada exitosamente');
      onSuccess();
    } catch (err) {
      console.error('❌ Error al crear tarjeta:', err);
      
      // Extraer mensaje de error más específico
      let errorMsg = 'Error desconocido';
      
      if (err.detail) {
        // Error de validación de Pydantic
        if (Array.isArray(err.detail)) {
          errorMsg = err.detail.map(e => `${e.loc.join('.')}: ${e.msg}`).join('\n');
        } else {
          errorMsg = err.detail;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      alert('❌ No se pudo agregar la tarjeta:\n\n' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Agregar Nueva Tarjeta</h2>
        
        <form onSubmit={handleSubmit} className="tarjeta-form">
          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Tarjeta</label>
              <select 
                value={formData.tipo_tarjeta}
                onChange={(e) => setFormData({...formData, tipo_tarjeta: e.target.value})}
                required
              >
                <option value="credito">Crédito</option>
                <option value="debito">Débito</option>
              </select>
            </div>

            <div className="form-group">
              <label>Marca</label>
              <select 
                value={formData.marca}
                onChange={(e) => setFormData({...formData, marca: e.target.value})}
                required
              >
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">American Express</option>
                <option value="otro">Otra</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Número de Tarjeta</label>
            <input
              type="text"
              value={formData.numero_completo}
              onChange={(e) => {
                // Solo permitir números y espacios
                const value = e.target.value.replace(/[^\d\s]/g, '');
                // Formatear con espacios cada 4 dígitos
                const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                setFormData({...formData, numero_completo: formatted});
              }}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              pattern="[\d\s]{13,19}"
              required
            />
            <small style={{color: '#666', fontSize: '0.85rem'}}>
              Ingresa 13-19 dígitos
            </small>
          </div>

          <div className="form-group">
            <label>Nombre del Titular</label>
            <input
              type="text"
              value={formData.nombre_titular}
              onChange={(e) => setFormData({...formData, nombre_titular: e.target.value})}
              placeholder="Como aparece en la tarjeta"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mes de Expiración</label>
              <select 
                value={formData.mes_expiracion}
                onChange={(e) => setFormData({...formData, mes_expiracion: e.target.value})}
                required
              >
                <option value="">Mes</option>
                {Array.from({length: 12}, (_, i) => i + 1).map(mes => (
                  <option key={mes} value={mes}>{mes.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Año de Expiración</label>
              <select 
                value={formData.anio_expiracion}
                onChange={(e) => setFormData({...formData, anio_expiracion: e.target.value})}
                required
              >
                <option value="">Año</option>
                {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(anio => (
                  <option key={anio} value={anio}>{anio}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => {
                  // Solo permitir números
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData({...formData, cvv: value});
                }}
                placeholder="123"
                maxLength="4"
                minLength="3"
                pattern="\d{3,4}"
                required
              />
              <small style={{color: '#666', fontSize: '0.85rem'}}>
                3-4 dígitos
              </small>
            </div>
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={formData.es_predeterminada}
                onChange={(e) => setFormData({...formData, es_predeterminada: e.target.checked})}
              />
              Establecer como tarjeta predeterminada
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Tarjeta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para editar tarjeta
const ModalEditarTarjeta = ({ tarjeta, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre_titular: tarjeta.nombre_titular,
    mes_expiracion: tarjeta.mes_expiracion,
    anio_expiracion: tarjeta.anio_expiracion
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await tarjetasService.actualizarTarjeta(tarjeta.tarjeta_id, {
        ...formData,
        mes_expiracion: parseInt(formData.mes_expiracion),
        anio_expiracion: parseInt(formData.anio_expiracion)
      });
      alert('Tarjeta actualizada exitosamente');
      onSuccess();
    } catch (err) {
      console.error('Error:', err);
      alert('No se pudo actualizar la tarjeta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Editar Tarjeta</h2>
        <p className="modal-subtitle">•••• •••• •••• {tarjeta.ultimos_digitos}</p>
        
        <form onSubmit={handleSubmit} className="tarjeta-form">
          <div className="form-group">
            <label>Nombre del Titular</label>
            <input
              type="text"
              value={formData.nombre_titular}
              onChange={(e) => setFormData({...formData, nombre_titular: e.target.value})}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mes de Expiración</label>
              <select 
                value={formData.mes_expiracion}
                onChange={(e) => setFormData({...formData, mes_expiracion: e.target.value})}
                required
              >
                {Array.from({length: 12}, (_, i) => i + 1).map(mes => (
                  <option key={mes} value={mes}>{mes.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Año de Expiración</label>
              <select 
                value={formData.anio_expiracion}
                onChange={(e) => setFormData({...formData, anio_expiracion: e.target.value})}
                required
              >
                {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(anio => (
                  <option key={anio} value={anio}>{anio}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MisTarjetas;
