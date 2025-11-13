from sqlalchemy import Column, Integer, String, Enum, DECIMAL, TIMESTAMP, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..core.database import Base


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


class Pago(Base):
    __tablename__ = "pagos"
    
    pago_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    solicitud_id = Column(Integer, ForeignKey("solicitudes.solicitud_id"), nullable=False, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False, index=True)
    numero_transaccion = Column(String(100), unique=True, index=True)
    tipo_pago = Column(Enum(TipoPago), nullable=False, index=True)
    metodo_pago = Column(Enum(MetodoPago), nullable=False)
    monto = Column(DECIMAL(12, 2), nullable=False)
    fecha_pago = Column(TIMESTAMP, server_default=func.current_timestamp(), index=True)
    estado_pago = Column(Enum(EstadoPago), default=EstadoPago.completado, index=True)
    observaciones = Column(Text)
    
    # Relaciones
    solicitud = relationship("Solicitud", back_populates="pagos")
    usuario = relationship("Usuario", back_populates="pagos")


class TipoTarjeta(str, enum.Enum):
    credito = "credito"
    debito = "debito"


class MarcaTarjeta(str, enum.Enum):
    visa = "visa"
    mastercard = "mastercard"
    amex = "amex"
    otro = "otro"


class TarjetaUsuario(Base):
    __tablename__ = "tarjetas_usuario"
    
    tarjeta_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False, index=True)
    tipo_tarjeta = Column(Enum(TipoTarjeta), nullable=False)
    marca = Column(Enum(MarcaTarjeta), nullable=False)
    ultimos_digitos = Column(String(4), nullable=False)
    nombre_titular = Column(String(200), nullable=False)
    mes_expiracion = Column(Integer, nullable=False)  # 1-12
    anio_expiracion = Column(Integer, nullable=False)  # YYYY
    es_predeterminada = Column(Boolean, default=False)
    token_pasarela = Column(String(255))  # Token de la pasarela de pagos
    fecha_creacion = Column(TIMESTAMP, server_default=func.current_timestamp())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    activa = Column(Boolean, default=True)
    
    # Relación
    usuario = relationship("Usuario", back_populates="tarjetas")
