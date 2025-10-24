# Modal de Detalles del Producto

## 🎯 Funcionalidad

El modal de detalles del producto proporciona una vista expandida y enfocada de cualquier producto, con fondo difuminado para centrar la atención del usuario.

## ✨ Características

### 🔍 **Vista Detallada**
- **Imagen ampliada**: Muestra la imagen del producto en alta resolución
- **Información completa**: Todos los detalles del producto en un formato fácil de leer
- **Especificaciones técnicas**: Dimensiones, peso, stock, etc.
- **Precios formateados**: En pesos colombianos con formato local

### 🎨 **Experiencia Visual**
- **Fondo difuminado**: Backdrop blur de 10px para enfocar la atención
- **Animaciones suaves**: Transiciones con cubic-bezier para fluidez
- **Diseño responsivo**: Se adapta a diferentes tamaños de pantalla
- **Colores del proyecto**: Utiliza la paleta de K'abé (#AB4B02, #22A89D)

### ♿ **Accesibilidad**
- **Navegación por teclado**: ESC para cerrar, TAB para navegar
- **Prevención de scroll**: Bloquea el scroll del body cuando está abierto
- **Compensación de scrollbar**: Evita el "salto" al abrir/cerrar
- **Estados de focus**: Indicadores visuales claros

## 🚀 Uso del Componente

### Importar
```jsx
import ProductDetailModal from './ProductDetailModal';
```

### Implementar
```jsx
const [showModal, setShowModal] = useState(false);

<ProductDetailModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  productId={productId}
/>
```

### Props
- **`isOpen`**: Boolean - Controla si el modal está visible
- **`onClose`**: Function - Callback para cerrar el modal
- **`productId`**: Number - ID del producto a mostrar

## 🔧 Integración

### En ProductCard
El componente `ProductCard` ya incluye la integración:
- Botón "Detalles" abre el modal
- Se previene la propagación de eventos
- Manejo del estado local del modal

### API Integration
El modal hace una llamada automática a:
```
GET /api/v1/productos/{productId}
```

## 📱 Estados del Modal

### 🔄 **Cargando**
- Spinner animado
- Mensaje de "Cargando detalles..."
- Deshabilitación de interacciones

### ✅ **Éxito**
- Imagen del producto con lazy loading
- Información completa y formateada
- Botones de acción disponibles

### ❌ **Error**
- Mensaje de error claro
- Botón "Reintentar" funcional
- Fallback a imagen por defecto

### 📦 **Sin Stock**
- Indicadores visuales de "Sin stock"
- Botones deshabilitados apropiadamente
- Colores diferenciados

## 🎨 Personalización de Estilos

### Variables CSS Principales
```css
--primary-orange: #AB4B02;
--primary-teal: #22A89D;
--blur-amount: 10px;
--modal-border-radius: 20px;
--animation-duration: 0.4s;
```

### Clases Modificables
- `.product-detail-modal-overlay` - Fondo y blur
- `.product-detail-modal` - Contenedor principal
- `.product-detail-content` - Layout interno
- `.product-detail-btn` - Estilos de botones

## 📊 Información Mostrada

### 📋 **Datos Básicos**
- Código del producto
- Nombre completo
- Estado (disponible/mantenimiento/inactivo)
- Descripción detallada

### 💰 **Precios**
- Precio por día (formateado en COP)
- Depósito requerido (si aplica)
- Formato: $15.500 COP

### 📐 **Especificaciones**
- Dimensiones físicas
- Peso del producto
- Especificaciones técnicas
- Materiales y características

### 📦 **Inventario**
- Stock total disponible
- Stock actualmente disponible
- Indicadores visuales de disponibilidad

### 📅 **Metadatos**
- Fecha de creación
- Última actualización
- Formato: "15 de enero de 2024"

## 🔧 Funciones de Utilidad

### Formateo de Precios
```javascript
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};
```

### Formateo de Fechas
```javascript
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
```

## 🎯 Casos de Uso

### 1. **Cliente Navegando**
- Ve productos en la galería
- Hace clic en "Detalles"
- Obtiene información completa sin salir de la página

### 2. **Comparación de Productos**
- Abre detalles de un producto
- Cierra modal (ESC o X)
- Abre detalles de otro producto
- Compara información

### 3. **Decisión de Renta**
- Ve detalles completos
- Revisa especificaciones
- Verifica disponibilidad
- Procede con "Rentar ahora"

## 🐛 Debugging

### Variables Globales de Debug
```javascript
// En consola del navegador
window.productModalUtils.testProductAPI(1);
window.productModalUtils.validateProductData(product);
```

### Logs Útiles
- Carga de productos: `console.log('Products loaded:', data)`
- Estado del modal: Visible en React DevTools
- Errores de API: En Network tab del browser

## 🔮 Posibles Mejoras Futuras

1. **Galería de imágenes**: Múltiples fotos por producto
2. **Zoom en imagen**: Funcionalidad de zoom/pan
3. **Productos relacionados**: Sugerencias al final del modal
4. **Compartir producto**: Botones de redes sociales
5. **Favoritos**: Agregar/quitar de lista de deseos
6. **Historial**: Productos vistos recientemente

## 🎉 ¡Listo para Usar!

El modal está completamente integrado y listo para producción con:
- ✅ Diseño responsive
- ✅ Accesibilidad completa  
- ✅ Manejo de errores
- ✅ Animaciones fluidas
- ✅ Integración con API
- ✅ Estilos consistentes con el proyecto