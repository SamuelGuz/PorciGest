# app/routers/reproductoras.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas, security
from ..database import get_db

router = APIRouter(
    prefix="/reproductoras",
    tags=["Cerdas Reproductoras"]
)

@router.post("/", response_model=schemas.Cerda, status_code=201)
def create_cerda_reproductora(
    cerda: schemas.CerdaCreate, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Crea una nueva cerda reproductora y la asocia al usuario autenticado.
    """
    db_cerda = crud.get_cerda_by_codigo(db, codigo_id=cerda.codigo_id)
    if db_cerda:
        raise HTTPException(status_code=400, detail="Ya existe una cerda con este código ID")
    
    # Pasamos el ID del usuario actual a la función del CRUD
    return crud.create_cerda(db=db, cerda=cerda, user_id=current_user.id)

@router.get("/", response_model=List[schemas.Cerda])
def read_cerdas_reproductoras(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Obtiene una lista de todas las cerdas reproductoras.
    """
    cerdas = crud.get_cerdas(db, skip=skip, limit=limit)
    return cerdas

@router.get("/{cerda_id}", response_model=schemas.Cerda)
def read_cerda(
    cerda_id: int, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Obtiene la información de una cerda reproductora específica por su ID.
    """
    db_cerda = crud.get_cerda(db, cerda_id=cerda_id)
    if db_cerda is None:
        raise HTTPException(status_code=404, detail="Cerda no encontrada")
    return db_cerda

@router.put("/{cerda_id}", response_model=schemas.Cerda)
def update_cerda_reproductora(
    cerda_id: int, 
    cerda: schemas.CerdaUpdate, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Actualiza la información de una cerda específica.
    (Nota: La auditoría aquí registraría quién actualizó, lo cual es una mejora futura).
    """
    db_cerda = crud.update_cerda(db, cerda_id=cerda_id, cerda_update=cerda)
    if db_cerda is None:
        raise HTTPException(status_code=404, detail="Cerda no encontrada para actualizar")
    return db_cerda

@router.delete("/{cerda_id}", response_model=schemas.Cerda)
def delete_cerda_reproductora(
    cerda_id: int, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Elimina una cerda específica de la base de datos.
    """
    db_cerda = crud.delete_cerda(db, cerda_id=cerda_id)
    if db_cerda is None:
        raise HTTPException(status_code=404, detail="Cerda no encontrada para eliminar")
    return db_cerda