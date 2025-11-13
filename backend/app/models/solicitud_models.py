from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

# Enums para estados
class EstadoSolicitud(str, enum.Enum):
    pendiente = "pendiente"
    aprobada = "aprobada"
    rechazada = "rechazada"
    en_proceso = "en_proceso"
    completada = "completada"
    cancelada = "cancelada"

# Modelo Solicitud
class Solicitud(Base):
    __tablename__ = "solicitudes"

    solicitud_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False, index=True)
    numero_solicitud = Column(String(20), unique=True, nullable=False, index=True)
    fecha_evento_inicio = Column(Date, nullable=False, index=True)
    fecha_evento_fin = Column(Date, nullable=False)
    direccion_evento = Column(Text)
    tipo_evento = Column(String(100))
    num_personas_estimado = Column(Integer)
    estado = Column(SQLEnum(EstadoSolicitud), default=EstadoSolicitud.pendiente, index=True)
    observaciones_cliente = Column(Text)
    observaciones_admin = Column(Text)
    subtotal = Column(Numeric(12, 2), default=0.00)
    descuento = Column(Numeric(12, 2), default=0.00)
    impuestos = Column(Numeric(12, 2), default=0.00)
    deposito_total = Column(Numeric(12, 2), default=0.00)
    total_cotizacion = Column(Numeric(12, 2), default=0.00)
    fecha_solicitud = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    fecha_respuesta = Column(DateTime(timezone=True))
    fecha_entrega = Column(DateTime(timezone=True))
    fecha_devolucion = Column(DateTime(timezone=True))

    # Relaciones
    solicitud_paquetes = relationship("SolicitudPaquete", back_populates="solicitud", cascade="all, delete-orphan")
    solicitud_productos = relationship("SolicitudProducto", back_populates="solicitud", cascade="all, delete-orphan")
    pagos = relationship("Pago", back_populates="solicitud")

# Modelo SolicitudPaquete
class SolicitudPaquete(Base):
    __tablename__ = "solicitud_paquetes"

    solicitud_paquete_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    solicitud_id = Column(Integer, ForeignKey("solicitudes.solicitud_id"), nullable=False, index=True)
    paquete_id = Column(Integer, ForeignKey("paquetes.paquete_id"), nullable=False, index=True)
    cantidad_solicitada = Column(Integer, nullable=False)
    precio_unitario = Column(Numeric(10, 2), nullable=False)
    dias_renta = Column(Integer, nullable=False)
    subtotal = Column(Numeric(12, 2), nullable=False)

    # Relaciones
    solicitud = relationship("Solicitud", back_populates="solicitud_paquetes")
    paquete = relationship("Paquete")

# Modelo SolicitudProducto
class SolicitudProducto(Base):
    __tablename__ = "solicitud_productos"

    solicitud_producto_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    solicitud_id = Column(Integer, ForeignKey("solicitudes.solicitud_id"), nullable=False, index=True)
    producto_id = Column(Integer, ForeignKey("productos.producto_id"), nullable=False, index=True)
    cantidad_solicitada = Column(Integer, nullable=False)
    precio_unitario = Column(Numeric(10, 2), nullable=False)
    dias_renta = Column(Integer, nullable=False)
    subtotal = Column(Numeric(12, 2), nullable=False)
    deposito_unitario = Column(Numeric(10, 2), default=0.00)
    deposito_total = Column(Numeric(12, 2), default=0.00)

    # Relaciones
    solicitud = relationship("Solicitud", back_populates="solicitud_productos")
    producto = relationship("Producto")
