import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { tarjetasService, solicitudesService, pagosService } from '../services/api';
import '../styles/pages/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items: carrito, calcularTotal, limpiarCarrito } = useCarrito();
  
  const [paso, setPaso] = useState(1); // 1: Datos, 2: Pago, 3: Confirmación
  const [tarjetas, setTarjetas] = useState([]);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [datosEvento, setDatosEvento] = useState({
    fecha_evento_inicio: '',
    fecha_evento_fin: '',
    direccion_evento: '',
    tipo_evento: '',
    num_personas_estimado: '',
    observaciones_cliente: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    if (carrito.length === 0) {
      navigate('/carrito');
      return;
    }
    
    cargarTarjetas();
  }, [isAuthenticated, carrito, navigate]);

  const cargarTarjetas = async () => {
    try {
      const response = await tarjetasService.getMisTarjetas();
      setTarjetas(response.tarjetas);
      
      // Seleccionar tarjeta predeterminada automáticamente
      const predeterminada = response.tarjetas.find(t => t.es_predeterminada);
      if (predeterminada) {
        setTarjetaSeleccionada(predeterminada.tarjeta_id);
      }
    } catch (err) {
      console.error('Error al cargar tarjetas:', err);
    }
  };

  const handleContinuar = () => {
    if (paso === 1) {
      // Validar datos del evento
      if (!datosEvento.fecha_evento_inicio || !datosEvento.fecha_evento_fin) {
        alert('Por favor completa las fechas del evento');
        return;
      }
      setPaso(2);
    } else if (paso === 2) {
      procesarPago();
    }
  };

  const procesarPago = async () => {
    if (!tarjetaSeleccionada) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    setLoading(true);
    
    try {
      // Calcular subtotales para cada item
      const productosConSubtotal = carrito
        .filter(item => item.tipo === 'producto')
        .map(item => {
          const diasRenta = parseInt(item.diasRenta) || 1;
          const precioUnitario = parseFloat(item.precioPorDia);
          const cantidad = parseInt(item.cantidad);
          const subtotal = precioUnitario * cantidad * diasRenta;
          const depositoUnitario = parseFloat(item.deposito_cantidad || 0);
          const depositoTotal = depositoUnitario * cantidad;
          
          console.log(`📦 Producto: ${item.nombre}`, {
            producto_id: item.id,
            cantidad_solicitada: cantidad,
            precio_unitario: precioUnitario,
            dias_renta: diasRenta,
            subtotal: subtotal
          });
          
          return {
            producto_id: item.id,
            cantidad_solicitada: cantidad,
            precio_unitario: precioUnitario,
            dias_renta: diasRenta,
            subtotal: subtotal,
            deposito_unitario: depositoUnitario,
            deposito_total: depositoTotal
          };
        });

      const paquetesConSubtotal = carrito
        .filter(item => item.tipo === 'paquete')
        .map(item => {
          const diasRenta = parseInt(item.diasRenta) || 1;
          const precioUnitario = parseFloat(item.precioPorDia);
          const cantidad = parseInt(item.cantidad);
          const subtotal = precioUnitario * cantidad * diasRenta;
          
          console.log(`📦 Paquete: ${item.nombre}`, {
            paquete_id: item.id,
            cantidad_solicitada: cantidad,
            precio_unitario: precioUnitario,
            dias_renta: diasRenta,
            subtotal: subtotal
          });
          
          return {
            paquete_id: item.id,
            cantidad_solicitada: cantidad,
            precio_unitario: precioUnitario,
            dias_renta: diasRenta,
            subtotal: subtotal
          };
        });

      // Preparar datos de la solicitud
      const solicitudData = {
        fecha_evento_inicio: datosEvento.fecha_evento_inicio,
        fecha_evento_fin: datosEvento.fecha_evento_fin,
        direccion_evento: datosEvento.direccion_evento || '',
        tipo_evento: datosEvento.tipo_evento || '',
        num_personas_estimado: parseInt(datosEvento.num_personas_estimado) || 0,
        observaciones_cliente: datosEvento.observaciones_cliente || '',
        productos: productosConSubtotal,
        paquetes: paquetesConSubtotal
      };

      console.log('📤 Creando solicitud:', JSON.stringify(solicitudData, null, 2));

      // Crear solicitud
      const solicitudCreada = await solicitudesService.crearSolicitud(solicitudData);
      
      console.log('✅ Solicitud creada:', solicitudCreada);

      // Registrar el pago inicial (anticipo)
      const pagoData = {
        solicitud_id: solicitudCreada.solicitud_id,
        tipo_pago: 'anticipo',
        metodo_pago: 'tarjeta',
        monto: solicitudCreada.total_cotizacion,
        observaciones: `Pago con tarjeta terminada en ${tarjetas.find(t => t.tarjeta_id === tarjetaSeleccionada)?.ultimos_digitos}`,
        tarjeta_id: tarjetaSeleccionada
      };

      console.log('📤 Registrando pago:', pagoData);

      // Crear registro de pago
      const pagoCreado = await pagosService.crearPago(pagoData);
      
      console.log('✅ Pago registrado:', pagoCreado);
      
      // Limpiar carrito
      limpiarCarrito();
      
      // Ir a confirmación
      setPaso(3);
      
      // Redirigir a Mis Eventos después de 3 segundos
      setTimeout(() => {
        navigate('/mis-eventos');
      }, 3000);
      
    } catch (err) {
      console.error('❌ Error al procesar pago:', err);
      
      // Mejorar el mensaje de error
      let errorMessage = 'Error desconocido';
      
      if (err.response && err.response.detail) {
        // Error de validación de Pydantic
        if (Array.isArray(err.response.detail)) {
          errorMessage = err.response.detail.map(e => `${e.loc.join('.')}: ${e.msg}`).join('\n');
        } else {
          errorMessage = err.response.detail;
        }
      } else if (err.detail) {
        errorMessage = err.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.error('📋 Detalle del error:', errorMessage);
      alert('Error al procesar el pago:\n\n' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Validación temprana
  if (!carrito || carrito.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="empty-state">
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos para continuar con el checkout</p>
            <button className="btn-primary" onClick={() => navigate('/categories')}>
              Ver Productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totales = calcularTotal();
  const total = totales.total;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <h1>Finalizar Pedido</h1>
          <div className="checkout-steps">
            <div className={`step ${paso >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Datos del Evento</span>
            </div>
            <div className={`step ${paso >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Método de Pago</span>
            </div>
            <div className={`step ${paso >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Confirmación</span>
            </div>
          </div>
        </div>

        {/* Contenido según el paso */}
        <div className="checkout-content">
          {paso === 1 && (
            <div className="paso-datos">
              <h2>Información del Evento</h2>
              
              <div className="form-group">
                <label>Fecha de Inicio *</label>
                <input
                  type="date"
                  value={datosEvento.fecha_evento_inicio}
                  onChange={(e) => setDatosEvento({...datosEvento, fecha_evento_inicio: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Fecha de Fin *</label>
                <input
                  type="date"
                  value={datosEvento.fecha_evento_fin}
                  onChange={(e) => setDatosEvento({...datosEvento, fecha_evento_fin: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Dirección del Evento</label>
                <textarea
                  value={datosEvento.direccion_evento}
                  onChange={(e) => setDatosEvento({...datosEvento, direccion_evento: e.target.value})}
                  placeholder="Dirección completa donde se realizará el evento"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Evento</label>
                  <select
                    value={datosEvento.tipo_evento}
                    onChange={(e) => setDatosEvento({...datosEvento, tipo_evento: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Boda">Boda</option>
                    <option value="Cumpleaños">Cumpleaños</option>
                    <option value="Corporativo">Corporativo</option>
                    <option value="Graduación">Graduación</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Número de Personas</label>
                  <input
                    type="number"
                    value={datosEvento.num_personas_estimado}
                    onChange={(e) => setDatosEvento({...datosEvento, num_personas_estimado: e.target.value})}
                    placeholder="Estimado"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  value={datosEvento.observaciones_cliente}
                  onChange={(e) => setDatosEvento({...datosEvento, observaciones_cliente: e.target.value})}
                  placeholder="Detalles adicionales o requerimientos especiales"
                  rows="4"
                />
              </div>
            </div>
          )}

          {paso === 2 && (
            <div className="paso-pago">
              <h2>Método de Pago</h2>
              
              {tarjetas.length > 0 ? (
                <div className="tarjetas-pago">
                  {tarjetas.map(tarjeta => (
                    <div 
                      key={tarjeta.tarjeta_id}
                      className={`tarjeta-opcion ${tarjetaSeleccionada === tarjeta.tarjeta_id ? 'seleccionada' : ''}`}
                      onClick={() => setTarjetaSeleccionada(tarjeta.tarjeta_id)}
                    >
                      <input
                        type="radio"
                        name="tarjeta"
                        checked={tarjetaSeleccionada === tarjeta.tarjeta_id}
                        onChange={() => setTarjetaSeleccionada(tarjeta.tarjeta_id)}
                      />
                      <div className="tarjeta-info">
                        <div className="tarjeta-marca">{tarjeta.marca.toUpperCase()}</div>
                        <div className="tarjeta-numero">•••• {tarjeta.ultimos_digitos}</div>
                        <div className="tarjeta-titular">{tarjeta.nombre_titular}</div>
                      </div>
                      {tarjeta.es_predeterminada && (
                        <span className="badge-predeterminada">Predeterminada</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="sin-tarjetas">
                  <p>No tienes tarjetas guardadas</p>
                  <button 
                    className="btn-secondary"
                    onClick={() => navigate('/mis-tarjetas')}
                  >
                    Agregar Tarjeta
                  </button>
                </div>
              )}

              <div className="info-pago">
                <p>💳 Tu pago será procesado de forma segura</p>
                <p>🔒 Tus datos están protegidos</p>
              </div>
            </div>
          )}

          {paso === 3 && (
            <div className="paso-confirmacion">
              <div className="confirmacion-icon">✅</div>
              <h2>¡Pedido Confirmado!</h2>
              <p>Tu solicitud ha sido creada exitosamente</p>
              <p>Recibirás una confirmación por correo electrónico</p>
              <div className="confirmacion-acciones">
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/mis-eventos')}
                >
                  Ver Mis Eventos
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resumen del pedido */}
        {paso < 3 && (
          <div className="checkout-resumen">
            <h3>Resumen del Pedido</h3>
            
            <div className="resumen-items">
              {carrito.map((item, index) => (
                <div key={index} className="resumen-item">
                  <span>{item.nombre} x{item.cantidad} ({item.diasRenta} días)</span>
                  <span>${(item.precioPorDia * item.cantidad * item.diasRenta).toLocaleString('es-CO')}</span>
                </div>
              ))}
            </div>

            <div className="resumen-total">
              <span>Total</span>
              <span className="total-amount">${total.toLocaleString('es-CO')}</span>
            </div>

            <div className="checkout-acciones">
              {paso > 1 && (
                <button 
                  className="btn-secondary"
                  onClick={() => setPaso(paso - 1)}
                  disabled={loading}
                >
                  Atrás
                </button>
              )}
              <button 
                className="btn-primary"
                onClick={handleContinuar}
                disabled={loading}
              >
                {loading ? 'Procesando...' : paso === 1 ? 'Continuar' : 'Confirmar Pago'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
