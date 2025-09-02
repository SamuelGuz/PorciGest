# app/routers/lechones.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/lechones",
    tags=["Lechones (Camadas)"]
)

@router.post("/", response_model=schemas.Camada, status_code=201)
def create_camada_de_lechones(camada: schemas.CamadaCreate, db: Session = Depends(get_db)):
    """
    Registra una nueva camada de lechones.
    - **madre_id**: ID de la cerda reproductora.
    - **padre_id**: ID del semental.
    """
    # Verificación opcional: Asegurarse de que los padres existen
    db_madre = crud.get_cerda(db, cerda_id=camada.madre_id)
    if not db_madre:
        raise HTTPException(status_code=404, detail=f"No se encontró la cerda madre con ID {camada.madre_id}")
    
    db_padre = crud.get_semental(db, semental_id=camada.padre_id)
    if not db_padre:
        raise HTTPException(status_code=404, detail=f"No se encontró el semental padre con ID {camada.padre_id}")

    return crud.create_camada(db=db, camada=camada)

@router.get("/", response_model=List[schemas.Camada])
def read_camadas_de_lechones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Obtiene una lista de todas las camadas de lechones registradas.
    """
    camadas = crud.get_camadas(db, skip=skip, limit=limit)
    return camadas

@router.get("/{camada_id}", response_model=schemas.Camada)
def read_camada_de_lechones(camada_id: int, db: Session = Depends(get_db)):
    """
    Obtiene la información de una camada específica por su ID.
    """
    db_camada = crud.get_camada(db, camada_id=camada_id)
    if db_camada is None:
        raise HTTPException(status_code=404, detail="Camada no encontrada")
    return db_camada

@router.put("/{camada_id}", response_model=schemas.Camada)
def update_camada_de_lechones(camada_id: int, camada: schemas.CamadaUpdate, db: Session = Depends(get_db)):
    """
    Actualiza la información de una camada específica.
    """
    db_camada = crud.update_camada(db, camada_id=camada_id, camada_update=camada)
    if db_camada is None:
        raise HTTPException(status_code=404, detail="Camada no encontrada para actualizar")
    return db_camada

@router.delete("/{camada_id}", response_model=schemas.Camada)
def delete_camada_de_lechones(camada_id: int, db: Session = Depends(get_db)):
    """
    Elimina el registro de una camada específica.
    """
    db_camada = crud.delete_camada(db, camada_id=camada_id)
    if db_camada is None:
        raise HTTPException(status_code=404, detail="Camada no encontrada para eliminar")
    return db_camada