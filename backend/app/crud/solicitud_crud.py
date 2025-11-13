from sqlalchemy.orm import Session, joinedload
from app.models.solicitud_models import Solicitud, SolicitudProducto, SolicitudPaquete
from app.models.models import Producto, Paquete
from app.schemas.solicitud_schemas import SolicitudCreate, SolicitudUpdate
from datetime import datetime
from decimal import Decimal
import random
import string

def generar_numero_solicitud() -> str:
    """Genera un número de solicitud único"""
    timestamp = datetime.now().strftime("%Y%m%d")
    random_str = ''.join(random.choices(string.digits, k=4))
    return f"SOL-{timestamp}-{random_str}"

def crear_solicitud(db: Session, solicitud_data: SolicitudCreate, usuario_id: int):
    """Crea una nueva solicitud con sus productos y paquetes"""
    
    # Generar número de solicitud único
    numero_solicitud = generar_numero_solicitud()
    while db.query(Solicitud).filter(Solicitud.numero_solicitud == numero_solicitud).first():
        numero_solicitud = generar_numero_solicitud()
    
    # Calcular totales
    subtotal = Decimal("0.00")
    deposito_total = Decimal("0.00")
    
    # Calcular subtotal de productos
    for prod in solicitud_data.productos:
        subtotal += Decimal(str(prod.subtotal))
        deposito_total += Decimal(str(prod.deposito_total))
    
    # Calcular subtotal de paquetes
    for paq in solicitud_data.paquetes:
        subtotal += Decimal(str(paq.subtotal))
    
    # Calcular impuestos (19% IVA en Colombia)
    impuestos = subtotal * Decimal("0.19")
    total_cotizacion = subtotal + impuestos
    
    # Crear solicitud
    db_solicitud = Solicitud(
        usuario_id=usuario_id,
        numero_solicitud=numero_solicitud,
        fecha_evento_inicio=solicitud_data.fecha_evento_inicio,
        fecha_evento_fin=solicitud_data.fecha_evento_fin,
        direccion_evento=solicitud_data.direccion_evento,
        tipo_evento=solicitud_data.tipo_evento,
        num_personas_estimado=solicitud_data.num_personas_estimado,
        observaciones_cliente=solicitud_data.observaciones_cliente,
        subtotal=subtotal,
        impuestos=impuestos,
        deposito_total=deposito_total,
        total_cotizacion=total_cotizacion
    )
    
    db.add(db_solicitud)
    db.flush()  # Para obtener el solicitud_id
    
    # Crear productos de la solicitud
    for prod_data in solicitud_data.productos:
        db_solicitud_producto = SolicitudProducto(
            solicitud_id=db_solicitud.solicitud_id,
            producto_id=prod_data.producto_id,
            cantidad_solicitada=prod_data.cantidad_solicitada,
            precio_unitario=prod_data.precio_unitario,
            dias_renta=prod_data.dias_renta,
            subtotal=prod_data.subtotal,
            deposito_unitario=prod_data.deposito_unitario,
            deposito_total=prod_data.deposito_total
        )
        db.add(db_solicitud_producto)
    
    # Crear paquetes de la solicitud
    for paq_data in solicitud_data.paquetes:
        db_solicitud_paquete = SolicitudPaquete(
            solicitud_id=db_solicitud.solicitud_id,
            paquete_id=paq_data.paquete_id,
            cantidad_solicitada=paq_data.cantidad_solicitada,
            precio_unitario=paq_data.precio_unitario,
            dias_renta=paq_data.dias_renta,
            subtotal=paq_data.subtotal
        )
        db.add(db_solicitud_paquete)
    
    db.commit()
    db.refresh(db_solicitud)
    
    return db_solicitud

def obtener_solicitudes_usuario(db: Session, usuario_id: int, skip: int = 0, limit: int = 100):
    """Obtiene todas las solicitudes de un usuario"""
    return db.query(Solicitud).filter(
        Solicitud.usuario_id == usuario_id
    ).options(
        joinedload(Solicitud.solicitud_productos).joinedload(SolicitudProducto.producto),
        joinedload(Solicitud.solicitud_paquetes).joinedload(SolicitudPaquete.paquete)
    ).order_by(Solicitud.fecha_solicitud.desc()).offset(skip).limit(limit).all()

def obtener_solicitud_por_id(db: Session, solicitud_id: int, usuario_id: int = None):
    """Obtiene una solicitud por ID"""
    query = db.query(Solicitud).filter(Solicitud.solicitud_id == solicitud_id)
    
    if usuario_id:
        query = query.filter(Solicitud.usuario_id == usuario_id)
    
    return query.options(
        joinedload(Solicitud.solicitud_productos).joinedload(SolicitudProducto.producto),
        joinedload(Solicitud.solicitud_paquetes).joinedload(SolicitudPaquete.paquete)
    ).first()

def actualizar_solicitud(db: Session, solicitud_id: int, solicitud_data: SolicitudUpdate, usuario_id: int = None):
    """Actualiza una solicitud existente"""
    query = db.query(Solicitud).filter(Solicitud.solicitud_id == solicitud_id)
    
    if usuario_id:
        query = query.filter(Solicitud.usuario_id == usuario_id)
    
    db_solicitud = query.first()
    
    if not db_solicitud:
        return None
    
    # Solo permitir actualización si está en estado pendiente
    if db_solicitud.estado != "pendiente":
        return None
    
    # Actualizar campos
    update_data = solicitud_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_solicitud, key, value)
    
    db.commit()
    db.refresh(db_solicitud)
    
    return db_solicitud

def cancelar_solicitud(db: Session, solicitud_id: int, usuario_id: int):
    """Cancela una solicitud"""
    db_solicitud = db.query(Solicitud).filter(
        Solicitud.solicitud_id == solicitud_id,
        Solicitud.usuario_id == usuario_id
    ).first()
    
    if not db_solicitud:
        return None
    
    # Solo permitir cancelación si está en estado pendiente o aprobada
    if db_solicitud.estado not in ["pendiente", "aprobada"]:
        return None
    
    db_solicitud.estado = "cancelada"
    db.commit()
    db.refresh(db_solicitud)
    
    return db_solicitud

def obtener_todas_solicitudes(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene todas las solicitudes (para admin)"""
    return db.query(Solicitud).options(
        joinedload(Solicitud.solicitud_productos).joinedload(SolicitudProducto.producto),
        joinedload(Solicitud.solicitud_paquetes).joinedload(SolicitudPaquete.paquete)
    ).order_by(Solicitud.fecha_solicitud.desc()).offset(skip).limit(limit).all()
