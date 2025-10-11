#!/usr/bin/env python3
"""
Script para verificar administradores en la base de datos
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import sessionmaker
from app.core.database import engine
from app.models.models import Administrador
from app.core.auth import verify_password

def check_admins():
    """Verificar administradores existentes"""
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
            print(f"Password hash: {admin.password[:30]}...")
            print(f"Fecha creación: {admin.fecha_creacion}")
            
            # Intentar verificar contraseñas comunes
            test_passwords = ["admin123", "123456", "password", admin.email.split('@')[0]]
            for test_pass in test_passwords:
                try:
                    if verify_password(test_pass, admin.password):
                        print(f"✅ Password encontrado: {test_pass}")
                        break
                    elif test_pass == admin.password:
                        print(f"✅ Password sin hash: {test_pass}")
                        break
                except:
                    if test_pass == admin.password:
                        print(f"✅ Password en texto plano: {test_pass}")
                        break
            else:
                print("❌ Password no encontrado con pruebas comunes")
            
            print("-" * 30)
    
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_admins()