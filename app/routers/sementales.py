# app/routers/sementales.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas, security
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
    db_semental = crud.get_semental_by_nombre(db, nombre=semental.nombre)
    if db_semental:
        raise HTTPException(status_code=400, detail="Ya existe un semental con este nombre")
    return crud.create_semental(db=db, semental=semental)

@router.get("/", response_model=List[schemas.Semental])
def read_sementales(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    sementales = crud.get_sementales(db, skip=skip, limit=limit)
    return sementales

@router.get("/{semental_id}", response_model=schemas.Semental)
def read_semental(
    semental_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
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
    db_semental = crud.delete_semental(db, semental_id=semental_id)
    if db_semental is None:
        raise HTTPException(status_code=404, detail="Semental no encontrado para eliminar")
    return db_semental