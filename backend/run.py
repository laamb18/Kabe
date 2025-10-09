#!/usr/bin/env python3
"""
K'ABÉ Rental System - Simple Server Startup
==========================================
"""

import sys
import os

# Agregar el directorio actual al PYTHONPATH para importaciones
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

def main():
    """Función principal para iniciar el servidor."""
    try:
        print(" K'ABÉ RENTAL SYSTEM - BACKEND API")
        print("=" * 60)
        
        # Importar módulos necesarios
        print(" Importando módulos...")
        import uvicorn
        from app.core.config import settings
        
        print(f"Base de datos: {settings.DB_NAME}")
        print(f" Servidor: http://{settings.HOST}:{settings.PORT}")
        print(f" Documentación: http://{settings.HOST}:{settings.PORT}/docs")
        
        # Verificar conexión a la base de datos
        print(" Verificando conexión a la base de datos...")
        from app.core.database import engine
        from sqlalchemy import text
        
        with engine.connect() as conn:
            conn.execute(text('SELECT 1'))
        
        print(" Conexión a base de datos: OK")
        print("=" * 60)
        
        # Ejecutar servidor
        uvicorn.run(
            "app.main:app",
            host=settings.HOST,
            port=settings.PORT,
            reload=False,
            log_level="info"
        )
        
    except ImportError as e:
        print(f" Error: Falta instalar dependencias: {e}")
        print(" Ejecuta: py -m pip install fastapi uvicorn[standard] sqlalchemy pymysql pydantic")
        sys.exit(1)
    except Exception as e:
        print(f" Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()