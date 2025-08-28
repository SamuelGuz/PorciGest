from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import reproductoras, sementales # y los demás que crees
from . import models
from .database import engine

app = FastAPI(
    title="PorciGest Pro API",
    description="API para la gestión de granjas porcinas.",
    version="0.1.0",
)

# Configuración de CORS
# Esto permite que tu frontend (que estará en otro dominio) pueda hacer peticiones a esta API.
origins = [
    "http://localhost:3000",  # La dirección donde correrá tu app de React
    "http://localhost:5173",  # Otra dirección común para React/Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir los routers de cada módulo
app.include_router(reproductoras.router)
app.include_router(sementales.router)
# ... app.include_router(lechones.router) ...

@app.get("/")
def read_root():
    return {"Proyecto": "API de PorciGest Pro"}