#!/usr/bin/env python3
"""
Script para agregar un administrador inicial a la base de datos
Ejecutar desde el directorio backend: python add_admin.py
"""

import sys
import os

# Agregar el directorio del proyecto al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import get_db, engine
from app.models.models import Administrador
from app.core.auth import hash_password

def create_admin():
    """Crear administrador inicial"""
    
    # Datos del administrador inicial
    admin_data = {
        'nombre': 'Admin',
        'apellido': 'Principal',
        'email': 'admin@kabe.com',
        'password': 'admin123'  # Cambiar por una contraseña segura
    }
    
    # Obtener sesión de base de datos
    db = next(get_db())
    
    try:
        # Verificar si ya existe un administrador con este email
        existing_admin = db.query(Administrador).filter(Administrador.email == admin_data['email']).first()
        
        if existing_admin:
            print(f"Ya existe un administrador con el email {admin_data['email']}")
            return
        
        # Crear nuevo administrador
        hashed_password = hash_password(admin_data['password'])
        
        admin = Administrador(
            nombre=admin_data['nombre'],
            apellido=admin_data['apellido'],
            email=admin_data['email'],
            password=hashed_password
        )
        
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        print("✅ Administrador creado exitosamente!")
        print(f"📧 Email: {admin_data['email']}")
        print(f"🔑 Contraseña: {admin_data['password']}")
        print(f"🆔 ID: {admin.admin_id}")
        print("\n⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión")
        
    except Exception as e:
        print(f"❌ Error al crear administrador: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 Creando administrador inicial...")
    create_admin()