from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

# Enums para los estados
class EstadoProducto(str, enum.Enum):
    disponible = "disponible"
    rentado = "rentado"
    mantenimiento = "mantenimiento"
    fuera_servicio = "fuera_servicio"

class EstadoSolicitud(str, enum.Enum):
    borrador = "borrador"
    pendiente = "pendiente"
    confirmada = "confirmada"
    en_preparacion = "en_preparacion"
    entregada = "entregada"
    devuelta = "devuelta"
    cancelada = "cancelada"

class TipoMovimiento(str, enum.Enum):
    entrada = "entrada"
    salida = "salida"
    devolucion = "devolucion"
    mantenimiento = "mantenimiento"
    perdida = "perdida"
    ajuste = "ajuste"

class TipoPago(str, enum.Enum):
    anticipo = "anticipo"
    deposito = "deposito"
    pago_final = "pago_final"
    devolucion_deposito = "devolucion_deposito"

class MetodoPago(str, enum.Enum):
    efectivo = "efectivo"
    transferencia = "transferencia"
    tarjeta = "tarjeta"
    paypal = "paypal"

class EstadoPago(str, enum.Enum):
    pendiente = "pendiente"
    completado = "completado"
    fallido = "fallido"
    reembolsado = "reembolsado"

# Modelo Usuario
class Usuario(Base):
    __tablename__ = "usuarios"

    usuario_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    telefono = Column(String(20))
    direccion = Column(Text)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relaciones
    solicitudes = relationship("Solicitud", back_populates="usuario")
    pagos = relationship("Pago", back_populates="usuario")

# Modelo Administrador
class Administrador(Base):
    __tablename__ = "administradores"

    admin_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

# Modelo Categoria
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

# Modelo Producto
class Producto(Base):
    __tablename__ = "productos"

    producto_id = Column(Integer, primary_key=True, index=True)
    categoria_id = Column(Integer, ForeignKey("categorias.categoria_id"), nullable=False)
    codigo = Column(String(50), unique=True, nullable=False, index=True)
    nombre = Column(String(200), nullable=False, index=True)
    descripcion = Column(Text)
    precio_por_dia = Column(Numeric(10, 2), nullable=False, index=True)
    stock_total = Column(Integer, nullable=False, default=0)
    stock_disponible = Column(Integer, nullable=False, default=0)
    estado = Column(Enum(EstadoProducto), default=EstadoProducto.disponible, index=True)
    imagen_principal = Column(String(500))
    imagenes_adicionales = Column(Text)
    especificaciones = Column(Text)
    observaciones = Column(Text)
    requiere_deposito = Column(Boolean, default=True)
    monto_deposito = Column(Numeric(10, 2), default=0.00)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relaciones
    categoria = relationship("Categoria", back_populates="productos")
    historial_inventario = relationship("InventarioHistorial", back_populates="producto")
    mantenimientos = relationship("Mantenimiento", back_populates="producto")
    solicitud_productos = relationship("SolicitudProducto", back_populates="producto")
    paquete_productos = relationship("PaqueteProducto", back_populates="producto")

# Modelo Paquete
class Paquete(Base):
    __tablename__ = "paquetes"

    paquete_id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(50), unique=True, nullable=False)
    nombre = Column(String(200), nullable=False, index=True)
    descripcion = Column(Text)
    precio_por_dia = Column(Numeric(12, 2), nullable=False, index=True)
    descuento_porcentaje = Column(Numeric(5, 2), default=0.00)
    imagen_url = Column(String(500))
    personas_sugeridas = Column(Integer)
    activo = Column(Boolean, default=True, index=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relaciones
    paquete_productos = relationship("PaqueteProducto", back_populates="paquete")
    solicitud_paquetes = relationship("SolicitudPaquete", back_populates="paquete")

# Modelo PaqueteProducto (tabla intermedia)
class PaqueteProducto(Base):
    __tablename__ = "paquete_productos"

    paquete_producto_id = Column(Integer, primary_key=True, index=True)
    paquete_id = Column(Integer, ForeignKey("paquetes.paquete_id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.producto_id"), nullable=False)
    cantidad = Column(Integer, nullable=False)
    es_opcional = Column(Boolean, default=False)

    # Relaciones
    paquete = relationship("Paquete", back_populates="paquete_productos")
    producto = relationship("Producto", back_populates="paquete_productos")

# Modelo Solicitud
class Solicitud(Base):
    __tablename__ = "solicitudes"

    solicitud_id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False)
    numero_solicitud = Column(String(50), unique=True, nullable=False, index=True)
    fecha_evento = Column(DateTime(timezone=True), nullable=False, index=True)
    hora_inicio = Column(String(10))
    hora_fin = Column(String(10))
    direccion_evento = Column(Text, nullable=False)
    tipo_evento = Column(String(100))
    numero_invitados = Column(Integer)
    subtotal = Column(Numeric(12, 2), nullable=False, default=0.00)
    descuentos = Column(Numeric(12, 2), default=0.00)
    impuestos = Column(Numeric(12, 2), default=0.00)
    total = Column(Numeric(12, 2), nullable=False, default=0.00)
    deposito_requerido = Column(Numeric(12, 2), default=0.00)
    estado = Column(Enum(EstadoSolicitud), default=EstadoSolicitud.borrador, index=True)
    observaciones = Column(Text)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relaciones
    usuario = relationship("Usuario", back_populates="solicitudes")
    solicitud_productos = relationship("SolicitudProducto", back_populates="solicitud")
    solicitud_paquetes = relationship("SolicitudPaquete", back_populates="solicitud")
    pagos = relationship("Pago", back_populates="solicitud")
    historial_inventario = relationship("InventarioHistorial", back_populates="solicitud")