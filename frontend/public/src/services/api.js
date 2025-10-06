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
      throw new Error(`HTTP error! status: ${response.status}`);
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