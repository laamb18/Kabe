from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from decimal import Decimal


# ============================================
# SCHEMAS PARA PAGOS
# ============================================

class PagoBase(BaseModel):
    solicitud_id: int
    tipo_pago: str = Field(..., description="anticipo, deposito, pago_final, devolucion_deposito")
    metodo_pago: str = Field(..., description="efectivo, transferencia, tarjeta, paypal")
    monto: Decimal
    observaciones: Optional[str] = None


class PagoCreate(PagoBase):
    tarjeta_id: Optional[int] = None  # Si el método es tarjeta
    
    @validator('tipo_pago')
    def validar_tipo_pago(cls, v):
        tipos_validos = ['anticipo', 'deposito', 'pago_final', 'devolucion_deposito']
        if v not in tipos_validos:
            raise ValueError(f'Tipo de pago debe ser uno de: {", ".join(tipos_validos)}')
        return v
    
    @validator('metodo_pago')
    def validar_metodo_pago(cls, v):
        metodos_validos = ['efectivo', 'transferencia', 'tarjeta', 'paypal']
        if v not in metodos_validos:
            raise ValueError(f'Método de pago debe ser uno de: {", ".join(metodos_validos)}')
        return v


class PagoResponse(PagoBase):
    pago_id: int
    usuario_id: int
    numero_transaccion: Optional[str]
    estado_pago: str
    fecha_pago: datetime
    
    class Config:
        from_attributes = True


class PagoListResponse(BaseModel):
    pagos: list[PagoResponse]
    total: int


# ============================================
# SCHEMAS PARA TARJETAS
# ============================================

class TarjetaBase(BaseModel):
    tipo_tarjeta: str = Field(..., description="credito o debito")
    marca: str = Field(..., description="visa, mastercard, amex, otro")
    nombre_titular: str = Field(..., min_length=3, max_length=200)
    mes_expiracion: int = Field(..., ge=1, le=12)
    anio_expiracion: int = Field(..., ge=2024)


class TarjetaCreate(BaseModel):
    tipo_tarjeta: str = Field(..., description="credito o debito")
    marca: str = Field(..., description="visa, mastercard, amex, otro")
    numero_completo: str = Field(..., description="Solo para tokenización, no se guarda")
    nombre_titular: str = Field(..., min_length=3, max_length=200)
    mes_expiracion: int = Field(..., ge=1, le=12)
    anio_expiracion: int = Field(..., ge=2024)
    cvv: str = Field(..., min_length=3, max_length=4, description="Solo para validación, no se guarda")
    es_predeterminada: bool = False
    
    @validator('tipo_tarjeta')
    def validar_tipo(cls, v):
        if v not in ['credito', 'debito']:
            raise ValueError('Tipo debe ser credito o debito')
        return v
    
    @validator('marca')
    def validar_marca(cls, v):
        if v not in ['visa', 'mastercard', 'amex', 'otro']:
            raise ValueError('Marca debe ser visa, mastercard, amex u otro')
        return v
    
    @validator('numero_completo')
    def validar_numero(cls, v):
        # Eliminar espacios y guiones
        numero = v.replace(' ', '').replace('-', '')
        if not numero.isdigit():
            raise ValueError('El número de tarjeta debe contener solo dígitos')
        if len(numero) < 13 or len(numero) > 19:
            raise ValueError('El número de tarjeta debe tener entre 13 y 19 dígitos')
        return numero


class TarjetaUpdate(BaseModel):
    nombre_titular: Optional[str] = None
    mes_expiracion: Optional[int] = Field(None, ge=1, le=12)
    anio_expiracion: Optional[int] = Field(None, ge=2024)
    es_predeterminada: Optional[bool] = None


class TarjetaResponse(BaseModel):
    tarjeta_id: int
    usuario_id: int
    tipo_tarjeta: str
    marca: str
    ultimos_digitos: str
    nombre_titular: str
    mes_expiracion: int
    anio_expiracion: int
    es_predeterminada: bool
    activa: bool
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    
    # Campos calculados
    esta_expirada: bool = False
    expira_pronto: bool = False
    
    class Config:
        from_attributes = True


class TarjetaListResponse(BaseModel):
    tarjetas: list[TarjetaResponse]
    total: int
