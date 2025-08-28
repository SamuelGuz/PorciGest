# app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from urllib.parse import quote_plus

# --- PON TUS DATOS REALES AQUÍ ---
DB_USER = "sam"
DB_PASSWORD = "1234567" # <-- PON TU CONTRASEÑA REAL
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "porcigest"
# ------------------------------------

# Codificamos la contraseña para que sea segura en una URL
encoded_password = quote_plus(DB_PASSWORD)

# Construimos la URL base
base_url = f"postgresql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# --- LA LÍNEA MÁGICA Y DEFINITIVA ---
# Forzamos la conexión a usar UTF-8. Esto resuelve el UnicodeDecodeError.
SQLALCHEMY_DATABASE_URL = f"{base_url}?client_encoding=utf8"
# --------------------------------------

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()