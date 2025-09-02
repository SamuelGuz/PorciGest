PorciGest Pro - API Backend
Este repositorio contiene el backend de la API para PorciGest Pro, un Sistema de Gestión Porcina. La API está construida con Python y el framework FastAPI, y utiliza PostgreSQL como base de datos.
Proporciona todos los endpoints necesarios para gestionar el ciclo de vida completo de los animales en una granja, incluyendo reproductoras, sementales, lechones, lotes de engorde y registros veterinarios.
Tecnologías Utilizadas
Python 3.11+
FastAPI: Para la construcción de la API.
PostgreSQL: Como motor de la base de datos.
SQLAlchemy: Como ORM para interactuar con la base de datos.
Alembic: Para gestionar las migraciones de la base de datos.
Uvicorn: Como servidor ASGI para correr la aplicación.
Pydantic: Para la validación de datos.
Prerrequisitos
Antes de empezar, asegúrate de tener instalado lo siguiente:
Python 3.11 o superior.
PostgreSQL.
Git.
Guía de Instalación y Ejecución
Sigue estos pasos para poner en marcha el backend en tu entorno local.
1. Clonar el Repositorio
code
Bash
git clone <URL_DEL_REPOSITORIO>
cd porcigest_pro
2. Crear y Activar un Entorno Virtual
Es una buena práctica aislar las dependencias del proyecto.
code
Bash
# Crear el entorno virtual
python -m venv venv

# Activar el entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate
3. Instalar Dependencias
Instala todas las librerías necesarias listadas en el archivo requirements.txt.
code
Bash
pip install -r requirements.txt
4. Configuración de la Base de Datos
El proyecto necesita un usuario y una base de datos dedicados en PostgreSQL.
a) Configurar la Conexión:
Abre el archivo app/database.py y asegúrate de que los datos de DB_USER, DB_PASSWORD y DB_NAME coincidan con los que vas a crear.
b) Crear el Usuario y la Base de Datos:
Abre una terminal de psql como superusuario (postgres) y ejecuta los siguientes comandos:
code
Bash
# Entrar a la terminal de PostgreSQL
psql -U postgres
Una vez dentro (postgres=#), ejecuta:
code
SQL
-- 1. Crear el nuevo usuario con su contraseña
CREATE USER "user" WITH PASSWORD '1234567';

-- 2. Crear la base de datos
CREATE DATABASE porcigest;

-- 3. Asignar la base de datos al nuevo usuario
ALTER DATABASE porcigest OWNER TO "user";

-- 4. Salir de psql
\q
c) Aplicar las Migraciones:
Alembic se encargará de crear todas las tablas necesarias en la base de datos.
code
Bash
# Este comando crea las tablas y las actualiza a la última versión
alembic upgrade head
Nota: Si es la primera vez que configuras el proyecto, no es necesario ejecutar alembic revision --autogenerate, ya que los archivos de migración ya están en el repositorio.
5. Ejecutar la Aplicación
Con todo configurado, inicia el servidor de desarrollo con Uvicorn.
code
Bash
uvicorn app.main:app --reload
--reload: Esta opción es muy útil en desarrollo, ya que reinicia el servidor automáticamente cada vez que detecta un cambio en el código.
El servidor estará corriendo y disponible en http://127.0.0.1:8000.
Uso de la API y Documentación
FastAPI genera automáticamente una documentación interactiva que es la mejor herramienta para entender y probar la API.
Documentación Interactiva (Swagger UI):
http://127.0.0.1:8000/docs
Documentación Alternativa (ReDoc):
http://127.0.0.1:8000/redoc
Desde la interfaz de Swagger, el equipo de frontend puede ver todos los endpoints, sus parámetros, los esquemas de datos y ejecutar peticiones de prueba directamente desde el navegador.
