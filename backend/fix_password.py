"""
Script para arreglar la contraseña de un usuario directamente en la BD
"""
from app.core.database import SessionLocal
from app.models.models import Usuario
from app.core.auth import hash_password, verify_password

def fix_user_password(email: str, new_password: str):
    """Actualizar la contraseña de un usuario directamente"""
    db = SessionLocal()
    try:
        user = db.query(Usuario).filter(Usuario.email == email).first()
        
        if not user:
            print(f"❌ Usuario no encontrado: {email}")
            return
        
        print(f"\n👤 Usuario encontrado: {user.nombre} {user.apellido}")
        print(f"📧 Email: {user.email}")
        print(f"\n🔐 Hash ANTERIOR en BD:")
        print(f"   {user.password}")
        print(f"   Longitud: {len(user.password)}")
        
        # Generar nuevo hash
        print(f"\n🔧 Generando nuevo hash para: '{new_password}'")
        new_hash = hash_password(new_password)
        print(f"🔐 Nuevo hash generado:")
        print(f"   {new_hash}")
        print(f"   Longitud: {len(new_hash)}")
        
        # Verificar que el nuevo hash funciona ANTES de guardarlo
        test_verify = verify_password(new_password, new_hash)
        print(f"\n✅ Verificación de prueba: {test_verify}")
        
        if not test_verify:
            print(f"❌ ERROR: El hash generado no funciona!")
            return
        
        # Actualizar en la BD
        print(f"\n💾 Guardando en la base de datos...")
        user.password = new_hash
        db.commit()
        db.refresh(user)
        
        print(f"🔐 Hash NUEVO en BD:")
        print(f"   {user.password}")
        print(f"   Longitud: {len(user.password)}")
        
        # Verificar que se guardó correctamente
        final_verify = verify_password(new_password, user.password)
        print(f"\n✅ Verificación final: {final_verify}")
        
        if final_verify:
            print(f"\n🎉 ¡Contraseña actualizada exitosamente!")
            print(f"   Ahora puedes iniciar sesión con:")
            print(f"   Email: {email}")
            print(f"   Contraseña: {new_password}")
        else:
            print(f"\n❌ ERROR: La contraseña no se guardó correctamente")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 3:
        print("Uso: python fix_password.py <email> <nueva_contraseña>")
        print("Ejemplo: python fix_password.py carranza@gmail.com balam18")
        sys.exit(1)
    
    email = sys.argv[1]
    password = sys.argv[2]
    
    print("="*60)
    print("🔧 SCRIPT DE REPARACIÓN DE CONTRASEÑA")
    print("="*60)
    
    fix_user_password(email, password)
    
    print("\n" + "="*60)
