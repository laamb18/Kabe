#!/usr/bin/env python3
"""
Script para verificar la conexión a la base de datos y los paquetes existentes
"""

import sys
import os

# Agregar el directorio padre al path para importar las dependencias
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models.models import Paquete
from app.core.database import get_db
from app.core.config import settings

def test_database_connection():
    """Probar la conexión a la base de datos"""
    print("🔍 Verificando conexión a la base de datos...")
    
    try:
        # Crear conexión directa
        engine = create_engine(settings.DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        
        with SessionLocal() as db:
            print("✅ Conexión exitosa!")
            
            # Verificar si la tabla paquetes existe
            print("\n📋 Verificando tabla 'paquetes'...")
            
            # Consulta SQL directa para ver la estructura
            result = db.execute(text("SHOW TABLES LIKE 'paquetes'"))
            table_exists = result.fetchone()
            
            if table_exists:
                print("✅ Tabla 'paquetes' encontrada")
                
                # Obtener estructura de la tabla
                print("\n🔧 Estructura de la tabla:")
                columns = db.execute(text("DESCRIBE paquetes"))
                for column in columns:
                    print(f"   - {column[0]} ({column[1]}) - {column[3] if column[3] else 'NULL'} - {column[5] if column[5] else ''}")
                
                # Contar registros
                count_result = db.execute(text("SELECT COUNT(*) FROM paquetes"))
                count = count_result.fetchone()[0]
                print(f"\n📊 Total de paquetes en BD: {count}")
                
                if count > 0:
                    print("\n📦 Primeros 3 paquetes encontrados:")
                    packages = db.execute(text("SELECT * FROM paquetes LIMIT 3"))
                    for pkg in packages:
                        print(f"   ID: {pkg[0]} | Código: {pkg[1]} | Nombre: {pkg[2]} | Activo: {pkg[8]}")
                
                # Probar el modelo ORM
                print("\n🧪 Probando modelo ORM...")
                try:
                    orm_packages = db.query(Paquete).limit(3).all()
                    print(f"✅ ORM funciona! Encontrados {len(orm_packages)} paquetes via ORM")
                    for pkg in orm_packages:
                        print(f"   - {pkg.nombre} (ID: {pkg.paquete_id})")
                except Exception as e:
                    print(f"❌ Error con ORM: {e}")
                
            else:
                print("❌ Tabla 'paquetes' no encontrada")
                print("📝 Tablas disponibles:")
                tables = db.execute(text("SHOW TABLES"))
                for table in tables:
                    print(f"   - {table[0]}")
    
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False
    
    return True

def test_api_endpoints():
    """Probar los endpoints de la API"""
    print("\n🌐 Probando endpoints de la API...")
    
    import requests
    
    try:
        # Probar endpoint público
        response = requests.get("http://localhost:8001/api/v1/paquetes")
        print(f"📡 GET /paquetes - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Respuesta exitosa: {len(data)} paquetes")
            if data:
                print(f"   Primer paquete: {data[0].get('nombre', 'Sin nombre')}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error al probar API: {e}")
        print("💡 Asegúrate de que el servidor esté corriendo en puerto 8001")

def main():
    print("🚀 Diagnóstico de Paquetes - K'abé")
    print("=" * 50)
    
    # Test 1: Conexión a BD
    if test_database_connection():
        print("\n" + "=" * 50)
        # Test 2: API endpoints
        test_api_endpoints()
    
    print("\n🏁 Diagnóstico completado!")

if __name__ == "__main__":
    main()