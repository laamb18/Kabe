"""
Script para ejecutar el servidor de desarrollo
"""
import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    print(f" Iniciando servidor K'ABÉ Rental System...")
    print(f" Base de datos: {settings.DB_NAME}")
    print(f" Servidor: http://{settings.HOST}:{settings.PORT}")
    print(f" Documentación: http://{settings.HOST}:{settings.PORT}/docs")
    print(f" Modo debug: {settings.DEBUG}")
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info" if settings.DEBUG else "warning"
    )