# 🏪 Sistema de Administración K´abé

Sistema completo de administración para la plataforma de renta de mobiliario K´abé, con dashboard interactivo, gestión de inventario y análisis de datos.

## 🚀 Características Principales

### 🔐 Autenticación de Administradores
- Login seguro con JWT
- Sesiones separadas de usuarios regulares
- Protección de rutas administrativas

### 📊 Dashboard Interactivo
- **Métricas en tiempo real:**
  - Total de productos, categorías y usuarios
  - Número de pedidos/rentas
- **Gráficas avanzadas con Recharts:**
  - Productos más pedidos (gráfica de barras)
  - Categorías más populares (gráfica de pastel)
- **Top 10 productos más solicitados**
- **Acciones rápidas** para navegación

### 📦 Gestión de Inventario
#### Productos
- ✅ Crear, editar y eliminar productos
- 📋 Formulario completo con todos los campos:
  - Información básica (nombre, código, descripción)
  - Precios y stock
  - Especificaciones técnicas
  - Imágenes y dimensiones
  - Gestión de depósitos
- 🔍 Vista en tarjetas con información clave
- 🏷️ Estados: Disponible, Mantenimiento, Inactivo

#### Categorías
- ✅ CRUD completo de categorías
- 🖼️ Gestión de imágenes
- 🔛 Activar/desactivar categorías
- 📅 Información de creación

### 👥 Gestión de Usuarios
- 📊 Lista completa de usuarios registrados
- 🔍 Búsqueda por nombre y email
- ✏️ Editar información de usuarios
- 🗑️ Eliminar usuarios
- 📈 Estadísticas de usuarios
- 🕐 Fechas de registro

## 🛠️ Instalación y Configuración

### 1. Backend - Dependencias
```bash
cd backend
pip install -r requirements.txt
```

### 2. Frontend - Librerías de Gráficas
```bash
cd frontend
npm install recharts
```

### 3. Crear Administrador Inicial
```bash
cd backend
python add_admin.py
```

**Credenciales por defecto:**
- 📧 Email: `admin@kabe.com`
- 🔑 Contraseña: `admin123`

⚠️ **IMPORTANTE:** Cambia estas credenciales después del primer inicio de sesión.

## 🌐 Rutas del Sistema

### Frontend
- `/admin/login` - Login de administradores
- `/admin/dashboard` - Panel principal
- `/admin/productos` - Gestión de productos
- `/admin/categorias` - Gestión de categorías
- `/admin/usuarios` - Gestión de usuarios

### Backend API
```
POST /api/v1/admin/login              # Login de administrador
GET  /api/v1/admin/me                 # Perfil del administrador
GET  /api/v1/admin/dashboard          # Datos del dashboard

# Gestión de productos
GET    /api/v1/admin/productos        # Listar todos los productos
POST   /api/v1/admin/productos        # Crear producto
PUT    /api/v1/admin/productos/:id    # Actualizar producto
DELETE /api/v1/admin/productos/:id    # Eliminar producto

# Gestión de categorías
GET    /api/v1/admin/categorias       # Listar todas las categorías
POST   /api/v1/admin/categorias       # Crear categoría
PUT    /api/v1/admin/categorias/:id   # Actualizar categoría
DELETE /api/v1/admin/categorias/:id   # Eliminar categoría

# Gestión de usuarios
GET    /api/v1/admin/usuarios         # Listar todos los usuarios
PUT    /api/v1/admin/usuarios/:id     # Actualizar usuario
DELETE /api/v1/admin/usuarios/:id     # Eliminar usuario
```

## 🎨 Tecnologías Utilizadas

### Frontend
- **React** - Framework de UI
- **Recharts** - Gráficas interactivas
- **CSS3** - Estilos modernos con gradientes y animaciones
- **React Router** - Navegación y rutas protegidas

### Backend
- **FastAPI** - API REST
- **SQLAlchemy** - ORM
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas

## 📱 Características de UX/UI

### 🎯 Diseño Responsivo
- Adaptable a dispositivos móviles
- Grids flexibles
- Navegación optimizada

### 🎨 Interfaz Moderna
- **Gradientes** y sombras suaves
- **Animaciones** fluidas
- **Iconos** intuitivos
- **Estados hover** interactivos

### 🔍 Experiencia de Usuario
- **Búsqueda** en tiempo real
- **Feedback visual** para acciones
- **Modales** para formularios
- **Mensajes de error** informativos

## 🔧 Funcionalidades Avanzadas

### 📊 Analytics y Reportes
- Productos más pedidos
- Tendencias de categorías
- Métricas de usuarios
- Estadísticas de inventario

### 🛡️ Seguridad
- Tokens JWT con expiración
- Validación de permisos
- Protección CSRF
- Sanitización de datos

### 🚀 Performance
- Lazy loading de componentes
- Optimización de imágenes
- Queries eficientes
- Cache inteligente

## 📋 TODO / Futuras Mejoras

- [ ] 📈 Reportes exportables (PDF/Excel)
- [ ] 📧 Notificaciones por email
- [ ] 🔔 Sistema de alertas en tiempo real
- [ ] 📱 App móvil para administradores
- [ ] 🤖 IA para predicción de demanda
- [ ] 🎯 Segmentación avanzada de usuarios
- [ ] 💰 Análisis de rentabilidad
- [ ] 📦 Integración con proveedores

## 🤝 Acceso Rápido

Para acceder al panel de administración, ve al footer del sitio web y haz clic en **"Admin"** (enlace discreto en la parte inferior).

## 📞 Soporte

Si tienes problemas con el sistema de administración:

1. 🔍 Verifica que el backend esté ejecutándose
2. 📊 Revisa la consola del navegador para errores
3. 🔑 Confirma las credenciales de administrador
4. 📧 Contacta al equipo de desarrollo

---

¡Ahora tienes un sistema de administración completo y profesional para K´abé! 🎉