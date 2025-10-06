"""
Script para agregar datos de prueba a la base de datos
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.models import Categoria, Producto
from decimal import Decimal
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def add_sample_data():
    """Agregar datos de prueba a la base de datos"""
    db = SessionLocal()
    try:
        # Verificar si ya existen categorías
        categorias = db.query(Categoria).all()
        if not categorias:
            # Crear categorías
            categorias_data = [
                {"nombre": "Sillas", "descripcion": "Sillas para eventos de diferentes estilos"},
                {"nombre": "Mesas", "descripcion": "Mesas redondas, rectangulares y cocktail"},
                {"nombre": "Mantelería", "descripcion": "Manteles, servilletas y decoración textil"},
                {"nombre": "Carpas", "descripcion": "Carpas y toldos para eventos al aire libre"},
                {"nombre": "Iluminación", "descripcion": "Luces ambientales y decorativas"},
                {"nombre": "Audio", "descripcion": "Sistemas de sonido y micrófonos"}
            ]
            
            for cat_data in categorias_data:
                categoria = Categoria(**cat_data)
                db.add(categoria)
            
            db.commit()
            logger.info("Categorías creadas exitosamente")
            
            # Recargar categorías
            categorias = db.query(Categoria).all()
        
        # Verificar si ya existen productos
        if db.query(Producto).first():
            logger.info("Ya existen productos en la base de datos")
            return
        
        # Crear productos de prueba
        productos_data = [
            # Sillas
            {
                "categoria_id": next(c.categoria_id for c in categorias if c.nombre == "Sillas"),
                "codigo_producto": "SIL-001",
                "nombre": "Silla Chiavari Dorada",
                "descripcion": "Elegante silla chiavari en color dorado, perfecta para bodas y eventos elegantes",
                "precio_por_dia": Decimal("25.00"),
                "stock_total": 100,
                "stock_disponible": 95,
                "imagen_url": "/images/silla.jpg",
                "dimensiones": "40x40x92 cm",
                "peso": Decimal("3.5"),
                "requiere_deposito": True,
                "deposito_cantidad": Decimal("50.00")
            },
            {
                "categoria_id": next(c.categoria_id for c in categorias if c.nombre == "Sillas"),
                "codigo_producto": "SIL-002",
                "nombre": "Silla Cross Back",
                "descripcion": "Silla de madera con respaldo cruzado, ideal para eventos rústicos y vintage",
                "precio_por_dia": Decimal("30.00"),
                "stock_total": 80,
                "stock_disponible": 75,
                "imagen_url": "/images/silla.jpg",
                "dimensiones": "42x45x88 cm",
                "peso": Decimal("4.2"),
                "requiere_deposito": True,
                "deposito_cantidad": Decimal("60.00")
            },
            # Mesas
            {
                "categoria_id": next(c.categoria_id for c in categorias if c.nombre == "Mesas"),
                "codigo_producto": "MES-001",
                "nombre": "Mesa Redonda 1.5m",
                "descripcion": "Mesa redonda de 1.5 metros de diámetro, capacidad para 8 personas",
                "precio_por_dia": Decimal("80.00"),
                "stock_total": 30,
                "stock_disponible": 28,
                "imagen_url": "/images/silla.jpg",
                "dimensiones": "150x150x75 cm",
                "peso": Decimal("25.0"),
                "requiere_deposito": True,
                "deposito_cantidad": Decimal("200.00")
            },
            {
                "categoria_id": next(c.categoria_id for c in categorias if c.nombre == "Mesas"),
                "codigo_producto": "MES-002",
                "nombre": "Mesa Rectangular 2.4m",
                "descripcion": "Mesa rectangular de 2.4 metros, ideal para 10-12 personas",
                "precio_por_dia": Decimal("100.00"),
                "stock_total": 25,
                "stock_disponible": 23,
                "imagen_url": "/images/silla.jpg",
                "dimensiones": "240x90x75 cm",
                "peso": Decimal("30.0"),
                "requiere_deposito": True,
                "deposito_cantidad": Decimal("250.00")
            },
            # Mantelería
            {
                "categoria_id": next(c.categoria_id for c in categorias if c.nombre == "Mantelería"),
                "codigo_producto": "MAN-001",
                "nombre": "Mantel Blanco Redondo",
                "descripcion": "Mantel blanco de alta calidad para mesa redonda de 1.5m",
                "precio_por_dia": Decimal("15.00"),
                "stock_total": 50,
                "stock_disponible": 48,
                "imagen_url": "/images/silla.jpg",
                "requiere_deposito": False
            },
            {
                "categoria_id": next(c.categoria_id for c in categorias if c.nombre == "Mantelería"),
                "codigo_producto": "MAN-002",
                "nombre": "Camino de Mesa Dorado",
                "descripcion": "Elegante camino de mesa en color dorado con acabado satinado",
                "precio_por_dia": Decimal("12.00"),
                "stock_total": 40,
                "stock_disponible": 38,
                "imagen_url": "/images/silla.jpg",
                "requiere_deposito": False
            },
            # Carpas
            {
                "categoria_id": next(c.categoria_id for c in categorias if c.nombre == "Carpas"),
                "codigo_producto": "CAR-001",
                "nombre": "Carpa 6x6 metros",
                "descripcion": "Carpa resistente para eventos al aire libre, capacidad 40 personas",
                "precio_por_dia": Decimal("300.00"),
                "stock_total": 10,
                "stock_disponible": 9,
                "imagen_url": "/images/silla.jpg",
                "dimensiones": "600x600x300 cm",
                "peso": Decimal("80.0"),
                "requiere_deposito": True,
                "deposito_cantidad": Decimal("1000.00")
            },
            # Iluminación
            {
                "categoria_id": next(c.categoria_id for c in categorias if c.nombre == "Iluminación"),
                "codigo_producto": "ILU-001",
                "nombre": "Luces LED Cálidas",
                "descripcion": "String de luces LED cálidas de 10 metros, perfectas para ambiente romántico",
                "precio_por_dia": Decimal("35.00"),
                "stock_total": 20,
                "stock_disponible": 18,
                "imagen_url": "/images/silla.jpg",
                "especificaciones": "LED 3000K, 10 metros, resistente al agua IP65",
                "requiere_deposito": True,
                "deposito_cantidad": Decimal("100.00")
            },
            # Audio
            {
                "categoria_id": next(c.categoria_id for c in categorias if c.nombre == "Audio"),
                "codigo_producto": "AUD-001",
                "nombre": "Sistema de Audio Básico",
                "descripcion": "Sistema de audio con bocinas y micrófono inalámbrico, ideal para eventos pequeños",
                "precio_por_dia": Decimal("150.00"),
                "stock_total": 8,
                "stock_disponible": 7,
                "imagen_url": "/images/silla.jpg",
                "especificaciones": "Potencia 200W, Bluetooth, 1 micrófono inalámbrico incluido",
                "peso": Decimal("15.0"),
                "requiere_deposito": True,
                "deposito_cantidad": Decimal("500.00")
            }
        ]
        
        for prod_data in productos_data:
            producto = Producto(**prod_data)
            db.add(producto)
        
        db.commit()
        logger.info(f"Se agregaron {len(productos_data)} productos de prueba exitosamente")
        
    except Exception as e:
        logger.error(f"Error al agregar datos de prueba: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Agregando datos de prueba...")
    add_sample_data()
    logger.info("Datos de prueba agregados exitosamente")