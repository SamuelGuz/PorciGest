# app/routers/veterinaria.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas, security
from ..database import get_db

router = APIRouter(
    prefix="/veterinaria",
    tags=["Veterinaria (Tratamientos)"]
)

@router.post("/", response_model=schemas.Tratamiento, status_code=201)
def create_tratamiento_veterinario(
    tratamiento: schemas.TratamientoCreate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    provided_ids = sum([
        1 for id_val in [tratamiento.reproductora_id, tratamiento.semental_id, tratamiento.lote_engorde_id]
        if id_val is not None
    ])
    if provided_ids != 1:
        raise HTTPException(
            status_code=400,
            detail="Se debe proporcionar exactamente un ID (reproductora, semental o lote de engorde)."
        )
    if tratamiento.reproductora_id and not crud.get_cerda(db, cerda_id=tratamiento.reproductora_id):
        raise HTTPException(status_code=404, detail="Reproductora no encontrada")
    if tratamiento.semental_id and not crud.get_semental(db, semental_id=tratamiento.semental_id):
        raise HTTPException(status_code=404, detail="Semental no encontrado")
    if tratamiento.lote_engorde_id and not crud.get_lote_engorde(db, lote_id=tratamiento.lote_engorde_id):
        raise HTTPException(status_code=404, detail="Lote de engorde no encontrado")

    return crud.create_tratamiento(db=db, tratamiento=tratamiento)


@router.get("/", response_model=List[schemas.Tratamiento])
def read_tratamientos_veterinarios(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    tratamientos = crud.get_tratamientos(db, skip=skip, limit=limit)
    return tratamientos


@router.get("/{tratamiento_id}", response_model=schemas.Tratamiento)
def read_tratamiento_veterinario(
    tratamiento_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    db_tratamiento = crud.get_tratamiento(db, tratamiento_id=tratamiento_id)
    if db_tratamiento is None:
        raise HTTPException(status_code=404, detail="Tratamiento no encontrado")
    return db_tratamiento


@router.put("/{tratamiento_id}", response_model=schemas.Tratamiento)
def update_tratamiento_veterinario(
    tratamiento_id: int, 
    tratamiento: schemas.TratamientoUpdate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    db_tratamiento = crud.update_tratamiento(db, tratamiento_id=tratamiento_id, tratamiento_update=tratamiento)
    if db_tratamiento is None:
        raise HTTPException(status_code=404, detail="Tratamiento no encontrado para actualizar")
    return db_tratamiento


@router.delete("/{tratamiento_id}", response_model=schemas.Tratamiento)
def delete_tratamiento_veterinario(
    tratamiento_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    db_tratamiento = crud.delete_tratamiento(db, tratamiento_id=tratamiento_id)
    if db_tratamiento is None:
        raise HTTPException(status_code=404, detail="Tratamiento no encontrado para eliminar")
    return db_tratamiento