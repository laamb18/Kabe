console.log("Debugging FormData...");

// Simular los datos que se envían desde el frontend
const formData = {
  categoria_id: '1',
  codigo_producto: 'TEST001',
  nombre: 'Producto Test',
  descripcion: 'Descripción test',
  precio_por_dia: '50.00',
  stock_total: '10',
  stock_disponible: '8',
  estado: 'disponible',
  especificaciones: 'Especificaciones test',
  dimensiones: '10x10x10',
  peso: '2.5',
  requiere_deposito: false,
  deposito_cantidad: '0.0'
};

// Crear FormData como lo hace el frontend
const formDataToSend = new FormData();
formDataToSend.append('categoria_id', parseInt(formData.categoria_id));
formDataToSend.append('codigo_producto', formData.codigo_producto);
formDataToSend.append('nombre', formData.nombre);
formDataToSend.append('descripcion', formData.descripcion);
formDataToSend.append('precio_por_dia', parseFloat(formData.precio_por_dia));
formDataToSend.append('stock_total', parseInt(formData.stock_total));
formDataToSend.append('stock_disponible', parseInt(formData.stock_disponible));
formDataToSend.append('estado', formData.estado);
formDataToSend.append('especificaciones', formData.especificaciones || '');
formDataToSend.append('dimensiones', formData.dimensiones || '');
formDataToSend.append('peso', formData.peso ? parseFloat(formData.peso) : 0);
formDataToSend.append('requiere_deposito', formData.requiere_deposito);
formDataToSend.append('deposito_cantidad', formData.deposito_cantidad ? parseFloat(formData.deposito_cantidad) : 0);

console.log("FormData entries:");
for (let [key, value] of formDataToSend.entries()) {
  console.log(`${key}: ${value} (type: ${typeof value})`);
}

// Test con fetch
async function testFormSubmit() {
  try {
    const response = await fetch('http://localhost:8001/api/v1/admin/productos/form', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE', // Reemplazar con token real
      },
      body: formDataToSend
    });
    
    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Descomenta para probar:
// testFormSubmit();