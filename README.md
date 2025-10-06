# K'abé - Sistema de Renta de Mobiliario para Eventos

Sistema completo de gestión y renta de mobiliario para eventos, bodas y celebraciones.

## Setup Rápido

### Configuración Automática (Recomendado)

```bash
# 1. Clonar el repositorio
git clone [URL_DE_TU_REPO]
cd kabe

# 2. Setup automático del backend
cd backend
python setup_project.py

# 3. Setup del frontend  
cd ../frontend
npm install

# 4. Ejecutar el proyecto
# Terminal 1 - Backend:
cd backend
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

python run.py

# Terminal 2 - Frontend:
cd frontend
npm run dev