#!/usr/bin/env python3
"""
Script para inicializar las tablas de pagos y tarjetas en la base de datos
"""

import sys
import os

# Agregar el directorio raíz al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings
from app.models.pago_models import Base

def init_pagos_tables():
    """Inicializar las tablas de pagos y tarjetas"""
    try:
        # Crear engine
        engine = create_engine(settings.DATABASE_URL)
        
        print("🔄 Creando tablas de pagos y tarjetas...")
        
        # Crear todas las tablas definidas en pago_models
        Base.metadata.create_all(bind=engine)
        
        print("✅ Tablas creadas exitosamente:")
        print("   - tarjetas_usuario")
        print("   - pagos (ya existía)")
        
        # Verificar que las tablas existen
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME IN ('tarjetas_usuario', 'pagos')
            """))
            
            tables = [row[0] for row in result]
            print(f"\n📊 Tablas verificadas: {tables}")
            
            if 'tarjetas_usuario' in tables:
                print("✅ Tabla tarjetas_usuario creada correctamente")
            else:
                print("❌ Error: Tabla tarjetas_usuario no encontrada")
                
            if 'pagos' in tables:
                print("✅ Tabla pagos verificada")
            else:
                print("⚠️  Advertencia: Tabla pagos no encontrada")
        
        print("\n🎉 Inicialización completada!")
        print("\n📝 Próximos pasos:")
        print("   1. Ejecutar el backend: python run.py")
        print("   2. Probar los endpoints en: http://localhost:8001/docs")
        print("   3. Usar la página Mis Tarjetas en el frontend")
        
    except Exception as e:
        print(f"❌ Error al inicializar tablas: {e}")
        print("\n🔧 Soluciones posibles:")
        print("   1. Verificar que MySQL esté ejecutándose")
        print("   2. Revisar las credenciales en el archivo .env")
        print("   3. Asegurarse de que la base de datos 'kabe_rental_system' existe")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Inicializando sistema de pagos y tarjetas para K'abé...")
    print("=" * 60)
    
    success = init_pagos_tables()
    
    if success:
        print("\n" + "=" * 60)
        print("✅ ¡Sistema de pagos listo para usar!")
    else:
        print("\n" + "=" * 60)
        print("❌ Error en la inicialización")
        sys.exit(1)
