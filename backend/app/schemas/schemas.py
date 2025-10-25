from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Schema para Categoría
class CategoriaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    activo: bool = True

class Categoria(CategoriaBase):
    categoria_id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True

# Schema para Producto
class ProductoBase(BaseModel):
    categoria_id: int
    codigo_producto: str
    nombre: str
    descripcion: Optional[str] = None
    precio_por_dia: float
    stock_total: int
    stock_disponible: int
    estado: str = "disponible"
    especificaciones: Optional[str] = None
    dimensiones: Optional[str] = None
    peso: Optional[float] = None
    imagen_dato: Optional[bytes] = None
    requiere_deposito: bool = False
    deposito_cantidad: Optional[float] = None

class Producto(ProductoBase):
    producto_id: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True

# Schema para respuesta de productos con categoría
class ProductoConCategoria(BaseModel):
    producto_id: int
    categoria_id: int
    codigo_producto: str
    nombre: str
    descripcion: Optional[str] = None
    precio_por_dia: float
    stock_total: int
    stock_disponible: int
    estado: str
    especificaciones: Optional[str] = None
    dimensiones: Optional[str] = None
    peso: Optional[float] = None
    imagen_dato: Optional[bytes] = None
    requiere_deposito: bool
    deposito_cantidad: Optional[float] = None
    categoria_nombre: str
    categoria_descripcion: Optional[str] = None

    class Config:
        from_attributes = True

# Schema para Paquete
class PaqueteBase(BaseModel):
    codigo_paquete: str
    nombre: str
    descripcion: Optional[str] = None
    precio_por_dia: float
    descuento_porcentaje: Optional[float] = 0.00
    imagen_dato: Optional[bytes] = None
    capacidad_personas: Optional[int] = None
    activo: bool = True

class Paquete(PaqueteBase):
    paquete_id: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True

# Schema para Usuario
class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    email: str
    telefono: Optional[str] = None
    direccion: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioResponse(UsuarioBase):
    usuario_id: int
    fecha_registro: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True

class Usuario(UsuarioBase):
    usuario_id: int
    fecha_registro: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True

# Schema para Administrador
class AdministradorBase(BaseModel):
    nombre: str
    apellido: str
    email: str

class AdministradorCreate(AdministradorBase):
    password: str

class AdministradorResponse(AdministradorBase):
    admin_id: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True

# Schemas para autenticación
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UsuarioResponse

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str
    admin: AdministradorResponse
    is_admin: bool = True

class MessageResponse(BaseModel):
    message: str

# Schemas para actualización de perfil de usuario
class UsuarioUpdateProfile(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    
    class Config:
        extra = "ignore"  # Ignorar campos adicionales

class UsuarioChangePassword(BaseModel):
    current_password: str
    new_password: str
    
    class Config:
        extra = "ignore"  # Ignorar campos adicionales
