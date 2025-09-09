# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import reproductoras, sementales, lechones, engorde, veterinaria, auth
from . import models
from .database import engine

app = FastAPI(
    title="PorciGest Pro API",
    description="API para la gestión de granjas porcinas.",
    version="1.1.0",
)
origins = ["http://localhost:3000", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(reproductoras.router)
app.include_router(sementales.router)
app.include_router(lechones.router)
app.include_router(engorde.router)
app.include_router(veterinaria.router)

@app.get("/")
def read_root():
    return {"Proyecto": "API de PorciGest Pro"}