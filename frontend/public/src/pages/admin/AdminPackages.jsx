import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService, adminPackagesService } from '../../services/api';
import { showSuccessMessage, showErrorMessage } from '../../utils/notifications';
import '../../styles/pages/AdminPackages.css';

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    codigo_paquete: '',
    nombre: '',
    descripcion: '',
    precio_por_dia: '',
    descuento_porcentaje: '',
    imagen_url: '',
    capacidad_personas: '',
    activo: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminAuthService.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    
    loadPackages();
  }, [navigate]);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await adminPackagesService.getAll();
      setPackages(data);
    } catch (err) {
      setError(err.message || 'Error al cargar paquetes');
      if (err.message.includes('401')) {
        adminAuthService.logout();
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores anteriores
    
    try {
      // Validaciones básicas
      if (!formData.codigo_paquete || !formData.nombre || !formData.precio_por_dia) {
        const errorMsg = 'Por favor completa todos los campos requeridos';
        setError(errorMsg);
        showErrorMessage(errorMsg);
        return;
      }

      if (parseFloat(formData.precio_por_dia) <= 0) {
        const errorMsg = 'El precio por día debe ser mayor a 0';
        setError(errorMsg);
        showErrorMessage(errorMsg);
        return;
      }

      if (formData.descuento_porcentaje && (parseFloat(formData.descuento_porcentaje) < 0 || parseFloat(formData.descuento_porcentaje) > 100)) {
        const errorMsg = 'El descuento debe estar entre 0 y 100%';
        setError(errorMsg);
        showErrorMessage(errorMsg);
        return;
      }

      if (formData.capacidad_personas && parseInt(formData.capacidad_personas) <= 0) {
        const errorMsg = 'La capacidad de personas debe ser mayor a 0';
        setError(errorMsg);
        showErrorMessage(errorMsg);
        return;
      }

      const packageData = {
        ...formData,
        precio_por_dia: parseFloat(formData.precio_por_dia),
        descuento_porcentaje: formData.descuento_porcentaje ? parseFloat(formData.descuento_porcentaje) : 0,
        capacidad_personas: formData.capacidad_personas ? parseInt(formData.capacidad_personas) : null
      };

      if (editingPackage) {
        await adminPackagesService.update(editingPackage.paquete_id, packageData);
        showSuccessMessage(`Paquete "${formData.nombre}" actualizado exitosamente`);
      } else {
        await adminPackagesService.create(packageData);
        showSuccessMessage(`Paquete "${formData.nombre}" creado exitosamente`);
      }

      setShowModal(false);
      setEditingPackage(null);
      resetForm();
      setError(''); // Limpiar error en caso de éxito
      await loadPackages(); // Usar await para asegurar que se actualice
    } catch (err) {
      console.error('Error al guardar paquete:', err);
      const errorMsg = err.message || 'Error al guardar paquete';
      setError(errorMsg);
      showErrorMessage(errorMsg);
    }
  };

  const handleEdit = (packageItem) => {
    setEditingPackage(packageItem);
    setError(''); // Limpiar errores anteriores
    
    setFormData({
      codigo_paquete: packageItem.codigo_paquete,
      nombre: packageItem.nombre,
      descripcion: packageItem.descripcion || '',
      precio_por_dia: packageItem.precio_por_dia.toString(),
      descuento_porcentaje: packageItem.descuento_porcentaje ? packageItem.descuento_porcentaje.toString() : '',
      imagen_url: packageItem.imagen_url || '',
      capacidad_personas: packageItem.capacidad_personas ? packageItem.capacidad_personas.toString() : '',
      activo: Boolean(packageItem.activo)
    });
    setShowModal(true);
  };

  const handleDelete = async (packageItem) => {
    const confirmMessage = `¿Estás seguro de que quieres eliminar el paquete "${packageItem.nombre}"?\n\nCódigo: ${packageItem.codigo_paquete}\nEsta acción cambiará el estado del paquete a "inactivo".`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setError(''); // Limpiar errores anteriores
      const response = await adminPackagesService.delete(packageItem.paquete_id);
      
      // Mostrar mensaje de éxito
      const successMessage = response.message || `Paquete "${packageItem.nombre}" eliminado exitosamente`;
      showSuccessMessage(successMessage);
      
      await loadPackages(); // Recargar la lista de paquetes
    } catch (err) {
      console.error('Error al eliminar paquete:', err);
      const errorMsg = err.message || 'Error al eliminar paquete';
      setError(errorMsg);
      showErrorMessage(errorMsg);
    }
  };

  const resetForm = () => {
    setFormData({
      codigo_paquete: '',
      nombre: '',
      descripcion: '',
      precio_por_dia: '',
      descuento_porcentaje: '',
      imagen_url: '',
      capacidad_personas: '',
      activo: true
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner-large">🔄</div>
          <p>Cargando paquetes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="header-top">
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="dashboard-back-button"
          >
            Dashboard
          </button>
        </div>
        <div className="header-content">
          <h1>Gestión de Paquetes</h1>
          <div className="header-actions">
            <button 
              onClick={() => {
                resetForm();
                setEditingPackage(null);
                setShowModal(true);
              }}
              className="add-button"
            >
              + Nuevo Paquete
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-message">
          <div>
            <span className="error-icon">⚠️</span>
            {error}
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        </div>
      )}

      <div className="packages-container">
        <div className="packages-grid">
          {packages.map(packageItem => (
            <div key={packageItem.paquete_id} className="package-card">
              <div className="package-image">
                {packageItem.imagen_url ? (
                  <img src={packageItem.imagen_url} alt={packageItem.nombre} />
                ) : (
                  <div className="no-image"></div>
                )}
              </div>
              
              <div className="package-content">
                <div className="package-header">
                  <h3>{packageItem.nombre}</h3>
                  <span className={`status-badge ${packageItem.activo ? 'active' : 'inactive'}`}>
                    {packageItem.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <p className="package-code">Código: {packageItem.codigo_paquete}</p>
                <p className="package-description">{packageItem.descripcion || 'Sin descripción'}</p>
                
                <div className="package-details">
                  <div className="detail-item">
                    <span className="label">Precio/día:</span>
                    <span className="value">${packageItem.precio_por_dia}</span>
                  </div>
                  {packageItem.descuento_porcentaje > 0 && (
                    <div className="detail-item">
                      <span className="label">Descuento:</span>
                      <span className="value discount">{packageItem.descuento_porcentaje}%</span>
                    </div>
                  )}
                  {packageItem.capacidad_personas && (
                    <div className="detail-item">
                      <span className="label">Capacidad:</span>
                      <span className="value">{packageItem.capacidad_personas} personas</span>
                    </div>
                  )}
                </div>
                
                <div className="package-meta">
                  <span className="creation-date">
                    Creado: {new Date(packageItem.fecha_creacion).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="package-actions">
                  <button 
                    onClick={() => handleEdit(packageItem)}
                    className="edit-button"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(packageItem)}
                    className="delete-button"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {packages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <h3>No hay paquetes</h3>
              <p>Crea tu primer paquete para ofrecer servicios agrupados</p>
              <button 
                onClick={() => {
                  resetForm();
                  setEditingPackage(null);
                  setShowModal(true);
                }}
                className="add-button"
              >
                + Nuevo Paquete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar paquete */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingPackage ? 'Editar Paquete' : 'Nuevo Paquete'}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="close-modal"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="package-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Código del Paquete *</label>
                  <input
                    type="text"
                    name="codigo_paquete"
                    value={formData.codigo_paquete}
                    onChange={handleInputChange}
                    required
                    placeholder="PAQ001"
                  />
                </div>
                
                <div className="form-group">
                  <label>Nombre del Paquete *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Paquete Evento Completo"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción del paquete"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio por Día *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="precio_por_dia"
                    value={formData.precio_por_dia}
                    onChange={handleInputChange}
                    required
                    placeholder="0.00"
                  />
                </div>
                
                <div className="form-group">
                  <label>Descuento (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    name="descuento_porcentaje"
                    value={formData.descuento_porcentaje}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="form-group">
                  <label>Capacidad (Personas)</label>
                  <input
                    type="number"
                    min="1"
                    name="capacidad_personas"
                    value={formData.capacidad_personas}
                    onChange={handleInputChange}
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>URL de Imagen</label>
                <input
                  type="url"
                  name="imagen_url"
                  value={formData.imagen_url}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {formData.imagen_url && (
                  <div className="image-preview">
                    <img 
                      src={formData.imagen_url} 
                      alt="Vista previa" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                  />
                  Paquete Activo (visible para usuarios)
                </label>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="cancel-button"
                >
                  Cancelar
                </button>
                <button type="submit" className="save-button">
                  {editingPackage ? 'Actualizar' : 'Crear'} Paquete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackages;