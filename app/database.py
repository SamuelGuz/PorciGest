# app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from urllib.parse import quote_plus
import os

# --- Configuración temporal con SQLite para desarrollo ---
# Comentando PostgreSQL temporalmente
"""
# --- Datos DB PostgreSQL ---
DB_USER = "sam"
DB_PASSWORD = "1234567"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "porcigest"
# Codificamos la contraseña para que sea segura en una URL
encoded_password = quote_plus(DB_PASSWORD)
base_url = f"postgresql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
"""

# --- Configuración SQLite temporal ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./porcigest_dev.db"

# Para SQLite no necesitamos client_encoding
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # Necesario para SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()