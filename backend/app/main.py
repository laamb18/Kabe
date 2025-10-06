from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import engine, get_db
from app.models import models
import uvicorn

# Crear las tablas en la base de datos (opcional si usas Alembic)
# models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    debug=settings.DEBUG
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Bienvenido a K'ABÉ Rental System API",
        "version": settings.VERSION,
        "status": "active"
    }

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Endpoint para verificar el estado de la API y la conexión a la base de datos"""
    try:
        # Intentar hacer una consulta simple para verificar la conexión
        db.execute("SELECT 1")
        return {
            "status": "healthy",
            "database": "connected",
            "message": "API funcionando correctamente"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

@app.get("/test-db")
def test_database_connection(db: Session = Depends(get_db)):
    """Endpoint para probar la conexión específica con la base de datos K'ABÉ"""
    try:
        # Probar consulta a una tabla específica
        result = db.execute("SELECT COUNT(*) as count FROM categorias").fetchone()
        categorias_count = result[0] if result else 0
        
        result = db.execute("SELECT COUNT(*) as count FROM productos").fetchone()
        productos_count = result[0] if result else 0
        
        result = db.execute("SELECT COUNT(*) as count FROM usuarios").fetchone()
        usuarios_count = result[0] if result else 0
        
        return {
            "status": "success",
            "message": "Conexión exitosa a la base de datos K'ABÉ",
            "data": {
                "categorias": categorias_count,
                "productos": productos_count,
                "usuarios": usuarios_count
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "message": "Error al conectar con la base de datos",
            "error": str(e)
        }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
