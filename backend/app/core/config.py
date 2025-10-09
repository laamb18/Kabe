from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Configuración de la base de datos
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/kabe_rental_system")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", "3306"))
    DB_USER: str = os.getenv("DB_USER", "root")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "password")
    DB_NAME: str = os.getenv("DB_NAME", "kabe_rental_system")
    
    # Configuración de seguridad
    SECRET_KEY: str = os.getenv("SECRET_KEY", "tu_clave_secreta_muy_segura_aqui")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Configuración del servidor
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # Configuración CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://localhost:5174"
    ]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Si CORS_ORIGINS viene del .env como string, convertirlo a lista
        cors_origins_env = os.getenv("CORS_ORIGINS")
        if cors_origins_env:
            try:
                import json
                self.CORS_ORIGINS = json.loads(cors_origins_env)
            except:
                # Si no es JSON válido, usar las origins por defecto
                self.CORS_ORIGINS = [
                    "http://localhost:3000", 
                    "http://localhost:5173", 
                    "http://localhost:5174"
                ]
    
    # Configuración del proyecto
    PROJECT_NAME: str = "K'ABÉ Rental System API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "API para sistema de renta de mobiliario para eventos"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()