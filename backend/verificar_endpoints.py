#!/usr/bin/env python3
"""
Script para verificar que los endpoints de tarjetas estén disponibles
"""

import requests
import sys

BASE_URL = "http://localhost:8001"

def verificar_servidor():
    """Verificar que el servidor esté corriendo"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Servidor backend está corriendo")
            return True
        else:
            print(f"⚠️  Servidor responde pero con código: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al servidor backend")
        print("   Asegúrate de que el backend esté corriendo en http://localhost:8001")
        return False
    except Exception as e:
        print(f"❌ Error al verificar servidor: {e}")
        return False

def verificar_docs():
    """Verificar documentación de API"""
    try:
        response = requests.get(f"{BASE_URL}/docs", timeout=5)
        if response.status_code == 200:
            print("✅ Documentación API disponible en: http://localhost:8001/docs")
            return True
        else:
            print(f"⚠️  Documentación no disponible: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error al verificar docs: {e}")
        return False

def verificar_endpoint_tarjetas():
    """Verificar que el endpoint de tarjetas exista"""
    try:
        # Intentar sin autenticación para ver si el endpoint existe
        response = requests.get(f"{BASE_URL}/api/v1/me/tarjetas", timeout=5)
        
        if response.status_code == 401:
            print("✅ Endpoint /api/v1/me/tarjetas existe (requiere autenticación)")
            return True
        elif response.status_code == 404:
            print("❌ Endpoint /api/v1/me/tarjetas NO ENCONTRADO")
            print("   El backend necesita ser reiniciado")
            return False
        elif response.status_code == 200:
            print("✅ Endpoint /api/v1/me/tarjetas existe y responde")
            return True
        else:
            print(f"⚠️  Endpoint responde con código: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error al verificar endpoint: {e}")
        return False

def main():
    print("🔍 Verificando endpoints del sistema de tarjetas...")
    print("=" * 60)
    
    # 1. Verificar servidor
    if not verificar_servidor():
        print("\n💡 Solución:")
        print("   cd backend")
        print("   python run.py")
        sys.exit(1)
    
    print()
    
    # 2. Verificar docs
    verificar_docs()
    
    print()
    
    # 3. Verificar endpoint de tarjetas
    if not verificar_endpoint_tarjetas():
        print("\n💡 Solución:")
        print("   1. Detén el backend (Ctrl+C)")
        print("   2. Reinicia el backend: python run.py")
        print("   3. Espera a que cargue completamente")
        print("   4. Ejecuta este script nuevamente")
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("✅ Todos los endpoints están disponibles")
    print("\n📝 Próximos pasos:")
    print("   1. Abre http://localhost:5173")
    print("   2. Inicia sesión")
    print("   3. Ve a 'Mis Tarjetas'")
    print("   4. Deberías ver el botón 'Agregar Nueva Tarjeta'")

if __name__ == "__main__":
    main()
