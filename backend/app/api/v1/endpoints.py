from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
import base64
from app.core.database import get_db
from app.core.auth import authenticate_user, authenticate_admin, create_access_token, get_current_user, get_current_admin
from app.core.config import settings
from app.schemas.schemas import (
    Categoria, Producto, ProductoConCategoria, Paquete,
    UsuarioCreate, UsuarioResponse, LoginRequest, LoginResponse, MessageResponse,
    AdministradorCreate, AdministradorResponse, AdminLoginResponse
)
from app.models.models import Usuario, Administrador, Producto, Paquete
from app.crud.crud import categorias_crud, productos_crud, usuarios_crud, administradores_crud, paquetes_crud

router = APIRouter()

# Helper function para convertir imagen binaria a base64
def convert_image_to_base64(imagen_dato):
    """Convierte datos binarios de imagen a string base64 para el frontend"""
    if imagen_dato and len(imagen_dato) > 0:
        try:
            # Convertir bytes a base64
            base64_string = base64.b64encode(imagen_dato).decode('utf-8')
            
            # Detectar tipo de imagen basado en los primeros bytes (magic numbers)
            if imagen_dato.startswith(b'\xff\xd8\xff'):
                mime_type = "image/jpeg"
            elif imagen_dato.startswith(b'\x89\x50\x4e\x47'):
                mime_type = "image/png"
            elif imagen_dato.startswith(b'\x47\x49\x46'):
                mime_type = "image/gif"
            elif imagen_dato.startswith(b'\x42\x4d'):
                mime_type = "image/bmp"
            else:
                # Default a JPEG si no se puede detectar
                mime_type = "image/jpeg"
            
            # Retornar como data URL
            return f"data:{mime_type};base64,{base64_string}"
        except Exception as e:
            print(f"Error converting image to base64: {e}")
            print(f"Image data type: {type(imagen_dato)}, length: {len(imagen_dato) if imagen_dato else 0}")
            return None
    return None

# Helper function para manejar booleanos desde FormData
def parse_form_boolean(value):
    """Convierte string de FormData a boolean"""
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() in ('true', '1', 'yes', 'on')
    return bool(value)

# ========== ENDPOINTS DE DEBUGGING ==========
@router.get("/admin/debug/images")
def debug_images(current_admin: Administrador = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Debug endpoint para verificar imágenes"""
    try:
        # Verificar productos
        productos = productos_crud.get_all_admin(db, limit=5)
        productos_info = []
        
        for p in productos:
            info = {
                "id": p.producto_id,
                "nombre": p.nombre,
                "has_imagen_dato": bool(p.imagen_dato),
                "imagen_size": len(p.imagen_dato) if p.imagen_dato else 0,
                "imagen_url_generated": bool(convert_image_to_base64(p.imagen_dato))
            }
            
            if p.imagen_dato:
                # Verificar los primeros bytes
                info["image_type"] = "unknown"
                if p.imagen_dato.startswith(b'\xff\xd8\xff'):
                    info["image_type"] = "jpeg"
                elif p.imagen_dato.startswith(b'\x89\x50\x4e\x47'):
                    info["image_type"] = "png"
                elif p.imagen_dato.startswith(b'\x47\x49\x46'):
                    info["image_type"] = "gif"
                
                # Agregar preview del base64 (primeros 50 caracteres)
                try:
                    base64_preview = convert_image_to_base64(p.imagen_dato)
                    info["base64_preview"] = base64_preview[:80] if base64_preview else None
                except Exception as e:
                    info["base64_error"] = str(e)
            
            productos_info.append(info)
        
        # Verificar paquetes
        paquetes = paquetes_crud.get_all_admin(db, limit=5)
        paquetes_info = []
        
        for p in paquetes:
            info = {
                "id": p.paquete_id,
                "nombre": p.nombre,
                "has_imagen_dato": bool(p.imagen_dato),
                "imagen_size": len(p.imagen_dato) if p.imagen_dato else 0,
                "imagen_url_generated": bool(convert_image_to_base64(p.imagen_dato))
            }
            
            if p.imagen_dato:
                # Verificar los primeros bytes
                info["image_type"] = "unknown"
                if p.imagen_dato.startswith(b'\xff\xd8\xff'):
                    info["image_type"] = "jpeg"
                elif p.imagen_dato.startswith(b'\x89\x50\x4e\x47'):
                    info["image_type"] = "png"
                elif p.imagen_dato.startswith(b'\x47\x49\x46'):
                    info["image_type"] = "gif"
                
                # Agregar preview del base64 (primeros 50 caracteres)
                try:
                    base64_preview = convert_image_to_base64(p.imagen_dato)
                    info["base64_preview"] = base64_preview[:80] if base64_preview else None
                except Exception as e:
                    info["base64_error"] = str(e)
            
            paquetes_info.append(info)
        
        return {
            "productos": productos_info,
            "paquetes": paquetes_info,
            "total_productos": len(productos),
            "total_paquetes": len(paquetes)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en debug: {str(e)}")

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
                "imagen_url": convert_image_to_base64(producto.imagen_dato),
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
        "imagen_url": convert_image_to_base64(producto.imagen_dato),
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
                "imagen_url": convert_image_to_base64(producto.imagen_dato),
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
                "imagen_url": convert_image_to_base64(row[9]),
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
                "total_paquetes": stats['stats_generales'][2] if stats['stats_generales'] else 0,
                "total_usuarios": stats['stats_generales'][3] if stats['stats_generales'] else 0,
                "total_pedidos": stats['stats_generales'][4] if stats['stats_generales'] else 0
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
                "especificaciones": p.especificaciones,
                "dimensiones": p.dimensiones,
                "peso": float(p.peso) if p.peso else None,
                "imagen_url": convert_image_to_base64(p.imagen_dato),
                "requiere_deposito": bool(p.requiere_deposito),
                "deposito_cantidad": float(p.deposito_cantidad) if p.deposito_cantidad else None,
                "fecha_creacion": p.fecha_creacion.isoformat() if p.fecha_creacion else None,
                "fecha_actualizacion": p.fecha_actualizacion.isoformat() if p.fecha_actualizacion else None
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
        # Validaciones de datos requeridos
        required_fields = ['categoria_id', 'codigo_producto', 'nombre', 'precio_por_dia', 'stock_total', 'stock_disponible']
        for field in required_fields:
            if field not in producto_data or producto_data[field] is None or str(producto_data[field]).strip() == '':
                raise HTTPException(status_code=400, detail=f"El campo {field} es requerido")
        
        # Validaciones de valores
        if float(producto_data['precio_por_dia']) <= 0:
            raise HTTPException(status_code=400, detail="El precio por día debe ser mayor a 0")
        
        if int(producto_data['stock_total']) < 0:
            raise HTTPException(status_code=400, detail="El stock total no puede ser negativo")
        
        if int(producto_data['stock_disponible']) < 0:
            raise HTTPException(status_code=400, detail="El stock disponible no puede ser negativo")
        
        if int(producto_data['stock_disponible']) > int(producto_data['stock_total']):
            raise HTTPException(status_code=400, detail="El stock disponible no puede ser mayor al stock total")
        
        # Verificar que la categoría existe
        categoria_exists = categorias_crud.get_by_id(db, producto_data['categoria_id'])
        if not categoria_exists:
            raise HTTPException(status_code=400, detail="La categoría especificada no existe")
        
        # Verificar que el código del producto no exista ya
        existing_product = db.query(Producto).filter(Producto.codigo_producto == producto_data['codigo_producto']).first()
        if existing_product:
            raise HTTPException(status_code=400, detail="Ya existe un producto con este código")
        
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
            "estado": nuevo_producto.estado,
            "especificaciones": nuevo_producto.especificaciones,
            "dimensiones": nuevo_producto.dimensiones,
            "peso": float(nuevo_producto.peso) if nuevo_producto.peso else None,
            "imagen_url": convert_image_to_base64(nuevo_producto.imagen_dato),
            "requiere_deposito": bool(nuevo_producto.requiere_deposito),
            "deposito_cantidad": float(nuevo_producto.deposito_cantidad) if nuevo_producto.deposito_cantidad else None
        }
    except HTTPException:
        raise
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
        # Validar que el producto existe
        existing_product = productos_crud.get_by_id(db, producto_id)
        if not existing_product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        # Validaciones de datos
        if 'precio_por_dia' in producto_data and float(producto_data['precio_por_dia']) <= 0:
            raise HTTPException(status_code=400, detail="El precio por día debe ser mayor a 0")
        
        if 'stock_total' in producto_data and int(producto_data['stock_total']) < 0:
            raise HTTPException(status_code=400, detail="El stock total no puede ser negativo")
        
        if 'stock_disponible' in producto_data and int(producto_data['stock_disponible']) < 0:
            raise HTTPException(status_code=400, detail="El stock disponible no puede ser negativo")
        
        # Validar que stock disponible no sea mayor que stock total
        stock_total = producto_data.get('stock_total', existing_product.stock_total)
        stock_disponible = producto_data.get('stock_disponible', existing_product.stock_disponible)
        if int(stock_disponible) > int(stock_total):
            raise HTTPException(status_code=400, detail="El stock disponible no puede ser mayor al stock total")
        
        updated_producto = productos_crud.update_producto(db, producto_id, producto_data)
        
        return {
            "producto_id": updated_producto.producto_id,
            "categoria_id": updated_producto.categoria_id,
            "codigo_producto": updated_producto.codigo_producto,
            "nombre": updated_producto.nombre,
            "descripcion": updated_producto.descripcion,
            "precio_por_dia": float(updated_producto.precio_por_dia),
            "stock_total": updated_producto.stock_total,
            "stock_disponible": updated_producto.stock_disponible,
            "estado": updated_producto.estado,
            "especificaciones": updated_producto.especificaciones,
            "dimensiones": updated_producto.dimensiones,
            "peso": float(updated_producto.peso) if updated_producto.peso else None,
            "imagen_url": convert_image_to_base64(updated_producto.imagen_dato),
            "requiere_deposito": bool(updated_producto.requiere_deposito),
            "deposito_cantidad": float(updated_producto.deposito_cantidad) if updated_producto.deposito_cantidad else None
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
    """Eliminar producto permanentemente (solo administradores)"""
    try:
        # Verificar que el producto existe
        existing_product = productos_crud.get_by_id(db, producto_id)
        if not existing_product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        producto_nombre = existing_product.nombre
        
        # Eliminar permanentemente
        success = productos_crud.delete_producto_permanently(db, producto_id)
        if not success:
            raise HTTPException(status_code=500, detail="No se pudo eliminar el producto")
        
        return {
            "message": f"Producto '{producto_nombre}' eliminado permanentemente",
            "producto_id": producto_id
        }
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

# ========== ENDPOINTS DE PAQUETES ==========
@router.get("/paquetes/activos")
def get_paquetes_activos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener paquetes activos para el frontend público"""
    try:
        paquetes = paquetes_crud.get_all(db, skip=skip, limit=limit)
        
        result = []
        for paquete in paquetes:
            # Calcular precio con descuento
            precio_original = float(paquete.precio_por_dia)
            descuento = float(paquete.descuento_porcentaje) if paquete.descuento_porcentaje else 0.0
            precio_final = precio_original * (1 - descuento / 100)
            
            result.append({
                "paquete_id": paquete.paquete_id,
                "codigo_paquete": paquete.codigo_paquete,
                "nombre": paquete.nombre,
                "descripcion": paquete.descripcion,
                "precio_por_dia": precio_original,
                "precio_final": precio_final,
                "descuento_porcentaje": descuento,
                "imagen_url": convert_image_to_base64(paquete.imagen_dato),
                "capacidad_personas": paquete.capacidad_personas
            })
        
        return {
            "paquetes": result,
            "total": len(result)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener paquetes activos: {str(e)}")

@router.get("/paquetes")
def get_paquetes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todos los paquetes activos"""
    try:
        paquetes = paquetes_crud.get_all(db, skip=skip, limit=limit)
        
        # Convertir a dict para evitar problemas de validación
        result = []
        for paquete in paquetes:
            result.append({
                "paquete_id": paquete.paquete_id,
                "codigo_paquete": paquete.codigo_paquete,
                "nombre": paquete.nombre,
                "descripcion": paquete.descripcion,
                "precio_por_dia": float(paquete.precio_por_dia),
                "descuento_porcentaje": float(paquete.descuento_porcentaje) if paquete.descuento_porcentaje else 0.0,
                "imagen_url": convert_image_to_base64(paquete.imagen_dato),
                "capacidad_personas": paquete.capacidad_personas,
                "activo": bool(paquete.activo) if paquete.activo is not None else True,
                "fecha_creacion": paquete.fecha_creacion.isoformat() if paquete.fecha_creacion else None,
                "fecha_actualizacion": paquete.fecha_actualizacion.isoformat() if paquete.fecha_actualizacion else None
            })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener paquetes: {str(e)}")

@router.get("/paquetes/{paquete_id}")
def get_paquete(paquete_id: int, db: Session = Depends(get_db)):
    """Obtener paquete por ID"""
    paquete = paquetes_crud.get_by_id(db, paquete_id=paquete_id)
    if paquete is None:
        raise HTTPException(status_code=404, detail="Paquete no encontrado")
    
    return {
        "paquete_id": paquete.paquete_id,
        "codigo_paquete": paquete.codigo_paquete,
        "nombre": paquete.nombre,
        "descripcion": paquete.descripcion,
        "precio_por_dia": float(paquete.precio_por_dia),
        "descuento_porcentaje": float(paquete.descuento_porcentaje) if paquete.descuento_porcentaje else 0.0,
        "imagen_url": convert_image_to_base64(paquete.imagen_dato),
        "capacidad_personas": paquete.capacidad_personas,
        "activo": bool(paquete.activo),
        "fecha_creacion": paquete.fecha_creacion.isoformat() if paquete.fecha_creacion else None,
        "fecha_actualizacion": paquete.fecha_actualizacion.isoformat() if paquete.fecha_actualizacion else None
    }

# ========== ENDPOINTS DE GESTIÓN DE PAQUETES (ADMIN) ==========
@router.get("/admin/paquetes")
def get_all_paquetes_admin(
    skip: int = 0, 
    limit: int = 100, 
    current_admin: Administrador = Depends(get_current_admin), 
    db: Session = Depends(get_db)
):
    """Obtener todos los paquetes (solo administradores)"""
    try:
        paquetes = paquetes_crud.get_all_admin(db, skip=skip, limit=limit)
        return [
            {
                "paquete_id": p.paquete_id,
                "codigo_paquete": p.codigo_paquete,
                "nombre": p.nombre,
                "descripcion": p.descripcion,
                "precio_por_dia": float(p.precio_por_dia),
                "descuento_porcentaje": float(p.descuento_porcentaje) if p.descuento_porcentaje else 0.0,
                "imagen_url": convert_image_to_base64(p.imagen_dato),
                "capacidad_personas": p.capacidad_personas,
                "activo": bool(p.activo),
                "fecha_creacion": p.fecha_creacion.isoformat() if p.fecha_creacion else None,
                "fecha_actualizacion": p.fecha_actualizacion.isoformat() if p.fecha_actualizacion else None
            } for p in paquetes
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener paquetes: {str(e)}")

@router.post("/admin/paquetes")
def create_paquete(
    paquete_data: dict,
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Crear nuevo paquete (solo administradores)"""
    try:
        # Validaciones de datos requeridos
        required_fields = ['codigo_paquete', 'nombre', 'precio_por_dia']
        for field in required_fields:
            if field not in paquete_data or paquete_data[field] is None or str(paquete_data[field]).strip() == '':
                raise HTTPException(status_code=400, detail=f"El campo {field} es requerido")
        
        # Validaciones de valores
        if float(paquete_data['precio_por_dia']) <= 0:
            raise HTTPException(status_code=400, detail="El precio por día debe ser mayor a 0")
        
        if 'descuento_porcentaje' in paquete_data and paquete_data['descuento_porcentaje']:
            descuento = float(paquete_data['descuento_porcentaje'])
            if descuento < 0 or descuento > 100:
                raise HTTPException(status_code=400, detail="El descuento debe estar entre 0 y 100%")
        
        if 'capacidad_personas' in paquete_data and paquete_data['capacidad_personas']:
            if int(paquete_data['capacidad_personas']) <= 0:
                raise HTTPException(status_code=400, detail="La capacidad de personas debe ser mayor a 0")
        
        # Verificar que el código del paquete no exista ya
        existing_package = db.query(Paquete).filter(Paquete.codigo_paquete == paquete_data['codigo_paquete']).first()
        if existing_package:
            raise HTTPException(status_code=400, detail="Ya existe un paquete con este código")
        
        nuevo_paquete = paquetes_crud.create_paquete(db, paquete_data)
        return {
            "paquete_id": nuevo_paquete.paquete_id,
            "codigo_paquete": nuevo_paquete.codigo_paquete,
            "nombre": nuevo_paquete.nombre,
            "descripcion": nuevo_paquete.descripcion,
            "precio_por_dia": float(nuevo_paquete.precio_por_dia),
            "descuento_porcentaje": float(nuevo_paquete.descuento_porcentaje) if nuevo_paquete.descuento_porcentaje else 0.0,
            "imagen_url": convert_image_to_base64(nuevo_paquete.imagen_dato),
            "capacidad_personas": nuevo_paquete.capacidad_personas,
            "activo": bool(nuevo_paquete.activo)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear paquete: {str(e)}")

@router.put("/admin/paquetes/{paquete_id}")
def update_paquete(
    paquete_id: int,
    paquete_data: dict,
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Actualizar paquete (solo administradores)"""
    try:
        # Validar que el paquete existe
        existing_package = paquetes_crud.get_by_id(db, paquete_id)
        if not existing_package:
            raise HTTPException(status_code=404, detail="Paquete no encontrado")
        
        # Validaciones de datos
        if 'precio_por_dia' in paquete_data and float(paquete_data['precio_por_dia']) <= 0:
            raise HTTPException(status_code=400, detail="El precio por día debe ser mayor a 0")
        
        if 'descuento_porcentaje' in paquete_data and paquete_data['descuento_porcentaje']:
            descuento = float(paquete_data['descuento_porcentaje'])
            if descuento < 0 or descuento > 100:
                raise HTTPException(status_code=400, detail="El descuento debe estar entre 0 y 100%")
        
        if 'capacidad_personas' in paquete_data and paquete_data['capacidad_personas']:
            if int(paquete_data['capacidad_personas']) <= 0:
                raise HTTPException(status_code=400, detail="La capacidad de personas debe ser mayor a 0")
        
        updated_paquete = paquetes_crud.update_paquete(db, paquete_id, paquete_data)
        
        return {
            "paquete_id": updated_paquete.paquete_id,
            "codigo_paquete": updated_paquete.codigo_paquete,
            "nombre": updated_paquete.nombre,
            "descripcion": updated_paquete.descripcion,
            "precio_por_dia": float(updated_paquete.precio_por_dia),
            "descuento_porcentaje": float(updated_paquete.descuento_porcentaje) if updated_paquete.descuento_porcentaje else 0.0,
            "imagen_url": convert_image_to_base64(updated_paquete.imagen_dato),
            "capacidad_personas": updated_paquete.capacidad_personas,
            "activo": bool(updated_paquete.activo)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar paquete: {str(e)}")

@router.delete("/admin/paquetes/{paquete_id}")
def delete_paquete(
    paquete_id: int,
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Eliminar paquete permanentemente (solo administradores)"""
    try:
        # Verificar que el paquete existe
        existing_package = paquetes_crud.get_by_id(db, paquete_id)
        if not existing_package:
            raise HTTPException(status_code=404, detail="Paquete no encontrado")
        
        paquete_nombre = existing_package.nombre
        
        # Eliminar permanentemente
        success = paquetes_crud.delete_paquete_permanently(db, paquete_id)
        if not success:
            raise HTTPException(status_code=500, detail="No se pudo eliminar el paquete")
        
        return {
            "message": f"Paquete '{paquete_nombre}' eliminado permanentemente",
            "paquete_id": paquete_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar paquete: {str(e)}")

# ========== ENDPOINTS PARA FORMULARIOS CON ARCHIVOS ==========

@router.post("/admin/productos/form")
async def create_producto_form(
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db),
    categoria_id: int = Form(...),
    codigo_producto: str = Form(...),
    nombre: str = Form(...),
    descripcion: str = Form(""),
    precio_por_dia: float = Form(...),
    stock_total: int = Form(...),
    stock_disponible: int = Form(...),
    estado: str = Form("disponible"),
    especificaciones: str = Form(""),
    dimensiones: str = Form(""),
    peso: float = Form(0.0),
    requiere_deposito: bool = Form(False),
    deposito_cantidad: float = Form(0.0),
    imagen: UploadFile = File(None)
):
    """Crear nuevo producto con formulario de archivo (solo administradores)"""
    try:
        # Validaciones básicas
        if not categoria_id or not codigo_producto or not nombre or not precio_por_dia:
            raise HTTPException(status_code=400, detail="Los campos categoria_id, codigo_producto, nombre y precio_por_dia son requeridos")
        
        if precio_por_dia <= 0:
            raise HTTPException(status_code=400, detail="El precio por día debe ser mayor a 0")
        
        if stock_total < 0:
            raise HTTPException(status_code=400, detail="El stock total no puede ser negativo")
        
        if stock_disponible < 0:
            raise HTTPException(status_code=400, detail="El stock disponible no puede ser negativo")
        
        if stock_disponible > stock_total:
            raise HTTPException(status_code=400, detail="El stock disponible no puede ser mayor al stock total")
        
        # Verificar que la categoría existe
        categoria_exists = categorias_crud.get_by_id(db, categoria_id)
        if not categoria_exists:
            raise HTTPException(status_code=400, detail="La categoría especificada no existe")
        
        # Verificar que el código del producto no exista
        existing_product = db.query(Producto).filter(Producto.codigo_producto == codigo_producto).first()
        if existing_product:
            raise HTTPException(status_code=400, detail="Ya existe un producto con este código")
        
        # Procesar imagen
        imagen_dato = None
        if imagen and imagen.filename:
            # Validar tipo de archivo
            allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
            if imagen.content_type not in allowed_types:
                raise HTTPException(status_code=400, detail="Tipo de archivo no permitido. Solo se permiten: JPG, PNG, GIF")
            
            # Validar tamaño (máximo 5MB)
            imagen_content = await imagen.read()
            if len(imagen_content) > 5 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="La imagen es demasiado grande. Máximo 5MB")
            
            imagen_dato = imagen_content
        
        # Crear producto
        producto_dict = {
            "categoria_id": categoria_id,
            "codigo_producto": codigo_producto,
            "nombre": nombre,
            "descripcion": descripcion or "",
            "precio_por_dia": precio_por_dia,
            "stock_total": stock_total,
            "stock_disponible": stock_disponible,
            "estado": estado,
            "especificaciones": especificaciones or "",
            "dimensiones": dimensiones or "",
            "peso": peso,
            "imagen_dato": imagen_dato,
            "requiere_deposito": parse_form_boolean(requiere_deposito),
            "deposito_cantidad": deposito_cantidad
        }
        
        nuevo_producto = productos_crud.create_producto(db, producto_dict)
        
        return {
            "message": "Producto creado exitosamente",
            "producto_id": nuevo_producto.producto_id,
            "categoria_id": nuevo_producto.categoria_id,
            "codigo_producto": nuevo_producto.codigo_producto,
            "nombre": nuevo_producto.nombre,
            "descripcion": nuevo_producto.descripcion,
            "precio_por_dia": float(nuevo_producto.precio_por_dia),
            "stock_total": nuevo_producto.stock_total,
            "stock_disponible": nuevo_producto.stock_disponible,
            "estado": nuevo_producto.estado,
            "especificaciones": nuevo_producto.especificaciones,
            "dimensiones": nuevo_producto.dimensiones,
            "peso": float(nuevo_producto.peso) if nuevo_producto.peso else None,
            "imagen_url": convert_image_to_base64(nuevo_producto.imagen_dato),
            "requiere_deposito": bool(nuevo_producto.requiere_deposito),
            "deposito_cantidad": float(nuevo_producto.deposito_cantidad) if nuevo_producto.deposito_cantidad else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear producto: {str(e)}")

@router.put("/admin/productos/{producto_id}/form")
async def update_producto_form(
    producto_id: int,
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db),
    categoria_id: int = Form(None),
    codigo_producto: str = Form(None),
    nombre: str = Form(None),
    descripcion: str = Form(None),
    precio_por_dia: float = Form(None),
    stock_total: int = Form(None),
    stock_disponible: int = Form(None),
    estado: str = Form(None),
    especificaciones: str = Form(None),
    dimensiones: str = Form(None),
    peso: float = Form(None),
    requiere_deposito: bool = Form(None),
    deposito_cantidad: float = Form(None),
    imagen: UploadFile = File(None)
):
    """Actualizar producto con formulario de archivo (solo administradores)"""
    try:
        # Verificar que el producto existe
        existing_product = productos_crud.get_by_id(db, producto_id)
        if not existing_product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        # Preparar datos de actualización - Solo incluir campos que no son None
        update_data = {}
        
        if categoria_id is not None:
            # Verificar que la categoría existe
            categoria_exists = categorias_crud.get_by_id(db, categoria_id)
            if not categoria_exists:
                raise HTTPException(status_code=400, detail="La categoría especificada no existe")
            update_data["categoria_id"] = categoria_id
        
        if codigo_producto is not None and codigo_producto.strip():
            # Verificar que el código no exista en otro producto
            existing_code = db.query(Producto).filter(
                Producto.codigo_producto == codigo_producto,
                Producto.producto_id != producto_id
            ).first()
            if existing_code:
                raise HTTPException(status_code=400, detail="Ya existe otro producto con este código")
            update_data["codigo_producto"] = codigo_producto
        
        if nombre is not None and nombre.strip():
            update_data["nombre"] = nombre
        if descripcion is not None:
            update_data["descripcion"] = descripcion
        if precio_por_dia is not None:
            if precio_por_dia <= 0:
                raise HTTPException(status_code=400, detail="El precio por día debe ser mayor a 0")
            update_data["precio_por_dia"] = precio_por_dia
        if stock_total is not None:
            if stock_total < 0:
                raise HTTPException(status_code=400, detail="El stock total no puede ser negativo")
            update_data["stock_total"] = stock_total
        if stock_disponible is not None:
            if stock_disponible < 0:
                raise HTTPException(status_code=400, detail="El stock disponible no puede ser negativo")
            update_data["stock_disponible"] = stock_disponible
        if estado is not None and estado.strip():
            update_data["estado"] = estado
        if especificaciones is not None:
            update_data["especificaciones"] = especificaciones
        if dimensiones is not None:
            update_data["dimensiones"] = dimensiones
        if peso is not None:
            update_data["peso"] = peso
        if requiere_deposito is not None:
            update_data["requiere_deposito"] = parse_form_boolean(requiere_deposito)
        if deposito_cantidad is not None:
            update_data["deposito_cantidad"] = deposito_cantidad
        
        # Procesar imagen si se proporciona
        if imagen and imagen.filename:
            # Validar tipo de archivo
            allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
            if imagen.content_type not in allowed_types:
                raise HTTPException(status_code=400, detail="Tipo de archivo no permitido. Solo se permiten: JPG, PNG, GIF")
            
            # Validar tamaño (máximo 5MB)
            imagen_content = await imagen.read()
            if len(imagen_content) > 5 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="La imagen es demasiado grande. Máximo 5MB")
            
            update_data["imagen_dato"] = imagen_content
        
        # Actualizar producto solo si hay datos para actualizar
        if update_data:
            updated_producto = productos_crud.update_producto(db, producto_id, update_data)
            if not updated_producto:
                raise HTTPException(status_code=404, detail="No se pudo actualizar el producto")
        else:
            updated_producto = existing_product
        
        return {
            "message": "Producto actualizado exitosamente",
            "producto_id": updated_producto.producto_id,
            "categoria_id": updated_producto.categoria_id,
            "codigo_producto": updated_producto.codigo_producto,
            "nombre": updated_producto.nombre,
            "descripcion": updated_producto.descripcion,
            "precio_por_dia": float(updated_producto.precio_por_dia),
            "stock_total": updated_producto.stock_total,
            "stock_disponible": updated_producto.stock_disponible,
            "estado": updated_producto.estado,
            "especificaciones": updated_producto.especificaciones,
            "dimensiones": updated_producto.dimensiones,
            "peso": float(updated_producto.peso) if updated_producto.peso else None,
            "imagen_url": convert_image_to_base64(updated_producto.imagen_dato),
            "requiere_deposito": bool(updated_producto.requiere_deposito),
            "deposito_cantidad": float(updated_producto.deposito_cantidad) if updated_producto.deposito_cantidad else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar producto: {str(e)}")

@router.post("/admin/paquetes/form")
async def create_paquete_form(
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db),
    codigo_paquete: str = Form(...),
    nombre: str = Form(...),
    descripcion: str = Form(""),
    precio_por_dia: float = Form(...),
    descuento_porcentaje: float = Form(0.0),
    capacidad_personas: int = Form(1),
    activo: bool = Form(True),
    imagen: UploadFile = File(None)
):
    """Crear nuevo paquete con formulario de archivo (solo administradores)"""
    try:
        # Validaciones básicas
        if not codigo_paquete or not nombre or not precio_por_dia:
            raise HTTPException(status_code=400, detail="Los campos codigo_paquete, nombre y precio_por_dia son requeridos")
        
        if precio_por_dia <= 0:
            raise HTTPException(status_code=400, detail="El precio por día debe ser mayor a 0")
        
        if descuento_porcentaje < 0 or descuento_porcentaje > 100:
            raise HTTPException(status_code=400, detail="El descuento debe estar entre 0 y 100")
        
        if capacidad_personas <= 0:
            raise HTTPException(status_code=400, detail="La capacidad debe ser mayor a 0")
        
        # Verificar que el código del paquete no exista
        existing_package = db.query(Paquete).filter(Paquete.codigo_paquete == codigo_paquete).first()
        if existing_package:
            raise HTTPException(status_code=400, detail="Ya existe un paquete con este código")
        
        # Procesar imagen
        imagen_dato = None
        if imagen and imagen.filename:
            # Validar tipo de archivo
            allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
            if imagen.content_type not in allowed_types:
                raise HTTPException(status_code=400, detail="Tipo de archivo no permitido. Solo se permiten: JPG, PNG, GIF")
            
            # Validar tamaño (máximo 5MB)
            imagen_content = await imagen.read()
            if len(imagen_content) > 5 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="La imagen es demasiado grande. Máximo 5MB")
            
            imagen_dato = imagen_content
        
        # Crear paquete
        paquete_dict = {
            "codigo_paquete": codigo_paquete,
            "nombre": nombre,
            "descripcion": descripcion or "",
            "precio_por_dia": precio_por_dia,
            "descuento_porcentaje": descuento_porcentaje,
            "imagen_dato": imagen_dato,
            "capacidad_personas": capacidad_personas,
            "activo": parse_form_boolean(activo)
        }
        
        nuevo_paquete = paquetes_crud.create_paquete(db, paquete_dict)
        
        return {
            "message": "Paquete creado exitosamente",
            "paquete_id": nuevo_paquete.paquete_id,
            "codigo_paquete": nuevo_paquete.codigo_paquete,
            "nombre": nuevo_paquete.nombre,
            "descripcion": nuevo_paquete.descripcion,
            "precio_por_dia": float(nuevo_paquete.precio_por_dia),
            "descuento_porcentaje": float(nuevo_paquete.descuento_porcentaje) if nuevo_paquete.descuento_porcentaje else 0.0,
            "imagen_url": convert_image_to_base64(nuevo_paquete.imagen_dato),
            "capacidad_personas": nuevo_paquete.capacidad_personas,
            "activo": bool(nuevo_paquete.activo)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear paquete: {str(e)}")

@router.put("/admin/paquetes/{paquete_id}/form")
async def update_paquete_form(
    paquete_id: int,
    current_admin: Administrador = Depends(get_current_admin),
    db: Session = Depends(get_db),
    codigo_paquete: str = Form(None),
    nombre: str = Form(None),
    descripcion: str = Form(None),
    precio_por_dia: float = Form(None),
    descuento_porcentaje: float = Form(None),
    capacidad_personas: int = Form(None),
    activo: bool = Form(None),
    imagen: UploadFile = File(None)
):
    """Actualizar paquete con formulario de archivo (solo administradores)"""
    try:
        # Verificar que el paquete existe
        existing_package = paquetes_crud.get_by_id(db, paquete_id)
        if not existing_package:
            raise HTTPException(status_code=404, detail="Paquete no encontrado")
        
        # Preparar datos de actualización
        update_data = {}
        
        if codigo_paquete is not None and codigo_paquete.strip():
            # Verificar que el código no exista en otro paquete
            existing_code = db.query(Paquete).filter(
                Paquete.codigo_paquete == codigo_paquete.strip(),
                Paquete.paquete_id != paquete_id
            ).first()
            if existing_code:
                raise HTTPException(status_code=400, detail="Ya existe otro paquete con este código")
            update_data["codigo_paquete"] = codigo_paquete.strip()
        
        if nombre is not None and nombre.strip():
            update_data["nombre"] = nombre.strip()
        if descripcion is not None and descripcion.strip():
            update_data["descripcion"] = descripcion.strip()
        if precio_por_dia is not None:
            if precio_por_dia <= 0:
                raise HTTPException(status_code=400, detail="El precio por día debe ser mayor a 0")
            update_data["precio_por_dia"] = precio_por_dia
        if descuento_porcentaje is not None:
            if descuento_porcentaje < 0 or descuento_porcentaje > 100:
                raise HTTPException(status_code=400, detail="El descuento debe estar entre 0 y 100")
            update_data["descuento_porcentaje"] = descuento_porcentaje
        if capacidad_personas is not None:
            if capacidad_personas <= 0:
                raise HTTPException(status_code=400, detail="La capacidad debe ser mayor a 0")
            update_data["capacidad_personas"] = capacidad_personas
        if activo is not None:
            update_data["activo"] = parse_form_boolean(activo)
        
        # Procesar imagen si se proporciona
        if imagen and imagen.filename:
            # Validar tipo de archivo
            allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
            if imagen.content_type not in allowed_types:
                raise HTTPException(status_code=400, detail="Tipo de archivo no permitido. Solo se permiten: JPG, PNG, GIF")
            
            # Validar tamaño (máximo 5MB)
            imagen_content = await imagen.read()
            if len(imagen_content) > 5 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="La imagen es demasiado grande. Máximo 5MB")
            
            update_data["imagen_dato"] = imagen_content
        
        # Si no hay nada que actualizar
        if not update_data:
            raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")
        
        # Actualizar paquete
        updated_paquete = paquetes_crud.update_paquete(db, paquete_id, update_data)
        
        return {
            "message": "Paquete actualizado exitosamente",
            "paquete_id": updated_paquete.paquete_id,
            "codigo_paquete": updated_paquete.codigo_paquete,
            "nombre": updated_paquete.nombre,
            "descripcion": updated_paquete.descripcion,
            "precio_por_dia": float(updated_paquete.precio_por_dia),
            "descuento_porcentaje": float(updated_paquete.descuento_porcentaje) if updated_paquete.descuento_porcentaje else 0.0,
            "imagen_url": convert_image_to_base64(updated_paquete.imagen_dato),
            "capacidad_personas": updated_paquete.capacidad_personas,
            "activo": bool(updated_paquete.activo)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar paquete: {str(e)}")
