# app/schemas.py

from pydantic import BaseModel
from datetime import date
from typing import Optional

# --- Esquemas para Cerdas Reproductoras ---

class CerdaBase(BaseModel):
    codigo_id: str
    fecha_nacimiento: date
    raza: str
    estado_reproductivo: Optional[str] = "Vacía"

class CerdaCreate(CerdaBase):
    pass

class CerdaUpdate(BaseModel):
    codigo_id: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    raza: Optional[str] = None
    estado_reproductivo: Optional[str] = None

class Cerda(CerdaBase):
    id: int

    class Config:
        from_attributes = True


# --- ESQUEMAS PARA SEMENTALES ---

class SementalBase(BaseModel):
    nombre: str
    raza: str
    tasa_fertilidad: Optional[float] = 0.0

class SementalCreate(SementalBase):
    pass

class SementalUpdate(BaseModel):
    nombre: Optional[str] = None
    raza: Optional[str] = None
    tasa_fertilidad: Optional[float] = None

class Semental(SementalBase):
    id: int

    class Config:
        from_attributes = True


# --- ESQUEMAS PARA CAMADAS DE LECHONES ---

class CamadaBase(BaseModel):
    fecha_nacimiento: date
    numero_lechones: int
    peso_promedio_kg: Optional[float] = None
    madre_id: int
    padre_id: int

class CamadaCreate(CamadaBase):
    pass

class CamadaUpdate(BaseModel):
    fecha_nacimiento: Optional[date] = None
    numero_lechones: Optional[int] = None
    peso_promedio_kg: Optional[float] = None
    madre_id: Optional[int] = None
    padre_id: Optional[int] = None

class Camada(CamadaBase):
    id: int
    madre: Cerda
    padre: Semental

    class Config:
        from_attributes = True


# --- ESQUEMAS PARA LOTES DE ENGORDE ---

class LoteEngordeBase(BaseModel):
    lote_id_str: str
    cantidad_animales: int
    edad_dias: Optional[int] = None
    peso_promedio_kg: Optional[float] = None
    camada_origen_id: int

class LoteEngordeCreate(LoteEngordeBase):
    pass

class LoteEngordeUpdate(BaseModel):
    lote_id_str: Optional[str] = None
    cantidad_animales: Optional[int] = None
    edad_dias: Optional[int] = None
    peso_promedio_kg: Optional[float] = None
    camada_origen_id: Optional[int] = None

class LoteEngorde(LoteEngordeBase):
    id: int
    camada_origen: Camada

    class Config:
        from_attributes = True


# --- ESQUEMAS PARA TRATAMIENTOS VETERINARIOS ---

class TratamientoBase(BaseModel):
    tipo_intervencion: str
    medicamento_producto: Optional[str] = None
    dosis: Optional[str] = None
    fecha: date
    veterinario: Optional[str] = None
    observaciones: Optional[str] = None

    # Al crear, solo se debe proporcionar UNO de estos IDs
    reproductora_id: Optional[int] = None
    semental_id: Optional[int] = None
    lote_engorde_id: Optional[int] = None

class TratamientoCreate(TratamientoBase):
    pass

class TratamientoUpdate(BaseModel):
    # Todos los campos son opcionales para la actualización
    tipo_intervencion: Optional[str] = None
    medicamento_producto: Optional[str] = None
    dosis: Optional[str] = None
    fecha: Optional[date] = None
    veterinario: Optional[str] = None
    observaciones: Optional[str] = None
    reproductora_id: Optional[int] = None
    semental_id: Optional[int] = None
    lote_engorde_id: Optional[int] = None

class Tratamiento(TratamientoBase):
    id: int
    # En la respuesta, incluimos el objeto completo al que se aplicó el tratamiento
    reproductora: Optional[Cerda] = None
    semental: Optional[Semental] = None
    lote_engorde: Optional[LoteEngorde] = None

    class Config:
        from_attributes = True