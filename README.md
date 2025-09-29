# 🐷 PorciGest - Sistema de Gestión Porcina

## 📋 DESCRIPCIÓN

**PorciGest** es un sistema integral de gestión porcina desarrollado con tecnologías modernas. Permite el control completo de granjas porcinas incluyendo reproductoras, sementales, lechones, engorde, tratamientos veterinarios y un sistema completo de auditoría.

### 🎯 **Características principales:**
- ✅ **Gestión completa de reproductoras** - Control de cerdas, ciclos reproductivos
- ✅ **Administración de sementales** - Registro y seguimiento de machos reproductores  
- ✅ **Control de lechones** - Camadas, nacimientos, destetes
- ✅ **Manejo de engorde** - Lotes de engorde y seguimiento de peso
- ✅ **Tratamientos veterinarios** - Registro médico y sanitario
- ✅ **Sistema de auditoría** - Trazabilidad completa de todas las operaciones
- ✅ **Exportación PDF** - Reportes profesionales de movimientos
- ✅ **Autenticación segura** - Sistema JWT con roles de usuario
- ✅ **Interfaz moderna** - Diseño responsive con Material-UI

## 🛠️ TECNOLOGÍAS

### **Backend**
- **FastAPI** 0.104.1 - Framework web moderno y rápido
- **SQLAlchemy** 2.0.23 - ORM para base de datos
- **Alembic** 1.13.0 - Migraciones de base de datos
- **Pydantic** 2.5.0 - Validación de datos
- **JWT** - Autenticación segura con tokens
- **SQLite/PostgreSQL** - Base de datos (desarrollo/producción)

### **Frontend**
- **Next.js** 15.5.2 - Framework React con SSR
- **React** 19.1.0 - Librería de interfaz de usuario
- **Material-UI** 7.3.2 - Componentes de diseño
- **TypeScript** 5.0+ - Tipado estático
- **Axios** 1.12.2 - Cliente HTTP
- **jsPDF** 3.0.3 - Generación de PDFs

## 🚀 INSTALACIÓN RÁPIDA

```bash
# 1. Clonar repositorio
git clone https://github.com/SamuelGuz/PorciGest.git
cd PorciGest

# 2. Backend (Terminal 1)
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
alembic upgrade head
python -m uvicorn app.main:app --reload --port 8000

# 3. Frontend (Terminal 2)
cd porcigest_frontend-main
npm install
npm run dev
```

**Acceso:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentación: http://localhost:8000/docs

## 📊 MÓDULOS DEL SISTEMA

### 🐷 **Reproductoras**
- Registro de cerdas reproductoras
- Control de ciclos reproductivos
- Historial de partos y gestaciones
- Estados: Gestante, Lactante, Vacía, etc.

### 🐗 **Sementales**
- Gestión de machos reproductores
- Control genealógico
- Registro de servicios
- Evaluación de rendimiento

### 🐽 **Lechones**
- Control de camadas
- Registro de nacimientos
- Seguimiento de destetes
- Mortalidad y tratamientos

### 🥩 **Engorde**
- Lotes de engorde
- Control de peso y ganancia
- Seguimiento nutricional
- Preparación para venta

### 💉 **Veterinaria**
- Tratamientos médicos
- Vacunaciones y medicamentos
- Historial sanitario
- Protocolos de prevención

### 📋 **Movimientos (Auditoría)**
- Registro automático de todas las operaciones
- Trazabilidad completa del sistema
- Filtros y búsquedas avanzadas
- Exportación de reportes en PDF

## 🗄️ ESTRUCTURA DE BASE DE DATOS

```sql
-- Principales tablas del sistema
users                    -- Usuarios del sistema
cerdas_reproductoras     -- Reproductoras
sementales              -- Machos reproductores  
camadas_lechones        -- Camadas de lechones
lotes_engorde           -- Lotes de engorde
tratamientos_veterinarios -- Tratamientos médicos
movimientos             -- Auditoría del sistema
```

## 📁 ESTRUCTURA DEL PROYECTO

```
PorciGest/
├── 📁 app/                           # Backend FastAPI
│   ├── 📁 routers/                  # Endpoints API
│   │   ├── auth.py                  # Autenticación
│   │   ├── reproductoras.py         # CRUD reproductoras
│   │   ├── sementales.py            # CRUD sementales
│   │   ├── lechones.py              # CRUD lechones
│   │   ├── engorde.py               # CRUD engorde
│   │   ├── veterinaria.py           # CRUD veterinaria
│   │   └── movimientos.py           # Sistema auditoría
│   ├── 📄 models.py                 # Modelos SQLAlchemy
│   ├── 📄 schemas.py                # Schemas Pydantic
│   ├── 📄 crud.py                   # Operaciones CRUD
│   ├── 📄 security.py               # JWT y autenticación
│   ├── 📄 database.py               # Configuración BD
│   └── 📄 main.py                   # Aplicación principal
├── 📁 alembic/                      # Migraciones BD
├── 📁 porcigest_frontend-main/      # Frontend Next.js
│   ├── 📁 app/                      # Páginas y layouts
│   │   ├── 📁 dashboard/            # Páginas principales
│   │   ├── 📁 login/                # Autenticación
│   │   └── 📁 ui/                   # Componentes UI
│   ├── 📁 src/                      # Hooks y servicios
│   │   ├── 📁 hooks/                # Custom hooks
│   │   ├── 📁 services/             # Configuración API
│   │   └── 📁 types/                # Tipos TypeScript
│   └── 📄 package.json              # Dependencias NPM
├── 📄 requirements.txt              # Dependencias Python
├── 📄 INSTALLATION_GUIDE.md         # Guía de instalación
└── 📄 FRONTEND_DEPENDENCIES.md      # Documentación frontend
```

## 🔐 SEGURIDAD

- **Autenticación JWT** con tokens seguros
- **Hashing bcrypt** para contraseñas
- **Validación de datos** con Pydantic
- **CORS configurado** para desarrollo
- **Manejo de errores** centralizado
- **Logs de auditoría** completos

## 📈 CARACTERÍSTICAS AVANZADAS

### **Sistema de Auditoría**
- Registro automático de todas las operaciones CRUD
- Información de usuario, fecha, IP y acción realizada
- Filtros por módulo, tipo de operación y fechas
- Exportación de reportes en PDF profesional

### **API REST Completa**
- Documentación automática con Swagger
- Endpoints organizados por módulos
- Filtros y paginación en todas las consultas
- Respuestas estandarizadas

### **Frontend Moderno**
- Interfaz responsive con Material-UI
- Custom hooks para manejo de estado
- TypeScript para mejor desarrollo
- Hot reload con Turbopack

## 📋 SCRIPTS UTILITARIOS

```bash
# Inicializar base de datos con datos de prueba
python init_database.py

# Crear usuario administrador
python crear_usuario.py

# Crear movimientos de prueba
python crear_movimientos_prueba.py

# Gestionar usuarios desde CLI
python gestionar_usuarios.py
```

## 🔧 CONFIGURACIÓN

### **Variables de entorno Backend (.env)**
```env
SECRET_KEY=clave_secreta_jwt_aqui
DATABASE_URL=sqlite:///./porcigest_dev.db
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### **Variables de entorno Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📖 DOCUMENTACIÓN ADICIONAL

- **[Guía de Instalación](INSTALLATION_GUIDE.md)** - Instrucciones detalladas
- **[Dependencias Frontend](porcigest_frontend-main/FRONTEND_DEPENDENCIES.md)** - Documentación de librerías
- **[API Docs](http://localhost:8000/docs)** - Documentación interactiva Swagger

## 🤝 CONTRIBUCIÓN

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 LICENCIA

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👥 AUTORES

- **Equipo PorciGest** - Desarrollo inicial
- **Samuel Guzman** - Mantenedor principal

## 🆔 VERSIÓN

**v1.0.0** - Sistema completo funcional
- ✅ CRUD completo para todos los módulos
- ✅ Sistema de auditoría implementado  
- ✅ Exportación PDF funcionando
- ✅ Autenticación JWT operativa
- ✅ Base de datos con migraciones
- ✅ Frontend responsive completado

---

Desarrollado con ❤️ para la gestión moderna de granjas porcinas

**🐷 PorciGest - Tecnología al servicio de la porcicultura 🐷**