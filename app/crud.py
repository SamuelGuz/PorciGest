# app/crud.py

from sqlalchemy.orm import Session
from . import models, schemas

# --- Operaciones CRUD para Cerdas Reproductoras ---

def get_cerda_by_codigo(db: Session, codigo_id: str):
    """
    Busca una cerda por su código único (ej: CRD-2025-001).
    """
    return db.query(models.CerdaReproductora).filter(models.CerdaReproductora.codigo_id == codigo_id).first()

def get_cerda(db: Session, cerda_id: int):
    """
    Busca una cerda por su ID primario (ej: 1, 2, 3).
    """
    return db.query(models.CerdaReproductora).filter(models.CerdaReproductora.id == cerda_id).first()

def get_cerdas(db: Session, skip: int = 0, limit: int = 100):
    """
    Obtiene una lista de todas las cerdas.
    """
    return db.query(models.CerdaReproductora).offset(skip).limit(limit).all()

def create_cerda(db: Session, cerda: schemas.CerdaCreate):
    """
    Crea un nuevo registro de cerda en la base de datos.
    """
    # Convierte el schema de Pydantic a un modelo de SQLAlchemy y lo guarda
    db_cerda = models.CerdaReproductora(**cerda.dict())
    db.add(db_cerda)
    db.commit()
    db.refresh(db_cerda) # Refresca el objeto para obtener el ID asignado por la BD
    return db_cerda

def update_cerda(db: Session, cerda_id: int, cerda_update: schemas.CerdaUpdate):
    """
    Actualiza los datos de una cerda existente.
    """
    db_cerda = db.query(models.CerdaReproductora).filter(models.CerdaReproductora.id == cerda_id).first()
    if not db_cerda:
        return None # Retorna None si la cerda no existe

    # Obtenemos los datos del schema de Pydantic, excluyendo los que no se enviaron
    update_data = cerda_update.dict(exclude_unset=True)

    # Actualizamos el objeto de la base de datos campo por campo
    for key, value in update_data.items():
        setattr(db_cerda, key, value)

    db.add(db_cerda)
    db.commit()
    db.refresh(db_cerda)
    return db_cerda

def delete_cerda(db: Session, cerda_id: int):
    """
    Elimina una cerda de la base de datos.
    """
    db_cerda = db.query(models.CerdaReproductora).filter(models.CerdaReproductora.id == cerda_id).first()
    if not db_cerda:
        return None # Retorna None si la cerda no existe

    db.delete(db_cerda)
    db.commit()
    return db_cerda


# --- Próximos pasos: Aquí irían las funciones CRUD para Sementales ---
# def get_semental(db: Session, semental_id: int): ...
# etc.