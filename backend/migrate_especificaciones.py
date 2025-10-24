#!/usr/bin/env python3
"""
Script para migrar especificaciones de productos de TEXT a JSON
Este script debe ejecutarse una sola vez después de cambiar el campo especificaciones a JSON
"""

from app.core.database import engine
from sqlalchemy import text
import json

def migrate_especificaciones():
    """Migra especificaciones de formato texto a JSON"""
    with engine.connect() as conn:
        # Iniciar transacción
        trans = conn.begin()
        
        try:
            print("🔍 Verificando productos con especificaciones...")
            
            # Obtener todos los productos que tienen especificaciones
            result = conn.execute(text("""
                SELECT producto_id, especificaciones 
                FROM productos 
                WHERE especificaciones IS NOT NULL 
                AND especificaciones != ''
            """))
            
            productos = result.fetchall()
            print(f"📦 Encontrados {len(productos)} productos con especificaciones")
            
            # Procesar cada producto
            count_updated = 0
            count_skipped = 0
            
            for producto in productos:
                producto_id = producto[0]
                especificaciones = producto[1]
                
                try:
                    # Si ya es JSON válido, saltar
                    if isinstance(especificaciones, dict):
                        print(f"✅ Producto {producto_id}: Ya es JSON - saltando")
                        count_skipped += 1
                        continue
                    
                    # Si es string, intentar parsear como JSON
                    if isinstance(especificaciones, str):
                        try:
                            # Verificar si ya es JSON válido
                            json.loads(especificaciones)
                            print(f"✅ Producto {producto_id}: Ya es JSON string válido - saltando")
                            count_skipped += 1
                            continue
                        except json.JSONDecodeError:
                            # Es texto plano, convertir a JSON
                            json_spec = {"descripcion": especificaciones}
                            
                            # Actualizar en la base de datos
                            conn.execute(text("""
                                UPDATE productos 
                                SET especificaciones = :especificaciones 
                                WHERE producto_id = :producto_id
                            """), {
                                "especificaciones": json.dumps(json_spec, ensure_ascii=False),
                                "producto_id": producto_id
                            })
                            
                            print(f"🔄 Producto {producto_id}: Convertido texto a JSON")
                            count_updated += 1
                    
                except Exception as e:
                    print(f"❌ Error procesando producto {producto_id}: {e}")
                    continue
            
            # Confirmar cambios
            trans.commit()
            print(f"\n✅ Migración completada:")
            print(f"   📝 Productos actualizados: {count_updated}")
            print(f"   ⏭️  Productos saltados: {count_skipped}")
            print(f"   📊 Total procesados: {len(productos)}")
            
        except Exception as e:
            trans.rollback()
            print(f"❌ Error durante la migración: {e}")
            raise

def verify_migration():
    """Verifica que la migración fue exitosa"""
    print("\n🔍 Verificando migración...")
    
    with engine.connect() as conn:
        # Verificar productos con especificaciones
        result = conn.execute(text("""
            SELECT producto_id, especificaciones, nombre
            FROM productos 
            WHERE especificaciones IS NOT NULL 
            AND especificaciones != ''
            LIMIT 5
        """))
        
        productos = result.fetchall()
        
        print(f"\n📋 Primeros 5 productos con especificaciones:")
        for producto in productos:
            producto_id = producto[0]
            especificaciones = producto[1]
            nombre = producto[2]
            
            print(f"   🏷️  ID: {producto_id} - {nombre}")
            print(f"       📄 Especificaciones: {especificaciones[:100]}...")
            
            # Verificar si es JSON válido
            try:
                if isinstance(especificaciones, str):
                    json.loads(especificaciones)
                    print(f"       ✅ JSON válido")
                else:
                    print(f"       ✅ Tipo: {type(especificaciones)}")
            except json.JSONDecodeError:
                print(f"       ❌ NO es JSON válido")
            print()

if __name__ == "__main__":
    print("🚀 Iniciando migración de especificaciones...")
    print("=" * 50)
    
    try:
        migrate_especificaciones()
        verify_migration()
        
        print("\n🎉 ¡Migración completada exitosamente!")
        print("💡 Ahora puedes actualizar productos sin problemas de JSON.")
        
    except Exception as e:
        print(f"\n💥 Error fatal: {e}")
        import traceback
        traceback.print_exc()