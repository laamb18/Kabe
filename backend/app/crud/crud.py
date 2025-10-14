from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.models import Categoria, Producto, Usuario, Administrador, Paquete
from app.core.auth import hash_password
from typing import List, Optional

class CategoriasCRUD:
    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Categoria]:
        """Obtener todas las categorías activas"""
        return db.query(Categoria).filter(Categoria.activo == True).offset(skip).limit(limit).all()
    
    def get_all_admin(self, db: Session, skip: int = 0, limit: int = 100) -> List[Categoria]:
        """Obtener todas las categorías (para administrador)"""
        return db.query(Categoria).offset(skip).limit(limit).all()
    
    def get_by_id(self, db: Session, categoria_id: int) -> Optional[Categoria]:
        """Obtener categoría por ID"""
        return db.query(Categoria).filter(Categoria.categoria_id == categoria_id).first()
    
    def create_categoria(self, db: Session, categoria_data: dict) -> Categoria:
        """Crear nueva categoría"""
        db_categoria = Categoria(**categoria_data)
        db.add(db_categoria)
        db.commit()
        db.refresh(db_categoria)
        return db_categoria
    
    def update_categoria(self, db: Session, categoria_id: int, categoria_data: dict) -> Optional[Categoria]:
        """Actualizar categoría"""
        db_categoria = self.get_by_id(db, categoria_id)
        if not db_categoria:
            return None
        
        for key, value in categoria_data.items():
            if hasattr(db_categoria, key):
                setattr(db_categoria, key, value)
        
        db.commit()
        db.refresh(db_categoria)
        return db_categoria
    
    def delete_categoria(self, db: Session, categoria_id: int) -> bool:
        """Eliminar categoría (soft delete)"""
        db_categoria = self.get_by_id(db, categoria_id)
        if not db_categoria:
            return False
        
        db_categoria.activo = False
        db.commit()
        return True

class ProductosCRUD:
    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Producto]:
        """Obtener todos los productos disponibles"""
        return db.query(Producto).filter(Producto.estado == "disponible").offset(skip).limit(limit).all()
    
    def get_all_admin(self, db: Session, skip: int = 0, limit: int = 100) -> List[Producto]:
        """Obtener todos los productos (para administrador)"""
        return db.query(Producto).offset(skip).limit(limit).all()
    
    def get_by_categoria(self, db: Session, categoria_id: int, skip: int = 0, limit: int = 100) -> List[Producto]:
        """Obtener productos por categoría"""
        return db.query(Producto).filter(
            Producto.categoria_id == categoria_id,
            Producto.estado == "disponible"
        ).offset(skip).limit(limit).all()
    
    def get_by_id(self, db: Session, producto_id: int) -> Optional[Producto]:
        """Obtener producto por ID"""
        return db.query(Producto).filter(Producto.producto_id == producto_id).first()
    
    def create_producto(self, db: Session, producto_data: dict) -> Producto:
        """Crear nuevo producto"""
        try:
            db_producto = Producto(**producto_data)
            db.add(db_producto)
            db.commit()
            db.refresh(db_producto)
            return db_producto
        except Exception as e:
            db.rollback()
            raise e
    
    def update_producto(self, db: Session, producto_id: int, producto_data: dict) -> Optional[Producto]:
        """Actualizar producto"""
        db_producto = self.get_by_id(db, producto_id)
        if not db_producto:
            return None
        
        # Actualizar solo los campos que se proporcionan
        for key, value in producto_data.items():
            if hasattr(db_producto, key):
                # Manejar campos especiales
                if key == 'especificaciones' and isinstance(value, str):
                    # Si especificaciones viene como string, mantenerlo como string
                    setattr(db_producto, key, value)
                elif key in ['requiere_deposito', 'activo'] and isinstance(value, str):
                    # Convertir strings a boolean para campos boolean
                    setattr(db_producto, key, value.lower() in ('true', '1', 'yes', 'on'))
                else:
                    setattr(db_producto, key, value)
        
        try:
            db.commit()
            db.refresh(db_producto)
            return db_producto
        except Exception as e:
            db.rollback()
            raise e
    
    def delete_producto(self, db: Session, producto_id: int) -> bool:
        """Eliminar producto (cambiar estado a inactivo)"""
        db_producto = self.get_by_id(db, producto_id)
        if not db_producto:
            return False
        
        try:
            # Cambiar estado a inactivo en lugar de eliminar físicamente
            db_producto.estado = "inactivo"
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            raise e
    
    def delete_producto_permanently(self, db: Session, producto_id: int) -> bool:
        """Eliminar producto permanentemente de la base de datos"""
        db_producto = self.get_by_id(db, producto_id)
        if not db_producto:
            return False
        
        try:
            db.delete(db_producto)
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            raise e
    
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
                p.imagen_dato,
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

class UsuariosCRUD:
    def get_by_email(self, db: Session, email: str) -> Optional[Usuario]:
        """Obtener usuario por email"""
        return db.query(Usuario).filter(Usuario.email == email).first()
    
    def get_by_id(self, db: Session, usuario_id: int) -> Optional[Usuario]:
        """Obtener usuario por ID"""
        return db.query(Usuario).filter(Usuario.usuario_id == usuario_id).first()
    
    def create_usuario(self, db: Session, usuario_data: dict) -> Usuario:
        """Crear nuevo usuario"""
        # Hash de la contraseña
        hashed_password = hash_password(usuario_data['password'])
        
        # Crear usuario con campos separados
        db_usuario = Usuario(
            nombre=usuario_data['nombre'],
            apellido=usuario_data['apellido'],
            email=usuario_data['email'],
            password=hashed_password,
            telefono=usuario_data.get('telefono', ''),
            direccion=usuario_data.get('direccion', '')
        )
        
        db.add(db_usuario)
        db.commit()
        db.refresh(db_usuario)
        return db_usuario
    
    def email_exists(self, db: Session, email: str) -> bool:
        """Verificar si un email ya existe"""
        return db.query(Usuario).filter(Usuario.email == email).first() is not None
    
    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Usuario]:
        """Obtener todos los usuarios"""
        return db.query(Usuario).offset(skip).limit(limit).all()
    
    def update_usuario(self, db: Session, usuario_id: int, usuario_data: dict) -> Optional[Usuario]:
        """Actualizar usuario"""
        db_usuario = self.get_by_id(db, usuario_id)
        if not db_usuario:
            return None
        
        for key, value in usuario_data.items():
            if key == 'password' and value:
                setattr(db_usuario, key, hash_password(value))
            elif hasattr(db_usuario, key):
                setattr(db_usuario, key, value)
        
        db.commit()
        db.refresh(db_usuario)
        return db_usuario
    
    def delete_usuario(self, db: Session, usuario_id: int) -> bool:
        """Eliminar usuario"""
        db_usuario = self.get_by_id(db, usuario_id)
        if not db_usuario:
            return False
        
        db.delete(db_usuario)
        db.commit()
        return True

class AdministradoresCRUD:
    def get_by_email(self, db: Session, email: str) -> Optional[Administrador]:
        """Obtener administrador por email"""
        return db.query(Administrador).filter(Administrador.email == email).first()
    
    def get_by_id(self, db: Session, admin_id: int) -> Optional[Administrador]:
        """Obtener administrador por ID"""
        return db.query(Administrador).filter(Administrador.admin_id == admin_id).first()
    
    def create_administrador(self, db: Session, admin_data: dict) -> Administrador:
        """Crear nuevo administrador"""
        hashed_password = hash_password(admin_data['password'])
        
        db_admin = Administrador(
            nombre=admin_data['nombre'],
            apellido=admin_data['apellido'],
            email=admin_data['email'],
            password=hashed_password
        )
        
        db.add(db_admin)
        db.commit()
        db.refresh(db_admin)
        return db_admin
    
    def email_exists(self, db: Session, email: str) -> bool:
        """Verificar si un email de administrador ya existe"""
        return db.query(Administrador).filter(Administrador.email == email).first() is not None
    
    def get_admin_stats(self, db: Session):
        """Obtener estadísticas para el dashboard de administrador"""
        # Productos más pedidos (simulado por ahora)
        productos_populares = text("""
            SELECT p.producto_id, p.nombre, p.categoria_id, c.nombre as categoria_nombre,
                   p.stock_total - p.stock_disponible as veces_pedido
            FROM productos p
            INNER JOIN categorias c ON p.categoria_id = c.categoria_id
            WHERE p.estado = 'disponible'
            ORDER BY veces_pedido DESC
            LIMIT 10
        """)
        
        # Categorías más populares
        categorias_populares = text("""
            SELECT c.categoria_id, c.nombre, 
                   COUNT(p.producto_id) as total_productos,
                   SUM(p.stock_total - p.stock_disponible) as total_pedidos
            FROM categorias c
            LEFT JOIN productos p ON c.categoria_id = p.categoria_id
            WHERE c.activo = 1 AND p.estado = 'disponible'
            GROUP BY c.categoria_id, c.nombre
            ORDER BY total_pedidos DESC
            LIMIT 10
        """)
        
        # Estadísticas generales incluyendo paquetes
        stats_generales = text("""
            SELECT 
                (SELECT COUNT(*) FROM productos WHERE estado = 'disponible') as total_productos,
                (SELECT COUNT(*) FROM categorias WHERE activo = 1) as total_categorias,
                (SELECT COUNT(*) FROM paquetes WHERE activo = 1) as total_paquetes,
                (SELECT COUNT(*) FROM usuarios) as total_usuarios,
                (SELECT SUM(stock_total - stock_disponible) FROM productos) as total_pedidos
        """)
        
        return {
            'productos_populares': db.execute(productos_populares).fetchall(),
            'categorias_populares': db.execute(categorias_populares).fetchall(),
            'stats_generales': db.execute(stats_generales).fetchone()
        }

class PaquetesCRUD:
    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Paquete]:
        """Obtener todos los paquetes activos"""
        return db.query(Paquete).filter(Paquete.activo == True).offset(skip).limit(limit).all()
    
    def get_all_admin(self, db: Session, skip: int = 0, limit: int = 100) -> List[Paquete]:
        """Obtener todos los paquetes (para administrador)"""
        return db.query(Paquete).offset(skip).limit(limit).all()
    
    def get_by_id(self, db: Session, paquete_id: int) -> Optional[Paquete]:
        """Obtener paquete por ID"""
        return db.query(Paquete).filter(Paquete.paquete_id == paquete_id).first()
    
    def create_paquete(self, db: Session, paquete_data: dict) -> Paquete:
        """Crear nuevo paquete"""
        try:
            db_paquete = Paquete(**paquete_data)
            db.add(db_paquete)
            db.commit()
            db.refresh(db_paquete)
            return db_paquete
        except Exception as e:
            db.rollback()
            raise e
    
    def update_paquete(self, db: Session, paquete_id: int, paquete_data: dict) -> Optional[Paquete]:
        """Actualizar paquete"""
        db_paquete = self.get_by_id(db, paquete_id)
        if not db_paquete:
            return None
        
        # Actualizar solo los campos que se proporcionan
        for key, value in paquete_data.items():
            if hasattr(db_paquete, key):
                # Manejar campos especiales
                if key == 'activo' and isinstance(value, str):
                    # Convertir strings a boolean para campos boolean
                    setattr(db_paquete, key, value.lower() in ('true', '1', 'yes', 'on'))
                else:
                    setattr(db_paquete, key, value)
        
        try:
            db.commit()
            db.refresh(db_paquete)
            return db_paquete
        except Exception as e:
            db.rollback()
            raise e
    
    def delete_paquete(self, db: Session, paquete_id: int) -> bool:
        """Eliminar paquete (cambiar estado a inactivo)"""
        db_paquete = self.get_by_id(db, paquete_id)
        if not db_paquete:
            return False
        
        try:
            # Cambiar estado a inactivo en lugar de eliminar físicamente
            db_paquete.activo = False
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            raise e
    
    def delete_paquete_permanently(self, db: Session, paquete_id: int) -> bool:
        """Eliminar paquete permanentemente de la base de datos"""
        db_paquete = self.get_by_id(db, paquete_id)
        if not db_paquete:
            return False
        
        try:
            db.delete(db_paquete)
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            raise e

# Instancias para usar en los endpoints
categorias_crud = CategoriasCRUD()
productos_crud = ProductosCRUD()
usuarios_crud = UsuariosCRUD()
administradores_crud = AdministradoresCRUD()
paquetes_crud = PaquetesCRUD()
