from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
from app.core.database import get_db
from app.core.auth import authenticate_user, create_access_token, get_current_user
from app.core.config import settings
from app.schemas.schemas import (
    Categoria, Producto, ProductoConCategoria, 
    UsuarioCreate, UsuarioResponse, LoginRequest, LoginResponse, MessageResponse
)
from app.models.models import Usuario
from app.crud.crud import categorias_crud, productos_crud, usuarios_crud

router = APIRouter()

# ========== ENDPOINTS DE CATEGORÍAS ==========
@router.get("/categorias", response_model=List[Categoria])
def get_categorias(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todas las categorías activas"""
    try:
        categorias = categorias_crud.get_all(db, skip=skip, limit=limit)
        return categorias
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener categorías: {str(e)}")

@router.get("/categorias/{categoria_id}", response_model=Categoria)
def get_categoria(categoria_id: int, db: Session = Depends(get_db)):
    """Obtener categoría por ID"""
    categoria = categorias_crud.get_by_id(db, categoria_id=categoria_id)
    if categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria

# ========== ENDPOINTS DE PRODUCTOS ==========
@router.get("/productos")
def get_productos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todos los productos disponibles"""
    try:
        productos = productos_crud.get_all(db, skip=skip, limit=limit)
        
        # Convertir a dict para evitar problemas de validación
        result = []
        for producto in productos:
            result.append({
                "producto_id": producto.producto_id,
                "categoria_id": producto.categoria_id,
                "codigo_producto": producto.codigo_producto,
                "nombre": producto.nombre,
                "descripcion": producto.descripcion,
                "precio_por_dia": float(producto.precio_por_dia),
                "stock_total": producto.stock_total,
                "stock_disponible": producto.stock_disponible,
                "estado": producto.estado,
                "especificaciones": producto.especificaciones,
                "dimensiones": producto.dimensiones,
                "peso": float(producto.peso) if producto.peso else None,
                "imagen_url": producto.imagen_url,
                "requiere_deposito": bool(producto.requiere_deposito),
                "deposito_cantidad": float(producto.deposito_cantidad) if producto.deposito_cantidad else None,
                "fecha_creacion": producto.fecha_creacion.isoformat() if producto.fecha_creacion else None,
                "fecha_actualizacion": producto.fecha_actualizacion.isoformat() if producto.fecha_actualizacion else None
            })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener productos: {str(e)}")

@router.get("/productos/{producto_id}")
def get_producto(producto_id: int, db: Session = Depends(get_db)):
    """Obtener producto por ID"""
    producto = productos_crud.get_by_id(db, producto_id=producto_id)
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    return {
        "producto_id": producto.producto_id,
        "categoria_id": producto.categoria_id,
        "codigo_producto": producto.codigo_producto,
        "nombre": producto.nombre,
        "descripcion": producto.descripcion,
        "precio_por_dia": float(producto.precio_por_dia),
        "stock_total": producto.stock_total,
        "stock_disponible": producto.stock_disponible,
        "estado": producto.estado,
        "especificaciones": producto.especificaciones,
        "dimensiones": producto.dimensiones,
        "peso": float(producto.peso) if producto.peso else None,
        "imagen_url": producto.imagen_url,
        "requiere_deposito": bool(producto.requiere_deposito),
        "deposito_cantidad": float(producto.deposito_cantidad) if producto.deposito_cantidad else None,
        "fecha_creacion": producto.fecha_creacion.isoformat() if producto.fecha_creacion else None,
        "fecha_actualizacion": producto.fecha_actualizacion.isoformat() if producto.fecha_actualizacion else None
    }

@router.get("/productos/categoria/{categoria_id}")
def get_productos_por_categoria(categoria_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener productos por categoría"""
    try:
        productos = productos_crud.get_by_categoria(db, categoria_id=categoria_id, skip=skip, limit=limit)
        
        # Convertir a dict
        result = []
        for producto in productos:
            result.append({
                "producto_id": producto.producto_id,
                "categoria_id": producto.categoria_id,
                "codigo_producto": producto.codigo_producto,
                "nombre": producto.nombre,
                "descripcion": producto.descripcion,
                "precio_por_dia": float(producto.precio_por_dia),
                "stock_total": producto.stock_total,
                "stock_disponible": producto.stock_disponible,
                "estado": producto.estado,
                "especificaciones": producto.especificaciones,
                "dimensiones": producto.dimensiones,
                "peso": float(producto.peso) if producto.peso else None,
                "imagen_url": producto.imagen_url,
                "requiere_deposito": bool(producto.requiere_deposito),
                "deposito_cantidad": float(producto.deposito_cantidad) if producto.deposito_cantidad else None,
                "fecha_creacion": producto.fecha_creacion.isoformat() if producto.fecha_creacion else None,
                "fecha_actualizacion": producto.fecha_actualizacion.isoformat() if producto.fecha_actualizacion else None
            })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener productos por categoría: {str(e)}")

@router.get("/productos-con-categoria")
def get_productos_con_categoria(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener productos con información de categoría para el frontend"""
    try:
        productos = productos_crud.get_productos_con_categoria(db, skip=skip, limit=limit)
        
        # Convertir a formato JSON amigable
        result = []
        for row in productos:
            result.append({
                "producto_id": row[0],
                "categoria_id": row[1],
                "codigo_producto": row[2],
                "nombre": row[3],
                "descripcion": row[4],
                "precio_por_dia": float(row[5]) if row[5] else 0.0,
                "stock_total": row[6],
                "stock_disponible": row[7],
                "estado": row[8],
                "imagen_url": row[9],
                "requiere_deposito": bool(row[10]),
                "deposito_cantidad": float(row[11]) if row[11] else 0.0,
                "categoria_nombre": row[12],
                "categoria_descripcion": row[13]
            })
        
        return {
            "productos": result,
            "total": len(result)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener productos con categoría: {str(e)}")

# ========== ENDPOINTS DE AUTENTICACIÓN ==========
@router.post("/register", response_model=UsuarioResponse)
def register_user(user_data: UsuarioCreate, db: Session = Depends(get_db)):
    """Registrar nuevo usuario"""
    try:
        # Verificar si el email ya existe
        if usuarios_crud.email_exists(db, user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )
        
        # Convertir a diccionario para el CRUD
        user_dict = {
            "nombre": user_data.nombre,
            "apellido": user_data.apellido,
            "email": user_data.email,
            "password": user_data.password,
            "telefono": user_data.telefono or "",
            "direccion": user_data.direccion or ""
        }
        
        # Crear usuario
        db_user = usuarios_crud.create_usuario(db, user_dict)
        
        return UsuarioResponse(
            usuario_id=db_user.usuario_id,
            nombre=db_user.nombre,
            apellido=db_user.apellido,
            email=db_user.email,
            telefono=db_user.telefono,
            direccion=db_user.direccion,
            fecha_registro=db_user.fecha_registro,
            fecha_actualizacion=db_user.fecha_actualizacion
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar usuario: {str(e)}"
        )

@router.post("/login", response_model=LoginResponse)
def login_user(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Iniciar sesión"""
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UsuarioResponse(
            usuario_id=user.usuario_id,
            nombre=user.nombre,
            apellido=user.apellido,
            email=user.email,
            telefono=user.telefono,
            direccion=user.direccion,
            fecha_registro=user.fecha_registro,
            fecha_actualizacion=user.fecha_actualizacion
        )
    )

@router.get("/me", response_model=UsuarioResponse)
def get_current_user_info(current_user: Usuario = Depends(get_current_user)):
    """Obtener información del usuario actual"""
    return UsuarioResponse(
        usuario_id=current_user.usuario_id,
        nombre=current_user.nombre,
        apellido=current_user.apellido,
        email=current_user.email,
        telefono=current_user.telefono,
        direccion=current_user.direccion,
        fecha_registro=current_user.fecha_registro,
        fecha_actualizacion=current_user.fecha_actualizacion
    )