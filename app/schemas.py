# app/schemas.py
from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

# --- ESQUEMAS PARA USUARIOS Y AUTENTICACIÓN ---

class UserBase(BaseModel):
    nombre: str
    apellido: str
    tipo_documento: str
    numero_documento: str

class UserCreate(UserBase):
    password: str

# Schema para la respuesta pública, sin datos sensibles
class UserPublic(UserBase):
    id: int
    class Config: from_attributes = True

class User(UserBase):
    id: int
    is_active: bool
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    nombre: str
    apellido: str
    numero_documento: str
    tipo_documento: str
class TokenData(BaseModel):
    numero_documento: Optional[str] = None


# --- Esquemas para Cerdas Reproductoras ---
class CerdaBase(BaseModel):
    codigo_id: str
    fecha_nacimiento: date
    raza: str
    estado_reproductivo: Optional[str] = "Vacía"
class CerdaCreate(CerdaBase): pass
class CerdaUpdate(BaseModel):
    codigo_id: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    raza: Optional[str] = None
    estado_reproductivo: Optional[str] = None
class Cerda(CerdaBase):
    id: int
    propietario: UserPublic
    class Config: from_attributes = True


# --- ESQUEMAS PARA SEMENTALES ---
class SementalBase(BaseModel):
    nombre: str
    raza: str
    tasa_fertilidad: Optional[float] = 0.0
class SementalCreate(SementalBase): pass
class SementalUpdate(BaseModel):
    nombre: Optional[str] = None
    raza: Optional[str] = None
    tasa_fertilidad: Optional[float] = None
class Semental(SementalBase):
    id: int
    propietario: UserPublic
    class Config: from_attributes = True


# --- ESQUEMAS PARA CAMADAS DE LECHONES ---
class CamadaBase(BaseModel):
    fecha_nacimiento: date
    numero_lechones: int
    peso_promedio_kg: Optional[float] = None
    madre_id: int
    padre_id: int
class CamadaCreate(CamadaBase): pass
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
    propietario: UserPublic
    class Config: from_attributes = True


# --- ESQUEMAS PARA LOTES DE ENGORDE ---
class LoteEngordeBase(BaseModel):
    lote_id_str: str
    fecha_inicio: date
    numero_cerdos: int
    peso_inicial_promedio: Optional[float] = None
    peso_actual_promedio: Optional[float] = None
    camada_origen_id: int

class LoteEngordeCreate(LoteEngordeBase): 
    pass

class LoteEngordeUpdate(BaseModel):
    lote_id_str: Optional[str] = None
    fecha_inicio: Optional[date] = None
    numero_cerdos: Optional[int] = None
    peso_inicial_promedio: Optional[float] = None
    peso_actual_promedio: Optional[float] = None
    camada_origen_id: Optional[int] = None

class LoteEngorde(LoteEngordeBase):
    id: int
    camada_origen: Camada
    propietario: UserPublic
    class Config: from_attributes = True


# --- ESQUEMAS PARA TRATAMIENTOS VETERINARIOS ---
class TratamientoBase(BaseModel):
    tipo_intervencion: str
    medicamento_producto: Optional[str] = None
    dosis: Optional[str] = None
    fecha: date
    veterinario: Optional[str] = None
    observaciones: Optional[str] = None
    reproductora_id: Optional[int] = None
    semental_id: Optional[int] = None
    lote_engorde_id: Optional[int] = None
class TratamientoCreate(TratamientoBase): pass
class TratamientoUpdate(BaseModel):
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
    reproductora: Optional[Cerda] = None
    semental: Optional[Semental] = None
    lote_engorde: Optional[LoteEngorde] = None
    propietario: UserPublic
    class Config: from_attributes = True


# --- ESQUEMAS PARA MOVIMIENTOS ---

class MovimientoBase(BaseModel):
    accion: str
    modulo: str
    descripcion: Optional[str] = None
    entidad_tipo: Optional[str] = None
    entidad_id: Optional[int] = None
    tipo_movimiento: str  # crear, editar, eliminar

class MovimientoCreate(MovimientoBase):
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class Movimiento(MovimientoBase):
    id: int
    usuario_id: int
    usuario_nombre: str
    fecha_movimiento: datetime
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    
    class Config: 
        from_attributes = True

# Schema para filtros de búsqueda
class MovimientoFilters(BaseModel):
    search: Optional[str] = None
    modulo: Optional[str] = None
    tipo_movimiento: Optional[str] = None
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    usuario_id: Optional[int] = None
    page: Optional[int] = 1
    size: Optional[int] = 10