"""
Script para inicializar la base de datos con datos de prueba
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.models import Base, Categoria, Producto, Usuario, Paquete, PaqueteProducto
from passlib.context import CryptContext
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Para hashear contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_tables():
    """Crear todas las tablas en la base de datos"""
    Base.metadata.create_all(bind=engine)
    logger.info("Tablas creadas exitosamente")

def init_db():
    """Inicializar la base de datos con datos básicos"""
    db = SessionLocal()
    try:
        # Verificar si ya existen datos
        if db.query(Categoria).first():
            logger.info("La base de datos ya tiene datos, saltando inicialización")
            return
        
        # Crear categorías
        categorias = [
            Categoria(nombre="Sillas", descripcion="Sillas para eventos de diferentes estilos"),
            Categoria(nombre="Mesas", descripcion="Mesas redondas, rectangulares y cocktail"),
            Categoria(nombre="Mantelería", descripcion="Manteles, servilletas y decoración textil"),
            Categoria(nombre="Carpas", descripcion="Carpas y toldos para eventos al aire libre"),
            Categoria(nombre="Iluminación", descripcion="Luces ambientales y decorativas"),
            Categoria(nombre="Audio", descripcion="Sistemas de sonido y micrófonos")
        ]
        
        for categoria in categorias:
            db.add(categoria)
        
        db.commit()
        logger.info("Categorías creadas exitosamente")
        
        # Crear usuario administrador por defecto
        admin_user = Usuario(
            nombre="Administrador",
            apellido="Sistema",
            email="admin@kabe-rental.com",
            password=pwd_context.hash("admin123"),
            telefono="+52 722 000 0000"
        )
        db.add(admin_user)
        db.commit()
        logger.info("Usuario administrador creado exitosamente")
        
        logger.info("Base de datos inicializada correctamente")
        
    except Exception as e:
        logger.error(f"Error al inicializar la base de datos: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Iniciando configuración de la base de datos...")
    create_tables()
    init_db()
    logger.info("Configuración completada")