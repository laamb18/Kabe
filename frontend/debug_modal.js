// Script para pruebas del modal de productos
// Este archivo se puede usar para testear funcionalidades

// Función para simular datos de producto
const mockProductData = {
  producto_id: 1,
  codigo_producto: "SIL001",
  nombre: "Silla Elegante para Eventos",
  descripcion: "Silla plegable ideal para todo tipo de eventos, cómoda y elegante. Perfecta para bodas, conferencias y celebraciones especiales.",
  precio_por_dia: 15.50,
  stock_total: 50,
  stock_disponible: 35,
  estado: "disponible",
  especificaciones: "Silla plegable de plástico color negro con respaldo alto y asiento acolchado",
  dimensiones: "42cm x 44cm x 81cm",
  peso: 2.5,
  imagen_url: "/images/silla.jpg",
  requiere_deposito: true,
  deposito_cantidad: 25.00,
  fecha_creacion: "2024-01-15T10:30:00Z",
  fecha_actualizacion: "2024-01-15T10:30:00Z"
};

// Función para probar la API de productos
const testProductAPI = async (productId) => {
  try {
    console.log(`🔍 Probando API para producto ID: ${productId}`);
    
    const response = await fetch(`http://localhost:8001/api/v1/productos/${productId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Datos del producto:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error al obtener producto:', error);
    return null;
  }
};

// Función para validar estructura de datos del producto
const validateProductData = (product) => {
  const requiredFields = [
    'producto_id', 'nombre', 'precio_por_dia', 'stock_disponible', 'estado'
  ];
  
  const missingFields = requiredFields.filter(field => !product[field] && product[field] !== 0);
  
  if (missingFields.length > 0) {
    console.warn('⚠️ Campos faltantes:', missingFields);
    return false;
  }
  
  console.log('✅ Estructura de producto válida');
  return true;
};

// Función para formatear precio
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

// Función para formatear fechas
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha no disponible';
  }
};

// Función para simular carga de imagen
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Funciones de utilidad para el modal
const modalUtils = {
  // Prevenir scroll del body cuando el modal está abierto
  lockBodyScroll: () => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px'; // Compensar por scrollbar
  },
  
  // Restaurar scroll del body
  unlockBodyScroll: () => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  },
  
  // Detectar si el usuario está en dispositivo táctil
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
  
  // Generar ID único para elementos
  generateId: () => {
    return `modal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Log de configuración para debugging
console.log('🚀 Debug Utils para ProductDetailModal cargado');
console.log('📱 Dispositivo táctil:', modalUtils.isTouchDevice());
console.log('🖥️ Tamaño de pantalla:', {
  width: window.innerWidth,
  height: window.innerHeight
});

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.productModalUtils = {
    mockProductData,
    testProductAPI,
    validateProductData,
    formatPrice,
    formatDate,
    preloadImage,
    modalUtils
  };
}

export {
  mockProductData,
  testProductAPI,
  validateProductData,
  formatPrice,
  formatDate,
  preloadImage,
  modalUtils
};