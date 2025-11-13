#!/usr/bin/env python3
"""
Script para verificar la conexión entre usuarios y tarjetas
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Crear engine y sesión
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def verificar_conexion():
    """Verificar conexión entre usuarios y tarjetas"""
    db = SessionLocal()
    
    try:
        print("🔍 Verificando conexión con la base de datos...")
        print("=" * 60)
        
        # 1. Verificar usuarios
        result = db.execute(text("SELECT COUNT(*) as total FROM usuarios"))
        total_usuarios = result.fetchone()[0]
        print(f"\n👥 Total de usuarios en la base de datos: {total_usuarios}")
        
        if total_usuarios > 0:
            # Mostrar algunos usuarios
            result = db.execute(text("""
                SELECT usuario_id, nombre, apellido, email 
                FROM usuarios 
                LIMIT 5
            """))
            print("\n📋 Usuarios registrados:")
            for row in result:
                print(f"  - ID: {row[0]} | {row[1]} {row[2]} | {row[3]}")
        
        # 2. Verificar tabla tarjetas_usuario
        result = db.execute(text("SELECT COUNT(*) as total FROM tarjetas_usuario"))
        total_tarjetas = result.fetchone()[0]
        print(f"\n💳 Total de tarjetas en la base de datos: {total_tarjetas}")
        
        if total_tarjetas > 0:
            # Mostrar tarjetas con sus usuarios
            result = db.execute(text("""
                SELECT 
                    t.tarjeta_id,
                    t.usuario_id,
                    u.nombre,
                    u.apellido,
                    t.marca,
                    t.ultimos_digitos,
                    t.es_predeterminada
                FROM tarjetas_usuario t
                JOIN usuarios u ON t.usuario_id = u.usuario_id
                WHERE t.activa = TRUE
            """))
            print("\n📋 Tarjetas guardadas:")
            for row in result:
                print(f"  - Tarjeta ID: {row[0]}")
                print(f"    Usuario: {row[2]} {row[3]} (ID: {row[1]})")
                print(f"    Tarjeta: {row[4].upper()} •••• {row[5]}")
                print(f"    Predeterminada: {'Sí' if row[6] else 'No'}")
                print()
        else:
            print("\n⚠️  No hay tarjetas guardadas todavía")
        
        # 3. Verificar relación (Foreign Key)
        result = db.execute(text("""
            SELECT 
                CONSTRAINT_NAME,
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'tarjetas_usuario'
            AND REFERENCED_TABLE_NAME IS NOT NULL
        """))
        
        print("\n🔗 Relaciones de la tabla tarjetas_usuario:")
        for row in result:
            print(f"  - {row[0]}: {row[1]}.{row[2]}")
        
        print("\n" + "=" * 60)
        print("✅ Conexión verificada correctamente")
        print("\n💡 Para agregar una tarjeta:")
        print("   1. Inicia sesión en http://localhost:5173")
        print("   2. Ve a 'Mis Tarjetas' (menú de perfil)")
        print("   3. Click en 'Agregar Nueva Tarjeta'")
        print("   4. Completa el formulario")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    verificar_conexion()
