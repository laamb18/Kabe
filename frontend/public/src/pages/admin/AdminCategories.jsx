import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService, adminCategoriesService } from '../../services/api';
import '../../styles/pages/AdminCategories.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen_url: '',
    activo: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminAuthService.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    
    loadCategories();
  }, [navigate]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminCategoriesService.getAll();
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Error al cargar categorías');
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
    
    try {
      if (editingCategory) {
        await adminCategoriesService.update(editingCategory.categoria_id, formData);
      } else {
        await adminCategoriesService.create(formData);
      }

      setShowModal(false);
      setEditingCategory(null);
      resetForm();
      loadCategories();
    } catch (err) {
      setError(err.message || 'Error al guardar categoría');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      nombre: category.nombre,
      descripcion: category.descripcion || '',
      imagen_url: category.imagen_url || '',
      activo: category.activo
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría? Esto afectará a todos los productos asociados.')) {
      return;
    }

    try {
      await adminCategoriesService.delete(categoryId);
      loadCategories();
    } catch (err) {
      setError(err.message || 'Error al eliminar categoría');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      imagen_url: '',
      activo: true
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner-large">🔄</div>
          <p>Cargando categorías...</p>
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
          <h1>Gestión de Categorías</h1>
          <div className="header-actions">
            <button 
              onClick={() => {
                resetForm();
                setEditingCategory(null);
                setShowModal(true);
              }}
              className="add-button"
            >
              + Nueva Categoría
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-message">
          <div>
            <span className="error-icon">!</span>
            {error}
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        </div>
      )}

      <div className="categories-container">
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.categoria_id} className="category-card">
              <div className="category-image">
                {category.imagen_url ? (
                  <img src={category.imagen_url} alt={category.nombre} />
                ) : (
                  <div className="no-image">C</div>
                )}
              </div>
              
              <div className="category-content">
                <div className="category-header">
                  <h3>{category.nombre}</h3>
                  <span className={`status-badge ${category.activo ? 'active' : 'inactive'}`}>
                    {category.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                
                <p className="category-description">
                  {category.descripcion || 'Sin descripción'}
                </p>
                
                <div className="category-meta">
                  <span className="creation-date">
                    Creada: {new Date(category.fecha_creacion).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="category-actions">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="edit-button"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(category.categoria_id)}
                    className="delete-button"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {categories.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">C</div>
              <h3>No hay categorías</h3>
              <p>Crea tu primera categoría para organizar tus productos</p>
              <button 
                onClick={() => {
                  resetForm();
                  setEditingCategory(null);
                  setShowModal(true);
                }}
                className="add-button"
              >
                + Nueva Categoría
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar categoría */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="close-modal"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label>Nombre de la Categoría *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Sillas, Mesas, Decoración"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción de la categoría"
                  rows="4"
                />
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
                  Categoría Activa (visible para usuarios)
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
                  {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;