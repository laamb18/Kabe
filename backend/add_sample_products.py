"""
Script para agregar productos de muestra a la base de datos
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.models import Categoria, Producto
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def add_sample_products():
    """Agregar productos de muestra a cada categoría"""
    db = SessionLocal()
    try:
        # Obtener todas las categorías
        categorias = db.query(Categoria).all()
        
        if not categorias:
            logger.error("No hay categorías en la base de datos. Ejecuta primero init_db.py")
            return
        
        # Productos de muestra para cada categoría
        productos_por_categoria = {
            "Sillas": [
                {"nombre": "Silla Chiavari Dorada", "descripcion": "Elegante silla dorada ideal para bodas y eventos formales", "precio": 25.00, "stock": 50},
                {"nombre": "Silla Tiffany Transparente", "descripcion": "Silla transparente moderna, perfecta para eventos contemporáneos", "precio": 22.00, "stock": 40},
                {"nombre": "Silla Vintage de Madera", "descripcion": "Silla rústica de madera ideal para eventos campestres", "precio": 18.00, "stock": 30}
            ],
            "Mesas": [
                {"nombre": "Mesa Redonda 1.5m", "descripcion": "Mesa redonda para 8 personas, ideal para cenas formales", "precio": 45.00, "stock": 20},
                {"nombre": "Mesa Rectangular 2m", "descripcion": "Mesa rectangular para 10 personas, perfecta para banquetes", "precio": 50.00, "stock": 15},
                {"nombre": "Mesa Cocktail", "descripcion": "Mesa alta para eventos de pie y cocteles", "precio": 35.00, "stock": 25}
            ],
            "Mantelería": [
                {"nombre": "Mantel Blanco Clásico", "descripcion": "Mantel blanco de alta calidad para eventos elegantes", "precio": 12.00, "stock": 80},
                {"nombre": "Mantel Color Ivory", "descripcion": "Mantel color marfil para bodas y eventos sofisticados", "precio": 15.00, "stock": 60},
                {"nombre": "Servilletas Premium", "descripcion": "Juego de 10 servilletas de tela de primera calidad", "precio": 8.00, "stock": 100}
            ],
            "Carpas": [
                {"nombre": "Carpa 3x3m", "descripcion": "Carpa básica para 15 personas, ideal para eventos pequeños", "precio": 120.00, "stock": 8},
                {"nombre": "Carpa 6x6m", "descripcion": "Carpa grande para 50 personas, perfecta para fiestas", "precio": 200.00, "stock": 5},
                {"nombre": "Toldo Lateral", "descripcion": "Panel lateral para carpas, protección contra viento", "precio": 25.00, "stock": 20}
            ],
            "Iluminación": [
                {"nombre": "Luces Cálidas LED", "descripcion": "Cadena de luces LED para ambiente cálido y romántico", "precio": 18.00, "stock": 30},
                {"nombre": "Reflector LED", "descripcion": "Reflector potente para iluminar áreas amplias", "precio": 35.00, "stock": 15},
                {"nombre": "Luces de Colores", "descripcion": "Sistema de luces multicolor para fiestas", "precio": 28.00, "stock": 20}
            ],
            "Audio": [
                {"nombre": "Sistema de Audio Básico", "descripcion": "Equipo de sonido para eventos pequeños con micrófono", "precio": 80.00, "stock": 10},
                {"nombre": "Micrófono Inalámbrico", "descripcion": "Micrófono profesional para discursos y presentaciones", "precio": 25.00, "stock": 15},
                {"nombre": "Bocina Bluetooth", "descripcion": "Bocina portátil para música de fondo", "precio": 35.00, "stock": 12}
            ]
        }
        
        # Agregar productos a cada categoría
        productos_agregados = 0
        for categoria in categorias:
            if categoria.nombre in productos_por_categoria:
                for producto_data in productos_por_categoria[categoria.nombre]:
                    # Verificar si el producto ya existe
                    existing = db.query(Producto).filter(
                        Producto.nombre == producto_data["nombre"],
                        Producto.categoria_id == categoria.categoria_id
                    ).first()
                    
                    if not existing:
                        producto = Producto(
                            categoria_id=categoria.categoria_id,
                            codigo_producto=f"P{categoria.categoria_id:02d}{productos_agregados + 1:03d}",
                            nombre=producto_data["nombre"],
                            descripcion=producto_data["descripcion"],
                            precio_por_dia=producto_data["precio"],
                            stock_total=producto_data["stock"],
                            stock_disponible=producto_data["stock"],
                            estado="disponible",
                            imagen_url="/images/silla.jpg",  # Imagen por defecto
                            requiere_deposito=True,
                            deposito_cantidad=producto_data["precio"] * 0.5  # 50% del precio como depósito
                        )
                        db.add(producto)
                        productos_agregados += 1
                        logger.info(f"Agregado: {producto_data['nombre']} en categoría {categoria.nombre}")
        
        db.commit()
        logger.info(f"Se agregaron {productos_agregados} productos exitosamente")
        
    except Exception as e:
        logger.error(f"Error al agregar productos: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Agregando productos de muestra...")
    add_sample_products()
    logger.info("Proceso completado")