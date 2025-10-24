"""
Script para verificar qué productos tienen imágenes en la base de datos
"""
import sys
import os

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Crear conexión a la base de datos
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def check_images():
    """Verificar qué productos tienen imágenes"""
    print("\n" + "="*80)
    print("🔍 VERIFICACIÓN DE IMÁGENES EN PRODUCTOS")
    print("="*80 + "\n")
    
    with engine.connect() as conn:
        # Consulta para verificar imágenes
        query = text("""
            SELECT 
                producto_id,
                codigo_producto,
                nombre,
                CASE 
                    WHEN imagen_dato IS NULL THEN '❌ NULL (Sin imagen)'
                    WHEN LENGTH(imagen_dato) = 0 THEN '❌ Vacío (0 bytes)'
                    ELSE CONCAT('✅ Tiene imagen (', LENGTH(imagen_dato), ' bytes)')
                END as estado_imagen
            FROM productos
            ORDER BY producto_id
        """)
        
        result = conn.execute(query)
        productos = result.fetchall()
        
        if not productos:
            print("⚠️  No se encontraron productos en la base de datos\n")
            return
        
        # Contadores
        con_imagen = 0
        sin_imagen = 0
        
        print(f"{'ID':<5} {'Código':<15} {'Nombre':<40} {'Estado Imagen'}")
        print("-" * 100)
        
        for producto in productos:
            producto_id = producto[0]
            codigo = producto[1]
            nombre = producto[2][:37] + "..." if len(producto[2]) > 40 else producto[2]
            estado = producto[3]
            
            print(f"{producto_id:<5} {codigo:<15} {nombre:<40} {estado}")
            
            if "✅" in estado:
                con_imagen += 1
            else:
                sin_imagen += 1
        
        print("-" * 100)
        print(f"\n📊 RESUMEN:")
        print(f"   ✅ Productos CON imagen: {con_imagen}")
        print(f"   ❌ Productos SIN imagen: {sin_imagen}")
        print(f"   📦 Total de productos: {len(productos)}\n")
        
        if sin_imagen > 0:
            print("💡 SOLUCIÓN:")
            print("   Para agregar imágenes a los productos sin imagen:")
            print("   1. Ve a http://localhost:3000/admin/productos")
            print("   2. Edita cada producto sin imagen")
            print("   3. Sube una imagen")
            print("   4. Guarda los cambios\n")

if __name__ == "__main__":
    try:
        check_images()
    except Exception as e:
        print(f"\n❌ Error: {e}\n")
        print("Verifica que:")
        print("  - MySQL esté ejecutándose")
        print("  - Las credenciales en .env sean correctas")
        print("  - La base de datos 'kabe_rental_system' exista\n")
