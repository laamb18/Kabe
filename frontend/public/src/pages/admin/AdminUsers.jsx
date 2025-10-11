import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService, adminUsersService } from '../../services/api';
import '../../styles/pages/AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    password: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminAuthService.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    
    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminUsersService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
      if (err.message.includes('401')) {
        adminAuthService.logout();
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userData = { ...formData };
      
      // No enviar contraseña vacía en actualizaciones
      if (editingUser && !userData.password) {
        delete userData.password;
      }

      if (editingUser) {
        await adminUsersService.update(editingUser.usuario_id, userData);
      }

      setShowModal(false);
      setEditingUser(null);
      resetForm();
      loadUsers();
    } catch (err) {
      setError(err.message || 'Error al guardar usuario');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono || '',
      direccion: user.direccion || '',
      password: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await adminUsersService.delete(userId);
      loadUsers();
    } catch (err) {
      setError(err.message || 'Error al eliminar usuario');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      password: ''
    });
  };

  // Filtrar usuarios por término de búsqueda
  const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner-large">🔄</div>
          <p>Cargando usuarios...</p>
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
          <h1>Gestión de Usuarios</h1>
          <div className="header-actions">
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

      <div className="users-container">
        {/* Barra de búsqueda y stats */}
        <div className="users-toolbar">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Buscar usuarios por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="users-stats">
            <span className="stat-badge">
              Total: {users.length} usuarios
            </span>
            <span className="stat-badge">
              Mostrando: {filteredUsers.length}
            </span>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.usuario_id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                      </div>
                      <div className="user-details">
                        <span className="user-name">
                          {user.nombre} {user.apellido}
                        </span>
                        <span className="user-id">ID: {user.usuario_id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="email-cell">
                      <span className="email">{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="phone">
                      {user.telefono || 'No especificado'}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <span className="date">
                        {new Date(user.fecha_registro).toLocaleDateString()}
                      </span>
                      <span className="time">
                        {new Date(user.fecha_registro).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="edit-btn"
                        title="Editar usuario"
                      >
                        E
                      </button>
                      <button 
                        onClick={() => handleDelete(user.usuario_id)}
                        className="delete-btn"
                        title="Eliminar usuario"
                      >
                        D
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="empty-table">
              <div className="empty-icon">U</div>
              <h3>No se encontraron usuarios</h3>
              <p>
                {searchTerm 
                  ? `No hay usuarios que coincidan con "${searchTerm}"`
                  : 'No hay usuarios registrados en el sistema'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para editar usuario */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Editar Usuario</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="close-modal"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Nombre del usuario"
                  />
                </div>
                
                <div className="form-group">
                  <label>Apellido *</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                    placeholder="Apellido del usuario"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="email@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Dirección completa del usuario"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Nueva Contraseña (opcional)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Dejar vacío para mantener la actual"
                />
                <small className="form-help">
                  Solo completa este campo si quieres cambiar la contraseña del usuario
                </small>
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
                  Actualizar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;