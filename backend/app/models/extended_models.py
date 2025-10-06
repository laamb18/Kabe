# Continuación de los modelos

from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from .models import TipoPago, MetodoPago, EstadoPago, TipoMovimiento

# Modelo SolicitudProducto (tabla intermedia)
class SolicitudProducto(Base):
    __tablename__ = "solicitud_productos"

    solicitud_producto_id = Column(Integer, primary_key=True, index=True)
    solicitud_id = Column(Integer, ForeignKey("solicitudes.solicitud_id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.producto_id"), nullable=False)
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(12, 2), nullable=False)
    observaciones = Column(Text)

    # Relaciones
    solicitud = relationship("Solicitud", back_populates="solicitud_productos")
    producto = relationship("Producto", back_populates="solicitud_productos")

# Modelo SolicitudPaquete (tabla intermedia)
class SolicitudPaquete(Base):
    __tablename__ = "solicitud_paquetes"

    solicitud_paquete_id = Column(Integer, primary_key=True, index=True)
    solicitud_id = Column(Integer, ForeignKey("solicitudes.solicitud_id"), nullable=False)
    paquete_id = Column(Integer, ForeignKey("paquetes.paquete_id"), nullable=False)
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(Numeric(12, 2), nullable=False)
    descuento_aplicado = Column(Numeric(5, 2), default=0.00)
    subtotal = Column(Numeric(12, 2), nullable=False)
    observaciones = Column(Text)

    # Relaciones
    solicitud = relationship("Solicitud", back_populates="solicitud_paquetes")
    paquete = relationship("Paquete", back_populates="solicitud_paquetes")

# Modelo Pago
class Pago(Base):
    __tablename__ = "pagos"

    pago_id = Column(Integer, primary_key=True, index=True)
    solicitud_id = Column(Integer, ForeignKey("solicitudes.solicitud_id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False)
    numero_transaccion = Column(String(100), index=True)
    tipo_pago = Column(Enum(TipoPago), nullable=False)
    metodo_pago = Column(Enum(MetodoPago), nullable=False)
    monto = Column(Numeric(12, 2), nullable=False)
    fecha_pago = Column(DateTime(timezone=True), server_default=func.now())
    estado_pago = Column(Enum(EstadoPago), default=EstadoPago.completado)
    observaciones = Column(Text)

    # Relaciones
    solicitud = relationship("Solicitud", back_populates="pagos")
    usuario = relationship("Usuario", back_populates="pagos")

# Modelo InventarioHistorial
class InventarioHistorial(Base):
    __tablename__ = "inventario_historial"

    historial_id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("productos.producto_id"), nullable=False)
    solicitud_id = Column(Integer, ForeignKey("solicitudes.solicitud_id"))
    tipo_movimiento = Column(Enum(TipoMovimiento), nullable=False, index=True)
    cantidad = Column(Integer, nullable=False)
    stock_anterior = Column(Integer, nullable=False)
    stock_nuevo = Column(Integer, nullable=False)
    fecha_movimiento = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    observaciones = Column(Text)
    usuario_responsable = Column(Integer, ForeignKey("usuarios.usuario_id"))

    # Relaciones
    producto = relationship("Producto", back_populates="historial_inventario")
    solicitud = relationship("Solicitud", back_populates="historial_inventario")

# Modelo Mantenimiento
class Mantenimiento(Base):
    __tablename__ = "mantenimientos"

    mantenimiento_id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("productos.producto_id"), nullable=False)
    tipo_mantenimiento = Column(Enum("preventivo", "correctivo", "limpieza", name="tipo_mantenimiento"), nullable=False, index=True)
    descripcion = Column(Text, nullable=False)
    fecha_programada = Column(DateTime(timezone=True), nullable=False, index=True)
    fecha_realizada = Column(DateTime(timezone=True))
    costo = Column(Numeric(10, 2), default=0.00)
    estado = Column(Enum("programado", "en_proceso", "completado", "cancelado", name="estado_mantenimiento"), default="programado", index=True)
    proveedor_servicio = Column(String(200))
    observaciones = Column(Text)
    usuario_responsable = Column(Integer, ForeignKey("usuarios.usuario_id"))

    # Relaciones
    producto = relationship("Producto", back_populates="mantenimientos")

# Modelo Configuraciones
class Configuracion(Base):
    __tablename__ = "configuraciones"

    config_id = Column(Integer, primary_key=True, index=True)
    clave = Column(String(100), unique=True, nullable=False, index=True)
    valor = Column(Text, nullable=False)
    descripcion = Column(Text)
    tipo_dato = Column(Enum("string", "number", "boolean", "json", name="tipo_dato"), default="string")
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())