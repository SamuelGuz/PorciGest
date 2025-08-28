from pydantic import BaseModel
from datetime import date
from typing import Optional

# --- Esquemas para Cerdas Reproductoras ---

# Esquema base con los campos comunes
class CerdaBase(BaseModel):
    codigo_id: str
    fecha_nacimiento: date
    raza: str
    estado_reproductivo: Optional[str] = "Vacía"

# Esquema para crear una nueva cerda (lo que pedimos en la API)
class CerdaCreate(CerdaBase):
    pass

class CerdaUpdate(BaseModel):
    # Hacemos todos los campos opcionales para que se pueda actualizar solo uno si se desea
    codigo_id: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    raza: Optional[str] = None
    estado_reproductivo: Optional[str] = None
    
# Esquema para leer una cerda (lo que devolvemos en la API)
class Cerda(CerdaBase):
    id: int

    class Config:
        from_attributes = True # <-- CAMBIO AQUÍ

# --- Esquemas para Sementales (sigue el mismo patrón) ---
class SementalBase(BaseModel):
    nombre: str
    raza: str

class SementalCreate(SementalBase):
    pass
    
class Semental(SementalBase):
    id: int
    tasa_fertilidad: float
    
    class Config:
        from_attributes = True # <-- Y CAMBIO AQUÍ

# ... Aquí definirías el resto de tus schemas ...