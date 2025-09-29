# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import reproductoras, sementales, lechones, engorde, veterinaria, auth, movimientos
from . import models
from .database import engine

# Crear todas las tablas al iniciar
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PorciGest Pro API",
    description="API para la gestión de granjas porcinas.",
    version="1.1.0",
)
origins = [
    "http://localhost:3000", 
    "http://localhost:3001", 
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001", 
    "http://127.0.0.1:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Explícitamente incluir OPTIONS
    allow_headers=["*"],
    expose_headers=["*"],  # Permitir que el frontend vea todos los headers de respuesta
)

app.include_router(auth.router)
app.include_router(reproductoras.router)
app.include_router(sementales.router)
app.include_router(lechones.router)
app.include_router(engorde.router)
app.include_router(veterinaria.router)
app.include_router(movimientos.router)

@app.get("/")
def read_root():
    return {"Proyecto": "API de PorciGest Pro"}

@app.post("/init-db")
def initialize_database():
    """Endpoint para inicializar la base de datos con datos de prueba"""
    from .init_db import init_database
    try:
        init_database()
        return {"message": "Base de datos inicializada correctamente"}
    except Exception as e:
        return {"error": f"Error inicializando base de datos: {str(e)}"}

@app.get("/debug/reproductoras")  
def debug_reproductoras():
    """Endpoint de debug para verificar reproductoras en la base de datos"""
    from .database import SessionLocal
    from . import models
    
    db = SessionLocal()
    try:
        reproductoras = db.query(models.CerdaReproductora).all()
        return {
            "total": len(reproductoras),
            "reproductoras": [
                {
                    "id": r.id,
                    "codigo_id": r.codigo_id,
                    "raza": r.raza,
                    "estado_reproductivo": r.estado_reproductivo,
                    "propietario_id": r.user_id
                }
                for r in reproductoras
            ]
        }
    finally:
        db.close()

@app.get("/debug/sementales")  
def debug_sementales():
    """Endpoint de debug para verificar sementales en la base de datos"""
    from .database import SessionLocal
    from . import models
    
    db = SessionLocal()
    try:
        sementales = db.query(models.Semental).all()
        return {
            "total": len(sementales),
            "sementales": [
                {
                    "id": s.id,
                    "nombre": s.nombre,
                    "raza": s.raza,
                    "tasa_fertilidad": s.tasa_fertilidad,
                    "propietario_id": s.user_id
                }
                for s in sementales
            ]
        }
    finally:
        db.close()