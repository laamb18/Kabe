from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal

# Schemas para SolicitudProducto
class SolicitudProductoBase(BaseModel):
    producto_id: int
    cantidad_solicitada: int
    precio_unitario: Decimal
    dias_renta: int
    subtotal: Decimal
    deposito_unitario: Optional[Decimal] = Decimal("0.00")
    deposito_total: Optional[Decimal] = Decimal("0.00")

class SolicitudProductoCreate(SolicitudProductoBase):
    pass

class SolicitudProductoResponse(SolicitudProductoBase):
    solicitud_producto_id: int
    solicitud_id: int
    producto_nombre: Optional[str] = None
    producto_codigo: Optional[str] = None

    class Config:
        from_attributes = True

# Schemas para SolicitudPaquete
class SolicitudPaqueteBase(BaseModel):
    paquete_id: int
    cantidad_solicitada: int
    precio_unitario: Decimal
    dias_renta: int
    subtotal: Decimal

class SolicitudPaqueteCreate(SolicitudPaqueteBase):
    pass

class SolicitudPaqueteResponse(SolicitudPaqueteBase):
    solicitud_paquete_id: int
    solicitud_id: int
    paquete_nombre: Optional[str] = None
    paquete_codigo: Optional[str] = None

    class Config:
        from_attributes = True

# Schemas para Solicitud
class SolicitudBase(BaseModel):
    fecha_evento_inicio: date
    fecha_evento_fin: date
    direccion_evento: Optional[str] = None
    tipo_evento: Optional[str] = None
    num_personas_estimado: Optional[int] = None
    observaciones_cliente: Optional[str] = None

class SolicitudCreate(SolicitudBase):
    productos: List[SolicitudProductoCreate] = []
    paquetes: List[SolicitudPaqueteCreate] = []

class SolicitudUpdate(BaseModel):
    fecha_evento_inicio: Optional[date] = None
    fecha_evento_fin: Optional[date] = None
    direccion_evento: Optional[str] = None
    tipo_evento: Optional[str] = None
    num_personas_estimado: Optional[int] = None
    observaciones_cliente: Optional[str] = None
    estado: Optional[str] = None

class SolicitudResponse(SolicitudBase):
    solicitud_id: int
    usuario_id: int
    numero_solicitud: str
    estado: str
    observaciones_admin: Optional[str] = None
    subtotal: Decimal
    descuento: Decimal
    impuestos: Decimal
    deposito_total: Decimal
    total_cotizacion: Decimal
    fecha_solicitud: datetime
    fecha_respuesta: Optional[datetime] = None
    fecha_entrega: Optional[datetime] = None
    fecha_devolucion: Optional[datetime] = None
    solicitud_productos: List[SolicitudProductoResponse] = []
    solicitud_paquetes: List[SolicitudPaqueteResponse] = []

    class Config:
        from_attributes = True

# Schema simplificado para listado
class SolicitudListResponse(BaseModel):
    solicitud_id: int
    numero_solicitud: str
    fecha_evento_inicio: date
    fecha_evento_fin: date
    tipo_evento: Optional[str] = None
    num_personas_estimado: Optional[int] = None
    estado: str
    total_cotizacion: Decimal
    fecha_solicitud: datetime
    total_productos: int = 0
    total_paquetes: int = 0

    class Config:
        from_attributes = True
