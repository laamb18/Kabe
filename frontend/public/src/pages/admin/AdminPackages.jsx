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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    codigo_paquete: '',
    nombre: '',
    descripcion: '',
    precio_por_dia: '',
    descuento_porcentaje: '',
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
      
      console.log('Packages data received:', data);
      console.log('First package with image check:', {
        package: data[0],
        hasImageUrl: data[0]?.imagen_url ? 'YES' : 'NO',
        imageUrlLength: data[0]?.imagen_url?.length || 0,
        imageUrlPreview: data[0]?.imagen_url?.substring(0, 100) || 'N/A'
      });
      
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        showErrorMessage('Tipo de archivo no permitido. Solo se permiten: JPG, PNG, GIF');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showErrorMessage('La imagen es demasiado grande. Máximo 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores anteriores
    
    try {
      console.log('Package form submission started');
      console.log('Form data:', formData);
      console.log('Image file:', imageFile);
      console.log('Editing package:', editingPackage);
      
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

      // Crear FormData para envío con archivo
      const formDataToSend = new FormData();
      formDataToSend.append('codigo_paquete', formData.codigo_paquete);
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('precio_por_dia', parseFloat(formData.precio_por_dia));
      formDataToSend.append('descuento_porcentaje', formData.descuento_porcentaje ? parseFloat(formData.descuento_porcentaje) : 0);
      formDataToSend.append('capacidad_personas', formData.capacidad_personas ? parseInt(formData.capacidad_personas) : 1);
      formDataToSend.append('activo', formData.activo);
      
      if (imageFile) {
        formDataToSend.append('imagen', imageFile);
      }

      console.log('Package FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value} (type: ${typeof value})`);
      }

      if (editingPackage) {
        console.log('Updating package with ID:', editingPackage.paquete_id);
        const result = await adminPackagesService.updateForm(editingPackage.paquete_id, formDataToSend);
        console.log('Package update result:', result);
        showSuccessMessage(`Paquete "${formData.nombre}" actualizado exitosamente`);
      } else {
        console.log('Creating new package');
        const result = await adminPackagesService.createForm(formDataToSend);
        console.log('Package create result:', result);
        showSuccessMessage(`Paquete "${formData.nombre}" creado exitosamente`);
      }

      setShowModal(false);
      setEditingPackage(null);
      resetForm();
      setError(''); // Limpiar error en caso de éxito
      console.log('Reloading packages...');
      await loadPackages(); // Usar await para asegurar que se actualice
      console.log('Packages reloaded successfully');
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
      capacidad_personas: packageItem.capacidad_personas ? packageItem.capacidad_personas.toString() : '',
      activo: Boolean(packageItem.activo)
    });
    
    // Configurar preview de imagen existente
    if (packageItem.imagen_url) {
      setImagePreview(packageItem.imagen_url);
    } else {
      setImagePreview('');
    }
    setImageFile(null);
    
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
      capacidad_personas: '',
      activo: true
    });
    setImageFile(null);
    setImagePreview('');
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
                {(() => {
                  console.log(`Package ${packageItem.nombre} image check:`, {
                    hasImageUrl: !!packageItem.imagen_url,
                    imageUrl: packageItem.imagen_url?.substring(0, 50) + '...' || 'null'
                  });
                  return packageItem.imagen_url ? (
                    <img 
                      src={packageItem.imagen_url} 
                      alt={packageItem.nombre}
                      onError={(e) => {
                        console.error('Package image failed to load:', e.target.src);
                      }}
                      onLoad={() => {
                        console.log('Package image loaded successfully for:', packageItem.nombre);
                      }}
                    />
                  ) : (
                    <div className="no-image">Sin imagen</div>
                  );
                })()}
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
                <label>Imagen del Paquete</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }}
                    />
                  </div>
                )}
                <small className="form-help">Formatos permitidos: JPG, PNG, GIF. Máximo 5MB.</small>
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