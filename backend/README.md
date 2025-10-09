# K'ABÉ Rental System - Backend API

Sistema de gestión de renta de mobiliario para eventos desarrollado con FastAPI.

## 🚀 Características

- **API RESTful** con FastAPI
- **Base de datos MySQL** con SQLAlchemy ORM
- **Autenticación JWT** con bcrypt
- **Documentación automática** con Swagger/OpenAPI
- **CORS configurado** para desarrollo frontend
- **Validación de datos** con Pydantic

## 📁 Estructura del Proyecto

```
backend/
├── app/                    # Aplicación principal
│   ├── api/               # Endpoints de la API
│   │   └── v1/           # Versión 1 de la API
│   ├── core/             # Configuraciones centrales
│   ├── crud/             # Operaciones de base de datos
│   ├── models/           # Modelos de SQLAlchemy
│   ├── schemas/          # Esquemas de Pydantic
│   └── utils/            # Utilidades
├── alembic/              # Migraciones de base de datos
├── config/               # Configuraciones adicionales
├── tests/                # Pruebas unitarias
├── .env                  # Variables de entorno
├── requirements.txt      # Dependencias
└── run.py               # Script de inicio del servidor
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Python 3.12+
- MySQL 8.0+
- pip

### 1. Instalar dependencias
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configurar base de datos
1. Crea una base de datos MySQL llamada `kabe_rental_system`
2. Configura las credenciales en el archivo `.env`

### 3. Configurar variables de entorno
El archivo `.env` debe contener:
```env
# Base de datos
DATABASE_URL=mysql+pymysql://usuario:contraseña@localhost:3306/kabe_rental_system
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=kabe_rental_system

# Seguridad
SECRET_KEY=tu_clave_secreta_muy_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Servidor
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS (puertos del frontend)
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"]
```

## 🚀 Ejecución

### Desarrollo
```bash
python run.py
```

El servidor estará disponible en:
- **API**: http://localhost:8000
- **Documentación**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📚 API Endpoints

### Autenticación
- `POST /api/v1/register` - Registrar nuevo usuario
- `POST /api/v1/login` - Iniciar sesión
- `GET /api/v1/me` - Obtener usuario actual

### Categorías
- `GET /api/v1/categorias` - Listar categorías
- `GET /api/v1/categorias/{id}` - Obtener categoría por ID

### Productos
- `GET /api/v1/productos` - Listar productos
- `GET /api/v1/productos/{id}` - Obtener producto por ID
- `GET /api/v1/productos/categoria/{categoria_id}` - Productos por categoría
- `GET /api/v1/productos-con-categoria` - Productos con info de categoría

### Sistema
- `GET /` - Información básica de la API
- `GET /health` - Estado del servidor y BD
- `GET /test-db` - Prueba detallada de conexión a BD

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación:

1. **Registro**: Crear cuenta con email y contraseña
2. **Login**: Obtener token de acceso
3. **Autorización**: Incluir token en header `Authorization: Bearer <token>`

## 📊 Base de Datos

### Tablas principales:
- `usuarios` - Información de usuarios registrados
- `categorias` - Categorías de productos
- `productos` - Catálogo de productos disponibles
- `paquetes` - Paquetes predefinidos de productos

## 🧪 Testing

```bash
# Ejecutar pruebas
pytest tests/

# Health check
curl http://localhost:8000/health
```

## 📝 Logs

Los logs del servidor incluyen:
- Conexiones a la base de datos
- Requests HTTP
- Errores de autenticación
- Operaciones CRUD

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

Desarrollado por el equipo de K'ABÉ Rental Solutions.

---

Para más información, consulta la [documentación completa](http://localhost:8000/docs) cuando el servidor esté ejecutándose.