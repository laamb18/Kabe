"""
K'ABÉ Rental System - Main Application
=====================================

Aplicación principal de FastAPI para el sistema de renta de mobiliario.
Incluye configuración de CORS, middleware, y rutas de la API.

Author: K'ABÉ Development Team
Version: 1.0.0
"""

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import engine, get_db
from app.models import models
from app.api.v1.endpoints import router as api_router
import uvicorn

# Crear las tablas en la base de datos (opcional si usas Alembic)
# models.Base.metadata.create_all(bind=engine)

# Inicializar aplicación FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    debug=settings.DEBUG,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configurar CORS para desarrollo frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Incluir rutas de la API
app.include_router(api_router, prefix="/api/v1", tags=["API v1"])

# Endpoints del sistema
@app.get("/")
def read_root():
    """Endpoint raíz con información básica de la API."""
    return {
        "message": "Bienvenido a K'ABÉ Rental System API",
        "version": settings.VERSION,
        "status": "active",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Endpoint para verificar el estado de la API y la conexión a la base de datos."""
    try:
        # Intentar hacer una consulta simple para verificar la conexión
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "message": "API funcionando correctamente",
            "timestamp": "2025-10-08"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": "2025-10-08"
        }

@app.get("/test-db")
def test_database_connection(db: Session = Depends(get_db)):
    """Endpoint para probar la conexión específica con la base de datos K'ABÉ."""
    try:
        from sqlalchemy import text
        
        # Contar registros en tablas principales
        categorias_count = db.execute(text("SELECT COUNT(*) as count FROM categorias")).fetchone()[0]
        productos_count = db.execute(text("SELECT COUNT(*) as count FROM productos")).fetchone()[0]
        usuarios_count = db.execute(text("SELECT COUNT(*) as count FROM usuarios")).fetchone()[0]
        
        # Verificar estructura de productos
        columns_result = db.execute(text("DESCRIBE productos")).fetchall()
        columns = [{"Field": row[0], "Type": row[1], "Null": row[2], "Key": row[3]} for row in columns_result]
        
        # Obtener una muestra de productos
        productos_sample = db.execute(text("SELECT * FROM productos LIMIT 2")).fetchall()
        
        return {
            "status": "success",
            "message": "Conexión exitosa a la base de datos K'ABÉ",
            "statistics": {
                "categorias": categorias_count,
                "productos": productos_count,
                "usuarios": usuarios_count
            },
            "estructura_productos": columns,
            "muestra_productos": [dict(zip([col["Field"] for col in columns], row)) for row in productos_sample]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": "Error al conectar con la base de datos",
            "error": str(e)
        }

# Ejecutar servidor si este archivo se ejecuta directamente
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
