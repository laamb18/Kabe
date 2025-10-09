// Configuración base para la API
const API_BASE_URL = 'http://localhost:8000/api/v1';

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