// Configuración base para la API
const API_BASE_URL = 'http://localhost:8001/api/v1';

// Función helper para hacer requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Crear un error con más información
      const error = new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.detail = errorData.detail;
      error.response = errorData;
      
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Servicios para autenticación de administradores
export const adminAuthService = {
  // Iniciar sesión como administrador
  login: (email, password) => apiRequest('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  // Obtener información del administrador actual
  getCurrentAdmin: (token) => apiRequest('/admin/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }),
  
  // Verificar si hay sesión de administrador activa
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
  
  // Obtener token de administrador del localStorage
  getToken: () => {
    return localStorage.getItem('adminToken');
  },
  
  // Guardar datos de sesión de administrador
  saveSession: (loginResponse) => {
    localStorage.setItem('adminToken', loginResponse.access_token);
    localStorage.setItem('admin', JSON.stringify(loginResponse.admin));
  },
  
  // Obtener datos del administrador del localStorage
  getAdminData: () => {
    const adminData = localStorage.getItem('admin');
    return adminData ? JSON.parse(adminData) : null;
  },
  
  // Cerrar sesión de administrador
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
  }
};

// Función helper para hacer requests autenticados
const authenticatedRequest = async (endpoint, options = {}, isAdmin = false) => {
  const token = isAdmin ? adminAuthService.getToken() : authService.getToken();
  
  return apiRequest(endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
};

// Servicios para administradores - Dashboard
export const adminDashboardService = {
  // Obtener datos del dashboard
  getDashboardData: () => authenticatedRequest('/admin/dashboard', {}, true),
  
  // Debug de imágenes
  debugImages: () => authenticatedRequest('/admin/debug/images', {}, true),
};

// Servicios para administradores - Gestión de usuarios
export const adminUsersService = {
  // Obtener todos los usuarios
  getAll: (skip = 0, limit = 100) => 
    authenticatedRequest(`/admin/usuarios?skip=${skip}&limit=${limit}`, {}, true),
  
  // Actualizar usuario
  update: (userId, userData) => authenticatedRequest(`/admin/usuarios/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }, true),
  
  // Eliminar usuario
  delete: (userId) => authenticatedRequest(`/admin/usuarios/${userId}`, {
    method: 'DELETE',
  }, true),
};

// Servicios para administradores - Gestión de productos
export const adminProductsService = {
  // Obtener todos los productos (incluyendo inactivos)
  getAll: (skip = 0, limit = 100) => 
    authenticatedRequest(`/admin/productos?skip=${skip}&limit=${limit}`, {}, true),
  
  // Crear producto
  create: (productData) => authenticatedRequest('/admin/productos', {
    method: 'POST',
    body: JSON.stringify(productData),
  }, true),
  
  // Crear producto con formulario (para archivos)
  createForm: (formData) => {
    const token = adminAuthService.getToken();
    console.log('Creating product with form data:', formData);
    
    // Debug: mostrar contenido del FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    return fetch(`${API_BASE_URL}/admin/productos/form`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // FormData no necesita Content-Type
    }).then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('Error response:', errorData);
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        });
      }
      return response.json();
    });
  },
  
  // Actualizar producto
  update: (productId, productData) => authenticatedRequest(`/admin/productos/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }, true),
  
  // Actualizar producto con formulario (para archivos)
  updateForm: (productId, formData) => {
    const token = adminAuthService.getToken();
    console.log('Updating product with form data:', productId, formData);
    
    // Debug: mostrar contenido del FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    return fetch(`${API_BASE_URL}/admin/productos/${productId}/form`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // FormData no necesita Content-Type
    }).then(response => {
      console.log('Update response status:', response.status);
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('Update error response:', errorData);
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        });
      }
      return response.json();
    });
  },
  
  // Eliminar producto
  delete: (productId) => authenticatedRequest(`/admin/productos/${productId}`, {
    method: 'DELETE',
  }, true),
};

// Servicios para administradores - Gestión de paquetes
export const adminPackagesService = {
  // Obtener todos los paquetes (incluyendo inactivos)
  getAll: (skip = 0, limit = 100) => 
    authenticatedRequest(`/admin/paquetes?skip=${skip}&limit=${limit}`, {}, true),
  
  // Crear paquete
  create: (packageData) => authenticatedRequest('/admin/paquetes', {
    method: 'POST',
    body: JSON.stringify(packageData),
  }, true),
  
  // Crear paquete con formulario (para archivos)
  createForm: (formData) => {
    const token = adminAuthService.getToken();
    console.log('Creating package with form data:', formData);
    
    // Debug: mostrar contenido del FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    return fetch(`${API_BASE_URL}/admin/paquetes/form`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // FormData no necesita Content-Type
    }).then(response => {
      console.log('Package create response status:', response.status);
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('Package create error response:', errorData);
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        });
      }
      return response.json();
    });
  },
  
  // Actualizar paquete
  update: (packageId, packageData) => authenticatedRequest(`/admin/paquetes/${packageId}`, {
    method: 'PUT',
    body: JSON.stringify(packageData),
  }, true),
  
  // Actualizar paquete con formulario (para archivos)
  updateForm: (packageId, formData) => {
    const token = adminAuthService.getToken();
    console.log('Updating package with form data:', packageId, formData);
    
    // Debug: mostrar contenido del FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    return fetch(`${API_BASE_URL}/admin/paquetes/${packageId}/form`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // FormData no necesita Content-Type
    }).then(response => {
      console.log('Package update response status:', response.status);
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('Package update error response:', errorData);
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        });
      }
      return response.json();
    });
  },
  
  // Eliminar paquete
  delete: (packageId) => authenticatedRequest(`/admin/paquetes/${packageId}`, {
    method: 'DELETE',
  }, true),
};

// Servicios para administradores - Gestión de categorías
export const adminCategoriesService = {
  // Obtener todas las categorías (incluyendo inactivas)
  getAll: (skip = 0, limit = 100) => 
    authenticatedRequest(`/admin/categorias?skip=${skip}&limit=${limit}`, {}, true),
  
  // Crear categoría
  create: (categoryData) => authenticatedRequest('/admin/categorias', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  }, true),
  
  // Actualizar categoría
  update: (categoryId, categoryData) => authenticatedRequest(`/admin/categorias/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  }, true),
  
  // Eliminar categoría
  delete: (categoryId) => authenticatedRequest(`/admin/categorias/${categoryId}`, {
    method: 'DELETE',
  }, true),
};

// Servicios para paquetes
export const paquetesService = {
  // Obtener todos los paquetes
  getAll: () => apiRequest('/paquetes'),
  
  // Obtener paquete por ID
  getById: (id) => apiRequest(`/paquetes/${id}`),
  
  // Obtener paquetes activos con información detallada
  getActivos: () => apiRequest('/paquetes/activos'),
};

// Servicios para categorías
export const categoriasService = {
  // Obtener todas las categorías
  getAll: () => apiRequest('/categorias'),
  
  // Obtener categoría por ID
  getById: (id) => apiRequest(`/categorias/${id}`),
};

// Servicios para productos
export const productosService = {
  // Obtener todos los productos
  getAll: () => apiRequest('/productos'),
  
  // Obtener producto por ID
  getById: (id) => apiRequest(`/productos/${id}`),
  
  // Obtener productos por categoría
  getByCategoria: (categoriaId) => apiRequest(`/productos/categoria/${categoriaId}`),
  
  // Obtener productos con información de categoría (para mostrar en el frontend)
  getConCategoria: () => apiRequest('/productos-con-categoria'),
};

// Servicios para autenticación
export const authService = {
  // Registrar nuevo usuario
  register: (userData) => apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Iniciar sesión
  login: (email, password) => apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  // Obtener información del usuario actual
  getCurrentUser: (token) => apiRequest('/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }),
  
  // Cerrar sesión (limpiar token local)
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
  },
  
  // Verificar si hay sesión activa
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
  
  // Obtener token del localStorage
  getToken: () => {
    return localStorage.getItem('accessToken');
  },
  
  // Guardar datos de sesión
  saveSession: (loginResponse) => {
    localStorage.setItem('accessToken', loginResponse.access_token);
    localStorage.setItem('user', JSON.stringify(loginResponse.user));
  },
  
  // Obtener datos del usuario del localStorage
  getUserData: () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },
  
  // Actualizar perfil del usuario actual
  updateProfile: (profileData) => {
    const token = authService.getToken();
    console.log('📤 Enviando datos de perfil:', profileData);
    return apiRequest('/me/profile-raw', {  // Usando endpoint alternativo temporalmente
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
  },
  
  // Cambiar contraseña del usuario actual
  changePassword: (passwordData) => {
    const token = authService.getToken();
    console.log('🔐 Enviando datos de contraseña');
    return apiRequest('/me/password-raw', {  // Usando endpoint alternativo temporalmente
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });
  }
};

// Servicio combinado para obtener datos para la página principal
export const homeService = {
  // Obtener datos completos para la página principal
  getHomeData: async () => {
    try {
      const [categorias, productos] = await Promise.all([
        categoriasService.getAll(),
        productosService.getConCategoria(),
      ]);
      
      return {
        categorias,
        productos: productos.productos,
        total: productos.total,
      };
    } catch (error) {
      console.error('Error loading home data:', error);
      throw error;
    }
  },
};

// Servicios para solicitudes (eventos)
export const solicitudesService = {
  // Obtener todas las solicitudes del usuario actual
  getMisSolicitudes: () => {
    const token = authService.getToken();
    return apiRequest('/me/solicitudes', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  // Obtener detalle de una solicitud
  getSolicitudById: (solicitudId) => {
    const token = authService.getToken();
    return apiRequest(`/me/solicitudes/${solicitudId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  // Crear nueva solicitud
  crearSolicitud: (solicitudData) => {
    const token = authService.getToken();
    return apiRequest('/me/solicitudes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(solicitudData),
    });
  },
  
  // Cancelar solicitud
  cancelarSolicitud: (solicitudId) => {
    const token = authService.getToken();
    return apiRequest(`/me/solicitudes/${solicitudId}/cancelar`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Servicios para solicitudes (admin)
export const adminSolicitudesService = {
  // Obtener todas las solicitudes
  getAll: (skip = 0, limit = 100) => 
    authenticatedRequest(`/admin/solicitudes?skip=${skip}&limit=${limit}`, {}, true),
};


// ============================================
// SERVICIOS PARA TARJETAS
// ============================================
export const tarjetasService = {
  // Obtener todas las tarjetas
  getMisTarjetas: () => {
    const token = authService.getToken();
    return apiRequest('/me/tarjetas', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  
  // Crear tarjeta
  crearTarjeta: (tarjetaData) => {
    const token = authService.getToken();
    return apiRequest('/me/tarjetas', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(tarjetaData)
    });
  },
  
  // Actualizar tarjeta
  actualizarTarjeta: (tarjetaId, tarjetaData) => {
    const token = authService.getToken();
    return apiRequest(`/me/tarjetas/${tarjetaId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(tarjetaData)
    });
  },
  
  // Eliminar tarjeta
  eliminarTarjeta: (tarjetaId) => {
    const token = authService.getToken();
    return apiRequest(`/me/tarjetas/${tarjetaId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  
  // Establecer como predeterminada
  establecerPredeterminada: (tarjetaId) => {
    const token = authService.getToken();
    return apiRequest(`/me/tarjetas/${tarjetaId}/predeterminada`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};

// ============================================
// SERVICIOS PARA PAGOS
// ============================================
export const pagosService = {
  // Obtener mis pagos
  getMisPagos: () => {
    const token = authService.getToken();
    return apiRequest('/me/pagos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  
  // Obtener pagos de una solicitud
  getPagosSolicitud: (solicitudId) => {
    const token = authService.getToken();
    return apiRequest(`/me/solicitudes/${solicitudId}/pagos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  
  // Crear pago
  crearPago: (pagoData) => {
    const token = authService.getToken();
    return apiRequest('/me/pagos', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(pagoData)
    });
  }
};
