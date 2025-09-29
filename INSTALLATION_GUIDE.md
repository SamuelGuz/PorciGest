# 🚀 INSTALACIÓN COMPLETA - PORCIGEST SYSTEM

## 📋 REQUISITOS DEL SISTEMA

### **Backend (Python)**
- Python 3.9+
- pip (gestor de paquetes)
- Base de datos: SQLite (desarrollo) / PostgreSQL (producción)

### **Frontend (Node.js)**
- Node.js 18+
- npm 9+ (incluido con Node.js)

## ⚡ INSTALACIÓN RÁPIDA

### **1. Clonar el repositorio**
```bash
git clone https://github.com/SamuelGuz/PorciGest.git
cd PorciGest
```

### **2. Configurar Backend (Python/FastAPI)**
```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos
alembic upgrade head

# Inicializar datos de prueba (opcional)
python init_database.py

# Ejecutar servidor de desarrollo
python -m uvicorn app.main:app --reload --port 8000
```

### **3. Configurar Frontend (Next.js/React)**
```bash
# Navegar a carpeta del frontend
cd porcigest_frontend-main

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

## 🌐 ACCESO AL SISTEMA

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs

## 📦 DEPENDENCIAS INSTALADAS

### **Backend Python (requirements.txt)**
```
fastapi==0.104.1              # Framework web principal
uvicorn[standard]==0.24.0     # Servidor ASGI
sqlalchemy==2.0.23           # ORM base de datos
alembic==1.13.0              # Migraciones BD
passlib[bcrypt]==1.7.4       # Seguridad contraseñas
python-jose[cryptography]==3.3.0  # JWT tokens
pydantic-settings==2.1.0     # Configuración
... (ver requirements.txt completo)
```

### **Frontend Node.js (package.json)**
```json
{
  "next": "15.5.2",           // Framework React
  "@mui/material": "^7.3.2",  // Interfaz Material-UI
  "axios": "^1.12.2",         // Cliente HTTP
  "jspdf": "^3.0.3",          // Exportación PDF
  "typescript": "^5",         // Tipado estático
  ... (ver package.json completo)
}
```

## ⚙️ CONFIGURACIÓN

### **Variables de entorno Backend (.env)**
```env
SECRET_KEY=tu_clave_secreta_aqui
DATABASE_URL=sqlite:///./porcigest_dev.db
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### **Variables de entorno Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🗄️ BASE DE DATOS

### **Migraciones automáticas**
```bash
# Crear nueva migración
alembic revision --autogenerate -m "descripcion_cambio"

# Aplicar migraciones
alembic upgrade head

# Ver historial
alembic history
```

### **Datos de prueba**
```bash
# Ejecutar script de datos iniciales
python init_database.py

# Crear usuario administrador
python crear_usuario.py
```

## 🛠️ COMANDOS DE DESARROLLO

### **Backend**
```bash
# Servidor desarrollo con recarga automática
uvicorn app.main:app --reload --port 8000

# Tests (si están configurados)
pytest

# Formateo de código
black app/
isort app/
```

### **Frontend**
```bash
# Desarrollo con hot reload
npm run dev

# Build de producción
npm run build

# Servidor de producción
npm run start

# Verificar tipos TypeScript
npm run type-check
```

## 📊 ESTRUCTURA DEL PROYECTO

```
PorciGest/
├── 📁 app/                     # Backend FastAPI
│   ├── 📁 routers/            # Endpoints API
│   ├── 📄 models.py           # Modelos SQLAlchemy
│   ├── 📄 schemas.py          # Schemas Pydantic
│   ├── 📄 crud.py             # Operaciones BD
│   ├── 📄 security.py         # Autenticación
│   └── 📄 main.py             # App principal
├── 📁 alembic/                # Migraciones BD
├── 📁 porcigest_frontend-main/ # Frontend Next.js
│   ├── 📁 app/                # Páginas y componentes
│   ├── 📁 src/                # Hooks y servicios
│   └── 📄 package.json        # Dependencias NPM
├── 📄 requirements.txt        # Dependencias Python
├── 📄 alembic.ini            # Config migraciones
└── 📄 README.md              # Este archivo
```

## 🔧 SOLUCIÓN DE PROBLEMAS

### **Error: Puerto 8000 ocupado**
```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :8000
# Terminar proceso por PID
taskkill /PID <numero_pid> /F
```

### **Error: Dependencias Python**
```bash
# Actualizar pip
python -m pip install --upgrade pip
# Reinstalar dependencias
pip install -r requirements.txt --force-reinstall
```

### **Error: Dependencias Node.js**
```bash
# Limpiar cache npm
npm cache clean --force
# Reinstalar node_modules
rm -rf node_modules package-lock.json
npm install
```

## 🚀 PRODUCCIÓN

### **Backend**
- Usar gunicorn en lugar de uvicorn
- Configurar PostgreSQL
- Variables de entorno seguras
- HTTPS con certificados SSL

### **Frontend**
- `npm run build` para optimización
- Servir con nginx o similar
- CDN para assets estáticos
- Configurar variables de entorno de producción

## 📞 SOPORTE

- **Documentación API**: http://localhost:8000/docs
- **Logs Backend**: Verificar terminal de uvicorn
- **Logs Frontend**: Verificar consola del navegador
- **Base de datos**: SQLite browser para inspección local

---
**PorciGest System v1.0.0** - Sistema completo de gestión porcina
Desarrollado con ❤️ usando Python, FastAPI, React y Material-UI