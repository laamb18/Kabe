#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.crud.crud import productos_crud, paquetes_crud
from app.models.models import Producto, Paquete

def diagnose_images():
    """Diagnosticar problemas con las imágenes en la base de datos"""
    db = SessionLocal()
    
    try:
        print("=== Diagnóstico de Imágenes ===")
        
        # 1. Verificar productos
        print("\n--- Productos ---")
        productos = productos_crud.get_all_admin(db, limit=10)
        print(f"Total productos encontrados: {len(productos)}")
        
        for i, producto in enumerate(productos):
            print(f"\nProducto {i+1}: {producto.nombre}")
            print(f"  ID: {producto.producto_id}")
            print(f"  Código: {producto.codigo_producto}")
            
            if producto.imagen_dato:
                print(f"  Imagen: ✓ Presente ({len(producto.imagen_dato)} bytes)")
                
                # Verificar tipo de imagen
                if producto.imagen_dato.startswith(b'\xff\xd8\xff'):
                    print("    Tipo: JPEG")
                elif producto.imagen_dato.startswith(b'\x89\x50\x4e\x47'):
                    print("    Tipo: PNG")
                elif producto.imagen_dato.startswith(b'\x47\x49\x46'):
                    print("    Tipo: GIF")
                else:
                    print(f"    Tipo: Desconocido (primeros bytes: {producto.imagen_dato[:10]})")
                
                # Probar conversión a base64
                try:
                    import base64
                    base64_string = base64.b64encode(producto.imagen_dato).decode('utf-8')
                    print(f"    Base64: ✓ Convertido ({len(base64_string)} caracteres)")
                    print(f"    Preview: {base64_string[:50]}...")
                except Exception as e:
                    print(f"    Base64: ✗ Error - {e}")
            else:
                print("  Imagen: ✗ No presente")
        
        # 2. Verificar paquetes
        print("\n--- Paquetes ---")
        paquetes = paquetes_crud.get_all_admin(db, limit=10)
        print(f"Total paquetes encontrados: {len(paquetes)}")
        
        for i, paquete in enumerate(paquetes):
            print(f"\nPaquete {i+1}: {paquete.nombre}")
            print(f"  ID: {paquete.paquete_id}")
            print(f"  Código: {paquete.codigo_paquete}")
            
            if paquete.imagen_dato:
                print(f"  Imagen: ✓ Presente ({len(paquete.imagen_dato)} bytes)")
                
                # Verificar tipo de imagen
                if paquete.imagen_dato.startswith(b'\xff\xd8\xff'):
                    print("    Tipo: JPEG")
                elif paquete.imagen_dato.startswith(b'\x89\x50\x4e\x47'):
                    print("    Tipo: PNG")
                elif paquete.imagen_dato.startswith(b'\x47\x49\x46'):
                    print("    Tipo: GIF")
                else:
                    print(f"    Tipo: Desconocido (primeros bytes: {paquete.imagen_dato[:10]})")
                
                # Probar conversión a base64
                try:
                    import base64
                    base64_string = base64.b64encode(paquete.imagen_dato).decode('utf-8')
                    print(f"    Base64: ✓ Convertido ({len(base64_string)} caracteres)")
                    print(f"    Preview: {base64_string[:50]}...")
                except Exception as e:
                    print(f"    Base64: ✗ Error - {e}")
            else:
                print("  Imagen: ✗ No presente")
        
        # 3. Estadísticas generales
        print("\n--- Estadísticas ---")
        total_productos = len(productos)
        productos_con_imagen = sum(1 for p in productos if p.imagen_dato)
        print(f"Productos con imagen: {productos_con_imagen}/{total_productos}")
        
        total_paquetes = len(paquetes)
        paquetes_con_imagen = sum(1 for p in paquetes if p.imagen_dato)
        print(f"Paquetes con imagen: {paquetes_con_imagen}/{total_paquetes}")
        
    except Exception as e:
        print(f"Error durante el diagnóstico: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    diagnose_images()