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
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
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
  
  // Actualizar producto
  update: (productId, productData) => authenticatedRequest(`/admin/productos/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }, true),
  
  // Eliminar producto
  delete: (productId) => authenticatedRequest(`/admin/productos/${productId}`, {
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