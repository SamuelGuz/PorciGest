# app/crud.py

from sqlalchemy.orm import Session, joinedload
from . import models, schemas

# --- Operaciones CRUD para Cerdas Reproductoras ---
# (Código existente de Cerdas)
def get_cerda_by_codigo(db: Session, codigo_id: str):
    return db.query(models.CerdaReproductora).filter(models.CerdaReproductora.codigo_id == codigo_id).first()
def get_cerda(db: Session, cerda_id: int):
    return db.query(models.CerdaReproductora).filter(models.CerdaReproductora.id == cerda_id).first()
def get_cerdas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CerdaReproductora).offset(skip).limit(limit).all()
def create_cerda(db: Session, cerda: schemas.CerdaCreate):
    db_cerda = models.CerdaReproductora(**cerda.dict())
    db.add(db_cerda)
    db.commit()
    db.refresh(db_cerda)
    return db_cerda
def update_cerda(db: Session, cerda_id: int, cerda_update: schemas.CerdaUpdate):
    db_cerda = db.query(models.CerdaReproductora).filter(models.CerdaReproductora.id == cerda_id).first()
    if not db_cerda: return None
    update_data = cerda_update.dict(exclude_unset=True)
    for key, value in update_data.items(): setattr(db_cerda, key, value)
    db.add(db_cerda)
    db.commit()
    db.refresh(db_cerda)
    return db_cerda
def delete_cerda(db: Session, cerda_id: int):
    db_cerda = db.query(models.CerdaReproductora).filter(models.CerdaReproductora.id == cerda_id).first()
    if not db_cerda: return None
    db.delete(db_cerda)
    db.commit()
    return db_cerda

# --- OPERACIONES CRUD PARA SEMENTALES ---
# (Código existente de Sementales)
def get_semental(db: Session, semental_id: int):
    return db.query(models.Semental).filter(models.Semental.id == semental_id).first()
def get_semental_by_nombre(db: Session, nombre: str):
    return db.query(models.Semental).filter(models.Semental.nombre == nombre).first()
def get_sementales(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Semental).offset(skip).limit(limit).all()
def create_semental(db: Session, semental: schemas.SementalCreate):
    db_semental = models.Semental(**semental.dict())
    db.add(db_semental)
    db.commit()
    db.refresh(db_semental)
    return db_semental
def update_semental(db: Session, semental_id: int, semental_update: schemas.SementalUpdate):
    db_semental = db.query(models.Semental).filter(models.Semental.id == semental_id).first()
    if not db_semental: return None
    update_data = semental_update.dict(exclude_unset=True)
    for key, value in update_data.items(): setattr(db_semental, key, value)
    db.add(db_semental)
    db.commit()
    db.refresh(db_semental)
    return db_semental
def delete_semental(db: Session, semental_id: int):
    db_semental = db.query(models.Semental).filter(models.Semental.id == semental_id).first()
    if not db_semental: return None
    db.delete(db_semental)
    db.commit()
    return db_semental

# --- OPERACIONES CRUD PARA CAMADAS DE LECHONES ---
# (Código existente de Camadas)
def create_camada(db: Session, camada: schemas.CamadaCreate):
    db_camada = models.CamadaLechones(**camada.dict())
    db.add(db_camada)
    db.commit()
    db.refresh(db_camada)
    return get_camada(db, db_camada.id)
def get_camada(db: Session, camada_id: int):
    return db.query(models.CamadaLechones).options(joinedload(models.CamadaLechones.madre), joinedload(models.CamadaLechones.padre)).filter(models.CamadaLechones.id == camada_id).first()
def get_camadas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CamadaLechones).options(joinedload(models.CamadaLechones.madre), joinedload(models.CamadaLechones.padre)).offset(skip).limit(limit).all()
def update_camada(db: Session, camada_id: int, camada_update: schemas.CamadaUpdate):
    db_camada = db.query(models.CamadaLechones).filter(models.CamadaLechones.id == camada_id).first()
    if not db_camada: return None
    update_data = camada_update.dict(exclude_unset=True)
    for key, value in update_data.items(): setattr(db_camada, key, value)
    db.add(db_camada)
    db.commit()
    db.refresh(db_camada)
    return get_camada(db, db_camada.id)
def delete_camada(db: Session, camada_id: int):
    db_camada = get_camada(db, camada_id)
    if not db_camada: return None
    db.delete(db_camada)
    db.commit()
    return db_camada

# --- OPERACIONES CRUD PARA LOTES DE ENGORDE ---
# (Código existente de Lotes de Engorde)
def create_lote_engorde(db: Session, lote: schemas.LoteEngordeCreate):
    db_lote = models.LoteEngorde(**lote.dict())
    db.add(db_lote)
    db.commit()
    db.refresh(db_lote)
    return get_lote_engorde(db, db_lote.id)
def get_lote_engorde(db: Session, lote_id: int):
    return db.query(models.LoteEngorde).options(joinedload(models.LoteEngorde.camada_origen).joinedload(models.CamadaLechones.madre), joinedload(models.LoteEngorde.camada_origen).joinedload(models.CamadaLechones.padre)).filter(models.LoteEngorde.id == lote_id).first()
def get_lote_engorde_by_str_id(db: Session, lote_id_str: str):
    return db.query(models.LoteEngorde).filter(models.LoteEngorde.lote_id_str == lote_id_str).first()
def get_lotes_engorde(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.LoteEngorde).options(joinedload(models.LoteEngorde.camada_origen).joinedload(models.CamadaLechones.madre), joinedload(models.LoteEngorde.camada_origen).joinedload(models.CamadaLechones.padre)).offset(skip).limit(limit).all()
def update_lote_engorde(db: Session, lote_id: int, lote_update: schemas.LoteEngordeUpdate):
    db_lote = db.query(models.LoteEngorde).filter(models.LoteEngorde.id == lote_id).first()
    if not db_lote: return None
    update_data = lote_update.dict(exclude_unset=True)
    for key, value in update_data.items(): setattr(db_lote, key, value)
    db.add(db_lote)
    db.commit()
    db.refresh(db_lote)
    return get_lote_engorde(db, db_lote.id)
def delete_lote_engorde(db: Session, lote_id: int):
    db_lote = get_lote_engorde(db, lote_id)
    if not db_lote: return None
    db.delete(db_lote)
    db.commit()
    return db_lote


# --- OPERACIONES CRUD PARA TRATAMIENTOS VETERINARIOS ---

def create_tratamiento(db: Session, tratamiento: schemas.TratamientoCreate):
    db_tratamiento = models.TratamientoVeterinario(**tratamiento.dict())
    db.add(db_tratamiento)
    db.commit()
    db.refresh(db_tratamiento)
    return get_tratamiento(db, db_tratamiento.id)

def get_tratamiento(db: Session, tratamiento_id: int):
    # Usamos joinedload para cargar las posibles relaciones por adelantado
    return (
        db.query(models.TratamientoVeterinario)
        .options(
            joinedload(models.TratamientoVeterinario.reproductora),
            joinedload(models.TratamientoVeterinario.semental),
            joinedload(models.TratamientoVeterinario.lote_engorde)
        )
        .filter(models.TratamientoVeterinario.id == tratamiento_id)
        .first()
    )

def get_tratamientos(db: Session, skip: int = 0, limit: int = 100):
    # También aquí para la lista
    return (
        db.query(models.TratamientoVeterinario)
        .options(
            joinedload(models.TratamientoVeterinario.reproductora),
            joinedload(models.TratamientoVeterinario.semental),
            joinedload(models.TratamientoVeterinario.lote_engorde)
        )
        .offset(skip)
        .limit(limit)
        .all()
    )

def update_tratamiento(db: Session, tratamiento_id: int, tratamiento_update: schemas.TratamientoUpdate):
    db_tratamiento = db.query(models.TratamientoVeterinario).filter(models.TratamientoVeterinario.id == tratamiento_id).first()
    if not db_tratamiento:
        return None

    update_data = tratamiento_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_tratamiento, key, value)
    
    db.add(db_tratamiento)
    db.commit()
    db.refresh(db_tratamiento)
    return get_tratamiento(db, db_tratamiento.id)

def delete_tratamiento(db: Session, tratamiento_id: int):
    db_tratamiento = get_tratamiento(db, tratamiento_id)
    if not db_tratamiento:
        return None
    
    db.delete(db_tratamiento)
    db.commit()
    return db_tratamiento