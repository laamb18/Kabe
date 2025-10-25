# 🔧 Solución al Error 404 en Endpoints de Perfil

## 🐛 Problema
Los endpoints `/api/v1/me/profile` y `/api/v1/me/password` están devolviendo **404 Not Found**:
```
INFO: 127.0.0.1:54226 - "PUT /api/v1/me/profile HTTP/1.1" 404 Not Found
INFO: 127.0.0.1:54244 - "PUT /api/v1/me/password HTTP/1.1" 404 Not Found
```

## ✅ Solución

### Paso 1: Reiniciar el Servidor Backend

El servidor backend necesita reiniciarse para reconocer los nuevos endpoints.

**En Windows (CMD):**
```bash
# 1. Detener el servidor actual (Ctrl + C en la terminal donde corre)

# 2. Navegar al directorio backend
cd backend

# 3. Reiniciar el servidor
python run.py
```

**O con uvicorn directamente:**
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

### Paso 2: Verificar que el Servidor Esté Corriendo

Abre tu navegador y ve a:
- http://localhost:8001/docs

Deberías ver los endpoints `/me/profile` y `/me/password` en la documentación de Swagger.

### Paso 3: Probar los Endpoints

**Opción A: Usar el script de prueba**
```bash
cd backend
python test_profile_endpoints.py
```

**Opción B: Usar la documentación de Swagger**
1. Ve a http://localhost:8001/docs
2. Busca los endpoints:
   - `PUT /api/v1/me/profile`
   - `PUT /api/v1/me/password`
3. Haz clic en "Try it out" y prueba

**Opción C: Usar curl**
```bash
# Primero, obtén un token haciendo login
curl -X POST "http://localhost:8001/api/v1/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","password":"tupassword"}'

# Luego, usa el token para actualizar el perfil
curl -X PUT "http://localhost:8001/api/v1/me/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{"nombre":"Test","apellido":"Usuario","telefono":"123456","direccion":"Calle 123"}'
```

## 🔍 Verificación

Después de reiniciar el servidor, deberías ver en los logs algo como:
```
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
```

Y cuando hagas una petición exitosa:
```
INFO:     127.0.0.1:XXXXX - "PUT /api/v1/me/profile HTTP/1.1" 200 OK
```

## 📝 Endpoints Disponibles

Después del reinicio, estos endpoints deberían funcionar:

### GET /api/v1/me
Obtener información del usuario actual
```
Headers: Authorization: Bearer <token>
Response: UsuarioResponse
```

### PUT /api/v1/me/profile
Actualizar perfil del usuario
```
Headers: Authorization: Bearer <token>
Body: {
  "nombre": "string",
  "apellido": "string",
  "telefono": "string",
  "direccion": "string"
}
Response: UsuarioResponse
```

### PUT /api/v1/me/password
Cambiar contraseña del usuario
```
Headers: Authorization: Bearer <token>
Body: {
  "current_password": "string",
  "new_password": "string"
}
Response: {"message": "Contraseña actualizada exitosamente"}
```

## 🚨 Si el Problema Persiste

### 1. Verifica que el archivo endpoints.py tenga los decoradores

Abre `backend/app/api/v1/endpoints.py` y busca:
```python
@router.put("/me/profile", response_model=UsuarioResponse)
def update_my_profile(...):
    ...

@router.put("/me/password")
def change_my_password(...):
    ...
```

### 2. Verifica que el router esté incluido en main.py

Abre `backend/app/main.py` y verifica:
```python
from app.api.v1.endpoints import router as api_router
...
app.include_router(api_router, prefix="/api/v1", tags=["API v1"])
```

### 3. Verifica el puerto

El frontend debe apuntar al mismo puerto donde corre el backend:
- En `frontend/public/src/services/api.js`:
  ```javascript
  const API_BASE_URL = 'http://localhost:8001/api/v1';
  ```

### 4. Limpia el caché y reinicia todo

```bash
# Terminal 1: Backend
cd backend
python run.py

# Terminal 2: Frontend
cd frontend
npm run dev
```

## ✅ Checklist de Verificación

- [ ] Servidor backend reiniciado
- [ ] Endpoints visibles en http://localhost:8001/docs
- [ ] Frontend apuntando al puerto correcto (8001)
- [ ] Token de autenticación válido
- [ ] Navegador con caché limpiado (Ctrl + Shift + R)

## 🎉 Resultado Esperado

Después de seguir estos pasos, deberías poder:
- ✅ Editar tu perfil desde la página de usuario
- ✅ Cambiar tu contraseña
- ✅ Ver notificaciones de éxito
- ✅ Ver los cambios reflejados inmediatamente

¡El sistema de perfil debería funcionar perfectamente! 🚀
