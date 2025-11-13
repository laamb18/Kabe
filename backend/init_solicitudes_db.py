"""
Script para crear las tablas de solicitudes en la base de datos
"""
from app.core.database import engine
from app.models.solicitud_models import Base

def init_solicitudes_tables():
    """Crea las tablas de solicitudes en la base de datos"""
    print("Creando tablas de solicitudes...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tablas de solicitudes creadas exitosamente")
        print("   - solicitudes")
        print("   - solicitud_productos")
        print("   - solicitud_paquetes")
    except Exception as e:
        print(f"❌ Error al crear tablas: {e}")

if __name__ == "__main__":
    init_solicitudes_tables()
