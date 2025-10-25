"""
Script para verificar el hash de contraseña en la base de datos
"""
from app.core.database import SessionLocal
from app.models.models import Usuario
from app.core.auth import verify_password, hash_password

def check_user_password(email: str, test_password: str):
    """Verificar la contraseña de un usuario"""
    db = SessionLocal()
    try:
        user = db.query(Usuario).filter(Usuario.email == email).first()
        
        if not user:
            print(f"❌ Usuario no encontrado: {email}")
            return
        
        print(f"\n👤 Usuario: {user.nombre} {user.apellido}")
        print(f"📧 Email: {user.email}")
        print(f"🔐 Hash en BD: {user.password}")
        print(f"📏 Longitud del hash: {len(user.password)}")
        print(f"🔤 Primeros caracteres: {user.password[:10]}")
        
        # Verificar si es un hash de bcrypt válido
        if user.password.startswith('$2b$') or user.password.startswith('$2a$'):
            print(f"✅ Formato de hash bcrypt válido")
        else:
            print(f"⚠️  No parece ser un hash bcrypt válido")
        
        # Intentar verificar la contraseña
        print(f"\n🔍 Probando contraseña: '{test_password}'")
        try:
            is_valid = verify_password(test_password, user.password)
            if is_valid:
                print(f"✅ ¡Contraseña correcta!")
            else:
                print(f"❌ Contraseña incorrecta")
        except Exception as e:
            print(f"❌ Error al verificar: {e}")
        
        # Generar un nuevo hash para comparar
        print(f"\n🔧 Generando nuevo hash para comparación...")
        new_hash = hash_password(test_password)
        print(f"🔐 Nuevo hash: {new_hash}")
        print(f"📏 Longitud: {len(new_hash)}")
        
        # Verificar el nuevo hash
        is_new_valid = verify_password(test_password, new_hash)
        print(f"✅ Nuevo hash funciona: {is_new_valid}")
        
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 3:
        print("Uso: python check_password_hash.py <email> <contraseña>")
        print("Ejemplo: python check_password_hash.py balam@gmail.com micontraseña")
        sys.exit(1)
    
    email = sys.argv[1]
    password = sys.argv[2]
    
    check_user_password(email, password)
