"""
Script para verificar la estructura de la tabla usuarios
"""
from app.core.database import SessionLocal
from sqlalchemy import text

def check_table_structure():
    """Verificar la estructura de la tabla usuarios"""
    db = SessionLocal()
    try:
        print("="*60)
        print("🔍 ESTRUCTURA DE LA TABLA USUARIOS")
        print("="*60)
        
        result = db.execute(text("DESCRIBE usuarios"))
        
        print(f"\n{'Campo':<20} {'Tipo':<20} {'Null':<10} {'Key':<10}")
        print("-"*60)
        
        for row in result:
            field = row[0]
            field_type = row[1]
            null = row[2]
            key = row[3]
            
            print(f"{field:<20} {field_type:<20} {null:<10} {key:<10}")
            
            # Verificar específicamente el campo password
            if field == 'password':
                print(f"\n⚠️  CAMPO PASSWORD:")
                print(f"   Tipo: {field_type}")
                
                # Extraer la longitud si es VARCHAR
                if 'varchar' in field_type.lower():
                    import re
                    match = re.search(r'varchar\((\d+)\)', field_type, re.IGNORECASE)
                    if match:
                        length = int(match.group(1))
                        print(f"   Longitud máxima: {length} caracteres")
                        
                        if length < 60:
                            print(f"\n❌ PROBLEMA ENCONTRADO!")
                            print(f"   Los hashes de bcrypt necesitan 60 caracteres")
                            print(f"   Tu campo solo permite {length} caracteres")
                            print(f"\n💡 SOLUCIÓN:")
                            print(f"   Ejecuta este comando SQL:")
                            print(f"   ALTER TABLE usuarios MODIFY password VARCHAR(255);")
                        else:
                            print(f"   ✅ Longitud suficiente para bcrypt")
        
        print("\n" + "="*60)
        
    finally:
        db.close()

if __name__ == "__main__":
    check_table_structure()
