from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
from app.core.database import get_db
from app.core.auth import authenticate_user, authenticate_admin, create_access_token, get_current_user, get_current_admin
from app.core.config import settings
from app.schemas.schemas import (
    Categoria, Producto, ProductoConCategoria, 
    UsuarioCreate, UsuarioResponse, LoginRequest, LoginResponse, MessageResponse,
    AdministradorCreate, AdministradorResponse, AdminLoginResponse
)
from app.models.models import Usuario, Administrador
from app.crud.crud import categorias_crud, productos_crud, usuarios_crud, administradores_crud

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

# ========== ENDPOINTS DE ADMINISTRADORES ==========
@router.post("/admin/login", response_model=AdminLoginResponse)
def admin_login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Iniciar sesión como administrador"""
    print(f"Intento de login admin con email: {login_data.email}")
    
    # Verificar si el administrador existe en la base de datos
    admin_exists = db.query(Administrador).filter(Administrador.email == login_data.email).first()
    print(f"Administrador encontrado en BD: {admin_exists is not None}")
    if admin_exists:
        print(f"Admin ID: {admin_exists.admin_id}, Nombre: {admin_exists.nombre}, Password hash: {admin_exists.password[:10]}...")
    
    admin = authenticate_admin(db, login_data.email, login_data.password)
    print(f"Autenticación exitosa: {admin is not None}")
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.email, "type": "admin"}, expires_delta=access_token_expires
    )
    
    return AdminLoginResponse(
        access_token=access_token,
        token_type="bearer",
        admin=AdministradorResponse(
            admin_id=admin.admin_id,
            nombre=admin.nombre,
            apellido=admin.apellido,
            email=admin.email,
            fecha_creacion=admin.fecha_creacion,
            fecha_actualizacion=admin.fecha_actualizacion
        )
    )

@router.get("/admin/me", response_model=AdministradorResponse)
def get_current_admin_info(current_admin: Administrador = Depends(get_current_admin)):
    """Obtener información del administrador actual"""
    return AdministradorResponse(
        admin_id=current_admin.admin_id,
        nombre=current_admin.nombre,
        apellido=current_admin.apellido,
        email=current_admin.email,
        fecha_creacion=current_admin.fecha_creacion,
        fecha_actualizacion=current_admin.fecha_actualizacion
    )

@router.get("/admin/dashboard")
def get_admin_dashboard(current_admin: Administrador = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Obtener datos para el dashboard de administrador"""
    try:
        stats = administradores_crud.get_admin_stats(db)
        
        return {
            "stats_generales": {
                "total_productos": stats['stats_generales'][0] if stats['stats_generales'] else 0,
                "total_categorias": stats['stats_generales'][1] if stats['stats_generales'] else 0,
                "total_usuarios": stats['stats_generales'][2] if stats['stats_generales'] else 0,
                "total_pedidos": stats['stats_generales'][3] if stats['stats_generales'] else 0
            },
            "productos_populares": [
                {
                    "producto_id": row[0],
                    "nombre": row[1],
                    "categoria_id": row[2],
                    "categoria_nombre": row[3],
                    "veces_pedido": row[4]
                } for row in stats['productos_populares']
            ],
            "categorias_populares": [
                {
                    "categoria_id": row[0],
                    "nombre": row[1],
                    "total_productos": row[2],
                    "total_pedidos": row[3]
                } for row in stats['categorias_populares']
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener datos del dashboard: {str(e)}")

# ========== ENDPOINTS DE GESTIÓN DE USUARIOS (ADMIN) ==========
@router.get("/admin/usuarios")
def get_all_usuarios(
    skip: int = 0, 
    limit: int = 100, 
    current_admin: Administrador = Depends(get_current_admin), 
    db: Session = Depends(get_db)
):
    """Obtener todos los usuarios (solo administradores)"""
    try:
        usuarios = usuarios_crud.get_all(db, skip=skip, limit=limit)
        return [
            {
                "usuario_id": user.usuario_id,
                "nombre": user.nombre,
                "apellido": user.apellido,
                "email": user.email,
                "telefono": user.telefono,
                "direccion": user.direccion,
                "fecha_registro": user.fecha_registro.isoformat() if user.fecha_registro else None,
                "fecha_actualizacion": user.fecha_actualizacion.isoformat() if user.fecha_actualizacion else None
            } for user in usuarios
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener usuarios: {str(e)}")

@router.put("/admin/usuarios/{usuario_id}")
def update_usuario(
    usuario_id: int,
    usuario_data: dict,
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Actualizar usuario (solo administradores)"""
    try:
        updated_user = usuarios_crud.update_usuario(db, usuario_id, usuario_data)
        if not updated_user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        return {
            "usuario_id": updated_user.usuario_id,
            "nombre": updated_user.nombre,
            "apellido": updated_user.apellido,
            "email": updated_user.email,
            "telefono": updated_user.telefono,
            "direccion": updated_user.direccion
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar usuario: {str(e)}")

@router.delete("/admin/usuarios/{usuario_id}")
def delete_usuario(
    usuario_id: int,
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Eliminar usuario (solo administradores)"""
    try:
        success = usuarios_crud.delete_usuario(db, usuario_id)
        if not success:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        return {"message": "Usuario eliminado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar usuario: {str(e)}")

# ========== ENDPOINTS DE GESTIÓN DE PRODUCTOS (ADMIN) ==========
@router.get("/admin/productos")
def get_all_productos_admin(
    skip: int = 0, 
    limit: int = 100, 
    current_admin: Administrador = Depends(get_current_admin), 
    db: Session = Depends(get_db)
):
    """Obtener todos los productos (solo administradores)"""
    try:
        productos = productos_crud.get_all_admin(db, skip=skip, limit=limit)
        return [
            {
                "producto_id": p.producto_id,
                "categoria_id": p.categoria_id,
                "codigo_producto": p.codigo_producto,
                "nombre": p.nombre,
                "descripcion": p.descripcion,
                "precio_por_dia": float(p.precio_por_dia),
                "stock_total": p.stock_total,
                "stock_disponible": p.stock_disponible,
                "estado": p.estado,
                "imagen_url": p.imagen_url
            } for p in productos
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener productos: {str(e)}")

@router.post("/admin/productos")
def create_producto(
    producto_data: dict,
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Crear nuevo producto (solo administradores)"""
    try:
        nuevo_producto = productos_crud.create_producto(db, producto_data)
        return {
            "producto_id": nuevo_producto.producto_id,
            "categoria_id": nuevo_producto.categoria_id,
            "codigo_producto": nuevo_producto.codigo_producto,
            "nombre": nuevo_producto.nombre,
            "descripcion": nuevo_producto.descripcion,
            "precio_por_dia": float(nuevo_producto.precio_por_dia),
            "stock_total": nuevo_producto.stock_total,
            "stock_disponible": nuevo_producto.stock_disponible,
            "estado": nuevo_producto.estado
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear producto: {str(e)}")

@router.put("/admin/productos/{producto_id}")
def update_producto(
    producto_id: int,
    producto_data: dict,
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Actualizar producto (solo administradores)"""
    try:
        updated_producto = productos_crud.update_producto(db, producto_id, producto_data)
        if not updated_producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        return {
            "producto_id": updated_producto.producto_id,
            "categoria_id": updated_producto.categoria_id,
            "codigo_producto": updated_producto.codigo_producto,
            "nombre": updated_producto.nombre,
            "descripcion": updated_producto.descripcion,
            "precio_por_dia": float(updated_producto.precio_por_dia),
            "stock_total": updated_producto.stock_total,
            "stock_disponible": updated_producto.stock_disponible,
            "estado": updated_producto.estado
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar producto: {str(e)}")

@router.delete("/admin/productos/{producto_id}")
def delete_producto(
    producto_id: int,
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Eliminar producto (solo administradores)"""
    try:
        success = productos_crud.delete_producto(db, producto_id)
        if not success:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        return {"message": "Producto eliminado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar producto: {str(e)}")

# ========== ENDPOINTS DE GESTIÓN DE CATEGORÍAS (ADMIN) ==========
@router.get("/admin/categorias")
def get_all_categorias_admin(
    skip: int = 0, 
    limit: int = 100, 
    current_admin: Administrador = Depends(get_current_admin), 
    db: Session = Depends(get_db)
):
    """Obtener todas las categorías (solo administradores)"""
    try:
        categorias = categorias_crud.get_all_admin(db, skip=skip, limit=limit)
        return [
            {
                "categoria_id": c.categoria_id,
                "nombre": c.nombre,
                "descripcion": c.descripcion,
                "imagen_url": c.imagen_url,
                "activo": c.activo,
                "fecha_creacion": c.fecha_creacion.isoformat() if c.fecha_creacion else None
            } for c in categorias
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener categorías: {str(e)}")

@router.post("/admin/categorias")
def create_categoria(
    categoria_data: dict,
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Crear nueva categoría (solo administradores)"""
    try:
        nueva_categoria = categorias_crud.create_categoria(db, categoria_data)
        return {
            "categoria_id": nueva_categoria.categoria_id,
            "nombre": nueva_categoria.nombre,
            "descripcion": nueva_categoria.descripcion,
            "imagen_url": nueva_categoria.imagen_url,
            "activo": nueva_categoria.activo
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear categoría: {str(e)}")

@router.put("/admin/categorias/{categoria_id}")
def update_categoria(
    categoria_id: int,
    categoria_data: dict,
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Actualizar categoría (solo administradores)"""
    try:
        updated_categoria = categorias_crud.update_categoria(db, categoria_id, categoria_data)
        if not updated_categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        
        return {
            "categoria_id": updated_categoria.categoria_id,
            "nombre": updated_categoria.nombre,
            "descripcion": updated_categoria.descripcion,
            "imagen_url": updated_categoria.imagen_url,
            "activo": updated_categoria.activo
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar categoría: {str(e)}")

@router.delete("/admin/categorias/{categoria_id}")
def delete_categoria(
    categoria_id: int,
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Eliminar categoría (solo administradores)"""
    try:
        success = categorias_crud.delete_categoria(db, categoria_id)
        if not success:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        
        return {"message": "Categoría eliminada exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar categoría: {str(e)}")