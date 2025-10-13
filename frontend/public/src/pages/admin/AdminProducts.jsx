import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService, adminProductsService, adminCategoriesService } from '../../services/api';
import { showSuccessMessage, showErrorMessage } from '../../utils/notifications';
import '../../styles/pages/AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    categoria_id: '',
    codigo_producto: '',
    nombre: '',
    descripcion: '',
    precio_por_dia: '',
    stock_total: '',
    stock_disponible: '',
    estado: 'disponible',
    especificaciones: '',
    dimensiones: '',
    peso: '',
    imagen_url: '',
    requiere_deposito: false,
    deposito_cantidad: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminAuthService.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        adminProductsService.getAll(),
        adminCategoriesService.getAll()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
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
      if (!formData.categoria_id || !formData.codigo_producto || !formData.nombre || !formData.precio_por_dia) {
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

      if (parseInt(formData.stock_total) < 0 || parseInt(formData.stock_disponible) < 0) {
        const errorMsg = 'El stock no puede ser negativo';
        setError(errorMsg);
        showErrorMessage(errorMsg);
        return;
      }

      if (parseInt(formData.stock_disponible) > parseInt(formData.stock_total)) {
        const errorMsg = 'El stock disponible no puede ser mayor al stock total';
        setError(errorMsg);
        showErrorMessage(errorMsg);
        return;
      }

      const productData = {
        ...formData,
        categoria_id: parseInt(formData.categoria_id),
        precio_por_dia: parseFloat(formData.precio_por_dia),
        stock_total: parseInt(formData.stock_total),
        stock_disponible: parseInt(formData.stock_disponible),
        peso: formData.peso ? parseFloat(formData.peso) : null,
        deposito_cantidad: formData.deposito_cantidad ? parseFloat(formData.deposito_cantidad) : null,
        // Asegurar que especificaciones sea string si está vacío
        especificaciones: formData.especificaciones || null
      };

      if (editingProduct) {
        await adminProductsService.update(editingProduct.producto_id, productData);
        showSuccessMessage(`Producto "${formData.nombre}" actualizado exitosamente`);
      } else {
        await adminProductsService.create(productData);
        showSuccessMessage(`Producto "${formData.nombre}" creado exitosamente`);
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      setError(''); // Limpiar error en caso de éxito
      await loadData(); // Usar await para asegurar que se actualice
    } catch (err) {
      console.error('Error al guardar producto:', err);
      const errorMsg = err.message || 'Error al guardar producto';
      setError(errorMsg);
      showErrorMessage(errorMsg);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setError(''); // Limpiar errores anteriores
    
    setFormData({
      categoria_id: product.categoria_id.toString(),
      codigo_producto: product.codigo_producto,
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      precio_por_dia: product.precio_por_dia.toString(),
      stock_total: product.stock_total.toString(),
      stock_disponible: product.stock_disponible.toString(),
      estado: product.estado,
      especificaciones: product.especificaciones || '',
      dimensiones: product.dimensiones || '',
      peso: product.peso ? product.peso.toString() : '',
      imagen_url: product.imagen_url || '',
      requiere_deposito: Boolean(product.requiere_deposito),
      deposito_cantidad: product.deposito_cantidad ? product.deposito_cantidad.toString() : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (product) => {
    const confirmMessage = `¿Estás seguro de que quieres eliminar el producto "${product.nombre}"?\n\nCódigo: ${product.codigo_producto}\nEsta acción cambiará el estado del producto a "inactivo".`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setError(''); // Limpiar errores anteriores
      const response = await adminProductsService.delete(product.producto_id);
      
      // Mostrar mensaje de éxito
      const successMessage = response.message || `Producto "${product.nombre}" eliminado exitosamente`;
      showSuccessMessage(successMessage);
      
      await loadData(); // Recargar la lista de productos
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      const errorMsg = err.message || 'Error al eliminar producto';
      setError(errorMsg);
      showErrorMessage(errorMsg);
    }
  };

  const resetForm = () => {
    setFormData({
      categoria_id: '',
      codigo_producto: '',
      nombre: '',
      descripcion: '',
      precio_por_dia: '',
      stock_total: '',
      stock_disponible: '',
      estado: 'disponible',
      especificaciones: '',
      dimensiones: '',
      peso: '',
      imagen_url: '',
      requiere_deposito: false,
      deposito_cantidad: ''
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner-large">🔄</div>
          <p>Cargando productos...</p>
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
          <h1>Gestión de Productos</h1>
          <div className="header-actions">
            <button 
              onClick={() => {
                resetForm();
                setEditingProduct(null);
                setShowModal(true);
              }}
              className="add-button"
            >
              + Nuevo Producto
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

      <div className="products-container">
        <div className="products-grid">
          {products.map(product => (
            <div key={product.producto_id} className="product-card">
              <div className="product-image">
                {product.imagen_url ? (
                  <img src={product.imagen_url} alt={product.nombre} />
                ) : (
                  <div className="no-image">📦</div>
                )}
              </div>
              
              <div className="product-content">
                <div className="product-header">
                  <h3>{product.nombre}</h3>
                  <span className={`status-badge ${product.estado}`}>
                    {product.estado}
                  </span>
                </div>
                
                <p className="product-code">Código: {product.codigo_producto}</p>
                <p className="product-description">{product.descripcion}</p>
                
                <div className="product-details">
                  <div className="detail-item">
                    <span className="label">Precio/día:</span>
                    <span className="value">${product.precio_por_dia}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Stock:</span>
                    <span className="value">{product.stock_disponible}/{product.stock_total}</span>
                  </div>
                </div>
                
                <div className="product-actions">
                  <button 
                    onClick={() => handleEdit(product)}
                    className="edit-button"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(product)}
                    className="delete-button"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para crear/editar producto */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="close-modal"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    name="categoria_id"
                    value={formData.categoria_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(cat => (
                      <option key={cat.categoria_id} value={cat.categoria_id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Código del Producto *</label>
                  <input
                    type="text"
                    name="codigo_producto"
                    value={formData.codigo_producto}
                    onChange={handleInputChange}
                    required
                    placeholder="P001"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nombre del Producto *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Nombre del producto"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción del producto"
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
                  <label>Stock Total *</label>
                  <input
                    type="number"
                    name="stock_total"
                    value={formData.stock_total}
                    onChange={handleInputChange}
                    required
                    placeholder="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>Stock Disponible *</label>
                  <input
                    type="number"
                    name="stock_disponible"
                    value={formData.stock_disponible}
                    onChange={handleInputChange}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Peso (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="peso"
                    value={formData.peso}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Dimensiones</label>
                <input
                  type="text"
                  name="dimensiones"
                  value={formData.dimensiones}
                  onChange={handleInputChange}
                  placeholder="Largo x Ancho x Alto"
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
              </div>

              <div className="form-group">
                <label>Especificaciones</label>
                <textarea
                  name="especificaciones"
                  value={formData.especificaciones}
                  onChange={handleInputChange}
                  placeholder="Especificaciones técnicas"
                  rows="3"
                />
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="requiere_deposito"
                    checked={formData.requiere_deposito}
                    onChange={handleInputChange}
                  />
                  Requiere Depósito
                </label>
              </div>

              {formData.requiere_deposito && (
                <div className="form-group">
                  <label>Cantidad del Depósito</label>
                  <input
                    type="number"
                    step="0.01"
                    name="deposito_cantidad"
                    value={formData.deposito_cantidad}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="cancel-button"
                >
                  Cancelar
                </button>
                <button type="submit" className="save-button">
                  {editingProduct ? 'Actualizar' : 'Crear'} Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;