# Configuración de Base de Datos MySQL para K'ABÉ Rental System

## Pasos para configurar tu base de datos

### 1. Configurar MySQL
Asegúrate de que MySQL esté instalado y ejecutándose en tu sistema.

### 2. Crear la base de datos
Si no has importado el archivo SQL, puedes crear la base de datos ejecutando:
```sql
CREATE DATABASE IF NOT EXISTS kabe_rental_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Importar datos (si tienes el archivo SQL)
```bash
mysql -u root -p kabe_rental_system < KABE.sql
```

### 4. Configurar variables de entorno
Edita el archivo `.env` en la carpeta backend con tus credenciales:

```env
# Configuración de la base de datos MySQL
DATABASE_URL=mysql+pymysql://tu_usuario:tu_password@localhost:3306/kabe_rental_system
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=kabe_rental_system

# Configuración de seguridad (cambia por valores seguros)
SECRET_KEY=tu_clave_secreta_muy_segura_aqui_cambia_esto
```

### 5. Instalar dependencias
```bash
cd backend
pip install -r requirements.txt
```

### 6. Inicializar la base de datos (opcional)
Si quieres crear las tablas usando SQLAlchemy en lugar del archivo SQL:
```bash
python init_db.py
```

### 7. Ejecutar el servidor
```bash
python run.py
```

O usando uvicorn directamente:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 8. Verificar la conexión
Una vez que el servidor esté ejecutándose, puedes verificar:

- API principal: http://localhost:8000
- Documentación interactiva: http://localhost:8000/docs
- Estado de salud: http://localhost:8000/health
- Prueba de base de datos: http://localhost:8000/test-db

## Estructura de la Base de Datos

Tu base de datos `kabe_rental_system` incluye las siguientes tablas principales:

- **usuarios**: Clientes del sistema
- **administradores**: Usuarios administrativos
- **categorias**: Categorías de productos
- **productos**: Inventario de productos para renta
- **paquetes**: Paquetes de productos predefinidos
- **solicitudes**: Solicitudes de renta
- **pagos**: Registro de pagos
- **inventario_historial**: Historial de movimientos de inventario
- **mantenimientos**: Registro de mantenimientos
- **configuraciones**: Configuraciones del sistema

## Comandos útiles

### Usar Alembic para migraciones (recomendado para producción)
```bash
# Inicializar Alembic (solo la primera vez)
alembic init alembic

# Crear una nueva migración
alembic revision --autogenerate -m "Descripción del cambio"

# Aplicar migraciones
alembic upgrade head

# Ver historial de migraciones
alembic history
```

### Comandos de desarrollo
```bash
# Ejecutar con reload automático
uvicorn app.main:app --reload

# Ejecutar en un puerto específico
uvicorn app.main:app --port 8001

# Ejecutar con logs detallados
uvicorn app.main:app --log-level debug
```

## Solución de problemas comunes

### Error de conexión a MySQL
1. Verifica que MySQL esté ejecutándose
2. Confirma las credenciales en el archivo `.env`
3. Asegúrate de que la base de datos existe
4. Verifica que el puerto 3306 esté disponible

### Error de dependencias
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Error de autenticación MySQL
Si tienes problemas con la autenticación, puedes usar este comando en MySQL:
```sql
ALTER USER 'tu_usuario'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_password';
FLUSH PRIVILEGES;
```