from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, Boolean, ForeignKey, Enum, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

# Modelo Categoria (coincide con tu BD)
class Categoria(Base):
    __tablename__ = "categorias"

    categoria_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), unique=True, nullable=False, index=True)
    descripcion = Column(Text)
    imagen_url = Column(String(500))
    activo = Column(Boolean, default=True, index=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    productos = relationship("Producto", back_populates="categoria")

# Modelo Producto (coincide exactamente con tu BD)
class Producto(Base):
    __tablename__ = "productos"

    producto_id = Column(Integer, primary_key=True, index=True)
    categoria_id = Column(Integer, ForeignKey("categorias.categoria_id"), nullable=False)
    codigo_producto = Column(String(50), unique=True, nullable=False)
    nombre = Column(String(200), nullable=False)
    descripcion = Column(Text)
    precio_por_dia = Column(Numeric(10, 2), nullable=False)
    stock_total = Column(Integer, nullable=False)
    stock_disponible = Column(Integer, nullable=False)
    estado = Column(String(20), default="disponible")  # enum: disponible, mantenimiento, inactivo
    especificaciones = Column(Text)  # Es JSON en BD pero usamos Text por compatibilidad
    dimensiones = Column(String(100))
    peso = Column(Numeric(8, 2))
    imagen_url = Column(String(500))
    requiere_deposito = Column(Boolean, default=False)
    deposito_cantidad = Column(Numeric(10, 2))
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relaciones
    categoria = relationship("Categoria", back_populates="productos")

# Modelo Usuario (coincide con tu BD)
class Usuario(Base):
    __tablename__ = "usuarios"

    usuario_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    telefono = Column(String(20))
    direccion = Column(Text)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

# Modelo Administrador (coincide con tu BD)
class Administrador(Base):
    __tablename__ = "administradores"

    admin_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

# Modelo Paquete (coincide exactamente con tu BD)
class Paquete(Base):
    __tablename__ = "paquetes"

    paquete_id = Column(Integer, primary_key=True, index=True)
    codigo_paquete = Column(String(50), unique=True, nullable=False)
    nombre = Column(String(200), nullable=False)
    descripcion = Column(Text)
    precio_por_dia = Column(Numeric(10, 2), nullable=False, index=True)
    descuento_porcentaje = Column(Numeric(5, 2), default=0.00)
    imagen_url = Column(String(500))
    capacidad_personas = Column(Integer, index=True)
    activo = Column(Boolean, default=True, index=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

# Modelo Configuracion (coincide con tu BD)
class Configuracion(Base):
    __tablename__ = "configuraciones"

    config_id = Column(Integer, primary_key=True, index=True)
    clave = Column(String(100), unique=True, nullable=False, index=True)
    valor = Column(Text, nullable=False)
    descripcion = Column(Text)
    tipo_dato = Column(String(20), default="string")
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())