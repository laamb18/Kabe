#!/usr/bin/env python3
"""
Script para actualizar las contraseñas de administradores a formato hasheado
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import sessionmaker
from app.core.database import engine
from app.models.models import Administrador
from app.core.auth import hash_password, verify_password

def update_admin_passwords():
    """Actualizar contraseñas de administradores a formato hasheado"""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        admins = db.query(Administrador).all()
        print(f"Administradores encontrados: {len(admins)}")
        print("=" * 50)
        
        for admin in admins:
            print(f"ID: {admin.admin_id}")
            print(f"Nombre: {admin.nombre} {admin.apellido}")
            print(f"Email: {admin.email}")
            print(f"Password actual: {admin.password}")
            
            # Verificar si ya está hasheado (los hashes de bcrypt empiezan con $2b$)
            if admin.password.startswith('$2b$'):
                print("✅ Ya está hasheado correctamente")
            else:
                print("🔧 Actualizando a formato hasheado...")
                # Guardar la contraseña original
                plain_password = admin.password
                # Hashearla
                hashed_password = hash_password(plain_password)
                # Actualizar en la base de datos
                admin.password = hashed_password
                
                print(f"🔐 Nueva contraseña hasheada: {hashed_password[:30]}...")
                print(f"📝 Contraseña original: {plain_password}")
            
            print("-" * 30)
        
        # Confirmar cambios
        respuesta = input("\n¿Quieres aplicar estos cambios? (y/N): ").lower()
        if respuesta == 'y':
            db.commit()
            print("✅ ¡Contraseñas actualizadas correctamente!")
            
            # Verificar que funcionan
            print("\n🧪 Verificando contraseñas...")
            for admin in admins:
                if admin.password.startswith('$2b$'):
                    # Intentar verificar con algunas contraseñas comunes
                    test_passwords = [
                        "123456´" if admin.email == "balag18@hotmail.com" else "balam1812",
                        "123456",
                        "balam1812",
                        admin.email.split('@')[0]
                    ]
                    
                    for test_pass in test_passwords:
                        try:
                            if verify_password(test_pass, admin.password):
                                print(f"✅ {admin.email}: Password '{test_pass}' funciona")
                                break
                        except:
                            continue
                    else:
                        print(f"❌ {admin.email}: No se pudo verificar la contraseña")
        else:
            print("❌ Cambios cancelados")
            db.rollback()
    
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 ACTUALIZANDO CONTRASEÑAS DE ADMINISTRADORES")
    print("=" * 50)
    update_admin_passwords()