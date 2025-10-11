"""
Utilidades de autenticación y seguridad
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models.models import Usuario, Administrador

# Configuración para el hash de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuración para JWT
security = HTTPBearer()

def hash_password(password: str) -> str:
    """Hash de la contraseña"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar contraseña"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Crear token de acceso JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """Verificar y decodificar token JWT"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return payload
    except JWTError:
        return None

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Usuario:
    """Obtener usuario actual desde el token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(Usuario).filter(Usuario.email == email).first()
    if user is None:
        raise credentials_exception
    
    return user

def authenticate_user(db: Session, email: str, password: str) -> Optional[Usuario]:
    """Autenticar usuario con email y contraseña"""
    user = db.query(Usuario).filter(Usuario.email == email).first()
    if not user:
        return None
    
    # Intentar verificar contraseña hasheada primero
    if verify_password(password, user.password):
        return user
    
    # Si no funciona, intentar comparación directa (para contraseñas en texto plano)
    if password == user.password:
        # Actualizar la contraseña a formato hasheado para mejorar la seguridad
        user.password = hash_password(password)
        db.commit()
        return user
    
    return None

def authenticate_admin(db: Session, email: str, password: str) -> Optional[Administrador]:
    """Autenticar administrador con email y contraseña"""
    print(f"Autenticando admin: {email}")
    admin = db.query(Administrador).filter(Administrador.email == email).first()
    if not admin:
        print(f"Admin no encontrado en BD para email: {email}")
        return None
    
    print(f"Admin encontrado: {admin.nombre} {admin.apellido}")
    print(f"Password en BD: {admin.password}")
    print(f"Password ingresado: {password}")
    
    # Intentar verificar contraseña hasheada primero
    try:
        if verify_password(password, admin.password):
            print("Autenticación exitosa con password hasheado")
            return admin
    except Exception as e:
        print(f"Error verificando password hasheado: {e}")
    
    # Si no funciona, intentar comparación directa (para contraseñas en texto plano)
    if password == admin.password:
        print("Autenticación exitosa con password en texto plano - actualizando hash")
        # Actualizar la contraseña a formato hasheado para mejorar la seguridad
        admin.password = hash_password(password)
        db.commit()
        return admin
    
    print("Autenticación fallida - contraseña incorrecta")
    return None

async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Administrador:
    """Obtener administrador actual desde el token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        user_type: str = payload.get("type", "user")
        
        if email is None or user_type != "admin":
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    admin = db.query(Administrador).filter(Administrador.email == email).first()
    if admin is None:
        raise credentials_exception
    
    return admin