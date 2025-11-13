from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, List
from datetime import datetime, date
import secrets
from ..models.pago_models import Pago, TarjetaUsuario, TipoPago, MetodoPago, EstadoPago
from ..schemas.pago_schemas import PagoCreate, TarjetaCreate, TarjetaUpdate


# ============================================
# CRUD PARA PAGOS
# ============================================

def generar_numero_transaccion() -> str:
    """Genera un número de transacción único"""
    fecha = datetime.now().strftime("%Y%m%d")
    random = secrets.token_hex(4).upper()
    return f"TRX-{fecha}-{random}"


def crear_pago(db: Session, pago_data: PagoCreate, usuario_id: int) -> Pago:
    """Crear un nuevo pago"""
    nuevo_pago = Pago(
        solicitud_id=pago_data.solicitud_id,
        usuario_id=usuario_id,
        numero_transaccion=generar_numero_transaccion(),
        tipo_pago=pago_data.tipo_pago,
        metodo_pago=pago_data.metodo_pago,
        monto=pago_data.monto,
        estado_pago=EstadoPago.completado,  # Por defecto completado
        observaciones=pago_data.observaciones
    )
    
    db.add(nuevo_pago)
    db.commit()
    db.refresh(nuevo_pago)
    return nuevo_pago


def obtener_pagos_usuario(db: Session, usuario_id: int, skip: int = 0, limit: int = 100) -> List[Pago]:
    """Obtener todos los pagos de un usuario"""
    return db.query(Pago).filter(Pago.usuario_id == usuario_id).offset(skip).limit(limit).all()


def obtener_pagos_solicitud(db: Session, solicitud_id: int, usuario_id: int) -> List[Pago]:
    """Obtener pagos de una solicitud específica"""
    return db.query(Pago).filter(
        and_(
            Pago.solicitud_id == solicitud_id,
            Pago.usuario_id == usuario_id
        )
    ).all()


def obtener_pago_por_id(db: Session, pago_id: int, usuario_id: int) -> Optional[Pago]:
    """Obtener un pago por ID"""
    return db.query(Pago).filter(
        and_(
            Pago.pago_id == pago_id,
            Pago.usuario_id == usuario_id
        )
    ).first()


# ============================================
# CRUD PARA TARJETAS
# ============================================

def crear_tarjeta(db: Session, tarjeta_data: TarjetaCreate, usuario_id: int) -> TarjetaUsuario:
    """Crear una nueva tarjeta"""
    # Si es predeterminada, quitar predeterminada de las demás
    if tarjeta_data.es_predeterminada:
        db.query(TarjetaUsuario).filter(
            and_(
                TarjetaUsuario.usuario_id == usuario_id,
                TarjetaUsuario.es_predeterminada == True
            )
        ).update({"es_predeterminada": False})
    
    # Extraer últimos 4 dígitos del número completo
    ultimos_digitos = tarjeta_data.numero_completo[-4:]
    
    # TODO: Aquí iría la integración con la pasarela de pagos para tokenizar
    # Por ahora, generamos un token simulado
    token_simulado = f"tok_{secrets.token_hex(16)}"
    
    nueva_tarjeta = TarjetaUsuario(
        usuario_id=usuario_id,
        tipo_tarjeta=tarjeta_data.tipo_tarjeta,
        marca=tarjeta_data.marca,
        ultimos_digitos=ultimos_digitos,
        nombre_titular=tarjeta_data.nombre_titular,
        mes_expiracion=tarjeta_data.mes_expiracion,
        anio_expiracion=tarjeta_data.anio_expiracion,
        es_predeterminada=tarjeta_data.es_predeterminada,
        token_pasarela=token_simulado,
        activa=True
    )
    
    db.add(nueva_tarjeta)
    db.commit()
    db.refresh(nueva_tarjeta)
    return nueva_tarjeta


def obtener_tarjetas_usuario(db: Session, usuario_id: int) -> List[TarjetaUsuario]:
    """Obtener todas las tarjetas activas de un usuario"""
    return db.query(TarjetaUsuario).filter(
        and_(
            TarjetaUsuario.usuario_id == usuario_id,
            TarjetaUsuario.activa == True
        )
    ).order_by(TarjetaUsuario.es_predeterminada.desc(), TarjetaUsuario.fecha_creacion.desc()).all()


def obtener_tarjeta_por_id(db: Session, tarjeta_id: int, usuario_id: int) -> Optional[TarjetaUsuario]:
    """Obtener una tarjeta por ID"""
    return db.query(TarjetaUsuario).filter(
        and_(
            TarjetaUsuario.tarjeta_id == tarjeta_id,
            TarjetaUsuario.usuario_id == usuario_id,
            TarjetaUsuario.activa == True
        )
    ).first()


def actualizar_tarjeta(db: Session, tarjeta_id: int, usuario_id: int, tarjeta_data: TarjetaUpdate) -> Optional[TarjetaUsuario]:
    """Actualizar una tarjeta"""
    tarjeta = obtener_tarjeta_por_id(db, tarjeta_id, usuario_id)
    if not tarjeta:
        return None
    
    # Si se marca como predeterminada, quitar predeterminada de las demás
    if tarjeta_data.es_predeterminada:
        db.query(TarjetaUsuario).filter(
            and_(
                TarjetaUsuario.usuario_id == usuario_id,
                TarjetaUsuario.tarjeta_id != tarjeta_id,
                TarjetaUsuario.es_predeterminada == True
            )
        ).update({"es_predeterminada": False})
    
    # Actualizar campos
    update_data = tarjeta_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tarjeta, field, value)
    
    db.commit()
    db.refresh(tarjeta)
    return tarjeta


def eliminar_tarjeta(db: Session, tarjeta_id: int, usuario_id: int) -> bool:
    """Eliminar (desactivar) una tarjeta"""
    tarjeta = obtener_tarjeta_por_id(db, tarjeta_id, usuario_id)
    if not tarjeta:
        return False
    
    tarjeta.activa = False
    tarjeta.es_predeterminada = False
    db.commit()
    return True


def establecer_tarjeta_predeterminada(db: Session, tarjeta_id: int, usuario_id: int) -> Optional[TarjetaUsuario]:
    """Establecer una tarjeta como predeterminada"""
    # Quitar predeterminada de todas
    db.query(TarjetaUsuario).filter(
        and_(
            TarjetaUsuario.usuario_id == usuario_id,
            TarjetaUsuario.es_predeterminada == True
        )
    ).update({"es_predeterminada": False})
    
    # Establecer la nueva predeterminada
    tarjeta = obtener_tarjeta_por_id(db, tarjeta_id, usuario_id)
    if not tarjeta:
        return None
    
    tarjeta.es_predeterminada = True
    db.commit()
    db.refresh(tarjeta)
    return tarjeta


def verificar_tarjeta_expirada(tarjeta: TarjetaUsuario) -> bool:
    """Verificar si una tarjeta está expirada"""
    hoy = date.today()
    fecha_expiracion = date(tarjeta.anio_expiracion, tarjeta.mes_expiracion, 1)
    return fecha_expiracion < hoy


def verificar_tarjeta_expira_pronto(tarjeta: TarjetaUsuario, meses: int = 3) -> bool:
    """Verificar si una tarjeta expira pronto (dentro de X meses)"""
    from dateutil.relativedelta import relativedelta
    hoy = date.today()
    fecha_limite = hoy + relativedelta(months=meses)
    fecha_expiracion = date(tarjeta.anio_expiracion, tarjeta.mes_expiracion, 1)
    return hoy < fecha_expiracion <= fecha_limite
