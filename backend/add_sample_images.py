#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import base64
from app.core.database import SessionLocal
from app.crud.crud import productos_crud, categorias_crud, paquetes_crud
from app.models.models import Producto, Categoria, Paquete

def create_sample_image():
    """Crear una imagen de muestra en base64 (un pequeño pixel rojo)"""
    # Esto es un GIF de 1x1 pixel rojo en base64
    red_pixel_gif = "R0lGODlhAQABAIAAAP8AAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw=="
    return base64.b64decode(red_pixel_gif)

def add_sample_products_with_images():
    """Agregar productos de muestra con imágenes"""
    db = SessionLocal()
    
    try:
        print("=== Agregando productos de muestra con imágenes ===")
        
        # 1. Verificar si hay categorías
        categorias = categorias_crud.get_all(db, limit=5)
        if not categorias:
            print("No hay categorías. Creando una...")
            nueva_categoria = categorias_crud.create_categoria(db, {
                "nombre": "Categoria Muestra",
                "descripcion": "Categoria para productos de muestra",
                "activo": True
            })
            categorias = [nueva_categoria]
            print(f"Categoria creada: {nueva_categoria.nombre}")
        
        categoria = categorias[0]
        print(f"Usando categoría: {categoria.nombre}")
        
        # 2. Crear imagen de muestra
        sample_image = create_sample_image()
        print(f"Imagen de muestra creada: {len(sample_image)} bytes")
        
        # 3. Crear productos de muestra
        productos_muestra = [
            {
                "categoria_id": categoria.categoria_id,
                "codigo_producto": "MUESTRA_001",
                "nombre": "Producto con Imagen 1",
                "descripcion": "Producto de prueba con imagen",
                "precio_por_dia": 25.00,
                "stock_total": 10,
                "stock_disponible": 8,
                "estado": "disponible",
                "especificaciones": "Producto para probar imágenes",
                "dimensiones": "10x10x10",
                "peso": 1.0,
                "imagen_dato": sample_image,
                "requiere_deposito": False,
                "deposito_cantidad": 0.0
            },
            {
                "categoria_id": categoria.categoria_id,
                "codigo_producto": "MUESTRA_002",
                "nombre": "Producto con Imagen 2",
                "descripcion": "Segundo producto de prueba con imagen",
                "precio_por_dia": 35.00,
                "stock_total": 5,
                "stock_disponible": 3,
                "estado": "disponible",
                "especificaciones": "Segundo producto para probar imágenes",
                "dimensiones": "15x15x15",
                "peso": 2.0,
                "imagen_dato": sample_image,
                "requiere_deposito": True,
                "deposito_cantidad": 10.0
            }
        ]
        
        for i, producto_data in enumerate(productos_muestra):
            # Verificar si ya existe
            existing = db.query(Producto).filter(Producto.codigo_producto == producto_data["codigo_producto"]).first()
            if existing:
                print(f"Producto {producto_data['codigo_producto']} ya existe, actualizando...")
                # Actualizar con imagen
                existing.imagen_dato = sample_image
                db.commit()
                print(f"Producto actualizado: {existing.nombre}")
            else:
                nuevo_producto = productos_crud.create_producto(db, producto_data)
                print(f"Producto creado: {nuevo_producto.nombre} (ID: {nuevo_producto.producto_id})")
        
        # 4. Crear paquetes de muestra
        paquetes_muestra = [
            {
                "codigo_paquete": "PAQ_MUESTRA_001",
                "nombre": "Paquete con Imagen 1",
                "descripcion": "Paquete de prueba con imagen",
                "precio_por_dia": 100.00,
                "descuento_porcentaje": 10.0,
                "imagen_dato": sample_image,
                "capacidad_personas": 5,
                "activo": True
            },
            {
                "codigo_paquete": "PAQ_MUESTRA_002",
                "nombre": "Paquete con Imagen 2",
                "descripcion": "Segundo paquete de prueba con imagen",
                "precio_por_dia": 150.00,
                "descuento_porcentaje": 15.0,
                "imagen_dato": sample_image,
                "capacidad_personas": 8,
                "activo": True
            }
        ]
        
        for paquete_data in paquetes_muestra:
            # Verificar si ya existe
            existing = db.query(Paquete).filter(Paquete.codigo_paquete == paquete_data["codigo_paquete"]).first()
            if existing:
                print(f"Paquete {paquete_data['codigo_paquete']} ya existe, actualizando...")
                # Actualizar con imagen
                existing.imagen_dato = sample_image
                db.commit()
                print(f"Paquete actualizado: {existing.nombre}")
            else:
                nuevo_paquete = paquetes_crud.create_paquete(db, paquete_data)
                print(f"Paquete creado: {nuevo_paquete.nombre} (ID: {nuevo_paquete.paquete_id})")
        
        print("\n=== Productos y paquetes de muestra agregados exitosamente ===")
        
        # 5. Verificar que las imágenes se guardaron correctamente
        print("\n=== Verificación ===")
        productos = productos_crud.get_all_admin(db, limit=10)
        productos_con_imagen = [p for p in productos if p.imagen_dato]
        print(f"Productos con imagen: {len(productos_con_imagen)}/{len(productos)}")
        
        paquetes = paquetes_crud.get_all_admin(db, limit=10)
        paquetes_con_imagen = [p for p in paquetes if p.imagen_dato]
        print(f"Paquetes con imagen: {len(paquetes_con_imagen)}/{len(paquetes)}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    add_sample_products_with_images()