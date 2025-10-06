from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.schemas import Categoria, Producto, ProductoConCategoria
from app.crud.crud import categorias_crud, productos_crud

router = APIRouter()

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