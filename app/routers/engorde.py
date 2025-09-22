# app/routers/engorde.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas, security
from ..database import get_db

router = APIRouter(
    prefix="/engorde",
    tags=["Engorde (Lotes)"]
)

@router.post("/", response_model=schemas.LoteEngorde, status_code=201)
def create_lote_de_engorde(
    lote: schemas.LoteEngordeCreate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Crea un nuevo lote de engorde a partir de una camada y lo asocia al usuario autenticado.
    """
    db_lote_existente = crud.get_lote_engorde_by_str_id(db, lote_id_str=lote.lote_id_str)
    if db_lote_existente:
        raise HTTPException(status_code=400, detail=f"Ya existe un lote con el ID {lote.lote_id_str}")

    db_camada = crud.get_camada(db, camada_id=lote.camada_origen_id)
    if not db_camada:
        raise HTTPException(status_code=404, detail=f"No se encontró la camada de origen con ID {lote.camada_origen_id}")

    # Pasamos el ID del usuario actual a la función del CRUD
    return crud.create_lote_engorde(db=db, lote=lote, user_id=current_user.id)


@router.get("/", response_model=List[schemas.LoteEngorde])
def read_lotes_de_engorde(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Obtiene una lista de todos los lotes de engorde.
    """
    lotes = crud.get_lotes_engorde(db, skip=skip, limit=limit)
    return lotes


@router.get("/{lote_id}", response_model=schemas.LoteEngorde)
def read_lote_de_engorde(
    lote_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Obtiene la información de un lote de engorde específico por su ID numérico.
    """
    db_lote = crud.get_lote_engorde(db, lote_id=lote_id)
    if db_lote is None:
        raise HTTPException(status_code=404, detail="Lote de engorde no encontrado")
    return db_lote


@router.put("/{lote_id}", response_model=schemas.LoteEngorde)
def update_lote_de_engorde(
    lote_id: int, 
    lote: schemas.LoteEngordeUpdate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Actualiza la información de un lote de engorde específico.
    """
    db_lote = crud.update_lote_engorde(db, lote_id=lote_id, lote_update=lote)
    if db_lote is None:
        raise HTTPException(status_code=404, detail="Lote de engorde no encontrado para actualizar")
    return db_lote


@router.delete("/{lote_id}", response_model=schemas.LoteEngorde)
def delete_lote_de_engorde(
    lote_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Elimina el registro de un lote de engorde.
    """
    db_lote = crud.delete_lote_engorde(db, lote_id=lote_id)
    if db_lote is None:
        raise HTTPException(status_code=404, detail="Lote de engorde no encontrado para eliminar")
    return db_lote