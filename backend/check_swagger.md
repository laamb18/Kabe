# Verificación de Swagger

## Pasos para diagnosticar el error 422:

1. Abre tu navegador en: http://localhost:8001/docs

2. Busca el endpoint: `PUT /api/v1/me/profile`

3. Haz clic en "Try it out"

4. Verifica qué campos espera el endpoint en el schema

5. El schema debería mostrar:
```json
{
  "nombre": "string",
  "apellido": "string",
  "telefono": "string",
  "direccion": "string"
}
```

6. Todos los campos son opcionales (Optional)

## Si el error persiste:

El problema puede ser que el frontend está enviando datos en un formato incorrecto o con campos adicionales.

Abre la consola del navegador (F12) y ve a la pestaña "Network" para ver exactamente qué datos se están enviando.
