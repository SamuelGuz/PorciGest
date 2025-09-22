# app/routers/sementales.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas, security
from ..database import get_db

router = APIRouter(
    prefix="/sementales",
    tags=["Sementales"]
)

@router.post("/", response_model=schemas.Semental, status_code=201)
def create_semental(
    semental: schemas.SementalCreate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Crea un nuevo semental y lo asocia al usuario autenticado.
    """
    db_semental = crud.get_semental_by_nombre(db, nombre=semental.nombre)
    if db_semental:
        raise HTTPException(status_code=400, detail="Ya existe un semental con este nombre")
    
    # Pasamos el ID del usuario actual a la función del CRUD
    return crud.create_semental(db=db, semental=semental, user_id=current_user.id)

@router.get("/", response_model=List[schemas.Semental])
def read_sementales(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Obtiene una lista de todos los sementales.
    """
    sementales = crud.get_sementales(db, skip=skip, limit=limit)
    return sementales

@router.get("/{semental_id}", response_model=schemas.Semental)
def read_semental(
    semental_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Obtiene la información de un semental específico por su ID.
    """
    db_semental = crud.get_semental(db, semental_id=semental_id)
    if db_semental is None:
        raise HTTPException(status_code=404, detail="Semental no encontrado")
    return db_semental

@router.put("/{semental_id}", response_model=schemas.Semental)
def update_semental(
    semental_id: int, 
    semental: schemas.SementalUpdate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Actualiza la información de un semental específico.
    """
    db_semental = crud.update_semental(db, semental_id=semental_id, semental_update=semental)
    if db_semental is None:
        raise HTTPException(status_code=404, detail="Semental no encontrado para actualizar")
    return db_semental

@router.delete("/{semental_id}", response_model=schemas.Semental)
def delete_semental(
    semental_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Elimina un semental de la base de datos.
    """
    db_semental = crud.delete_semental(db, semental_id=semental_id)
    if db_semental is None:
        raise HTTPException(status_code=404, detail="Semental no encontrado para eliminar")
    return db_semental