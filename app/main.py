# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importamos todos los routers que hemos creado
from .routers import reproductoras, sementales, lechones, engorde, veterinaria
from . import models
from .database import engine

# Nota: Mantenemos esta línea comentada porque Alembic es ahora el único
# responsable de gestionar las tablas de la base de datos.
# models.Base.metadata.create_all(bind=engine)


# Inicializamos la aplicación FastAPI con información descriptiva para la documentación
app = FastAPI(
    title="PorciGest Pro API",
    description="API para la gestión de granjas porcinas.",
    version="1.0.0", # ¡Subimos a la versión 1.0.0!
)

# Configuramos los orígenes permitidos para CORS (Cross-Origin Resource Sharing).
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Incluimos los routers de cada módulo en la aplicación principal.
app.include_router(reproductoras.router)
app.include_router(sementales.router)
app.include_router(lechones.router)
app.include_router(engorde.router)
app.include_router(veterinaria.router) # <-- ¡EL ÚLTIMO MÓDULO!


# Creamos un endpoint raíz simple para verificar que la API está funcionando.
@app.get("/")
def read_root():
    """
    Endpoint raíz que devuelve un mensaje de bienvenida.
    """
    return {"Proyecto": "API de PorciGest Pro"}