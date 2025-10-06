from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.models import Categoria, Producto, Usuario
from typing import List, Optional

class CategoriasCRUD:
    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Categoria]:
        """Obtener todas las categorías activas"""
        return db.query(Categoria).filter(Categoria.activo == True).offset(skip).limit(limit).all()
    
    def get_by_id(self, db: Session, categoria_id: int) -> Optional[Categoria]:
        """Obtener categoría por ID"""
        return db.query(Categoria).filter(Categoria.categoria_id == categoria_id).first()

class ProductosCRUD:
    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Producto]:
        """Obtener todos los productos disponibles"""
        return db.query(Producto).filter(Producto.estado == "disponible").offset(skip).limit(limit).all()
    
    def get_by_categoria(self, db: Session, categoria_id: int, skip: int = 0, limit: int = 100) -> List[Producto]:
        """Obtener productos por categoría"""
        return db.query(Producto).filter(
            Producto.categoria_id == categoria_id,
            Producto.estado == "disponible"
        ).offset(skip).limit(limit).all()
    
    def get_by_id(self, db: Session, producto_id: int) -> Optional[Producto]:
        """Obtener producto por ID"""
        return db.query(Producto).filter(Producto.producto_id == producto_id).first()
    
    def get_productos_con_categoria(self, db: Session, skip: int = 0, limit: int = 100):
        """Obtener productos con información de categoría"""
        query = text("""
            SELECT 
                p.producto_id,
                p.categoria_id,
                p.codigo_producto,
                p.nombre,
                p.descripcion,
                p.precio_por_dia,
                p.stock_total,
                p.stock_disponible,
                p.estado,
                p.imagen_url,
                p.requiere_deposito,
                p.deposito_cantidad,
                c.nombre as categoria_nombre,
                c.descripcion as categoria_descripcion
            FROM productos p
            INNER JOIN categorias c ON p.categoria_id = c.categoria_id
            WHERE p.estado = 'disponible' AND c.activo = 1
            ORDER BY c.nombre, p.nombre
            LIMIT :limit OFFSET :skip
        """)
        
        result = db.execute(query, {"skip": skip, "limit": limit})
        return result.fetchall()

# Instancias para usar en los endpoints
categorias_crud = CategoriasCRUD()
productos_crud = ProductosCRUD()