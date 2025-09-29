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
    
    # Crear la cerda reproductora
    new_cerda = crud.create_cerda(db=db, cerda=cerda, user_id=current_user.id)
    
    # Registrar movimiento automáticamente
    try:
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Registró nueva cerda reproductora",
            modulo="Reproductoras",
            descripcion=f"Agregó cerda {new_cerda.codigo_id}, raza {new_cerda.raza}, estado {new_cerda.estado_reproductivo}",
            tipo_movimiento="crear",
            entidad_tipo="cerda_reproductora",
            entidad_id=new_cerda.id
        )
    except Exception as e:
        # No fallar la operación principal si falla el logging
        print(f"Error registrando movimiento: {e}")
    
    return new_cerda

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
    """
    db_cerda = crud.update_cerda(db, cerda_id=cerda_id, cerda_update=cerda)
    if db_cerda is None:
        raise HTTPException(status_code=404, detail="Cerda no encontrada para actualizar")
    
    # Registrar movimiento automáticamente
    try:
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Actualizó cerda reproductora",
            modulo="Reproductoras",
            descripcion=f"Cerda {db_cerda.codigo_id}: estado {db_cerda.estado_reproductivo}",
            tipo_movimiento="actualizar",
            entidad_tipo="cerda_reproductora",
            entidad_id=db_cerda.id
        )
    except Exception as e:
        print(f"Error registrando movimiento: {e}")
    
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
    # Obtener datos antes de eliminar para el registro
    cerda_info = crud.get_cerda(db, cerda_id=cerda_id)
    if cerda_info is None:
        raise HTTPException(status_code=404, detail="Cerda no encontrada para eliminar")
    
    db_cerda = crud.delete_cerda(db, cerda_id=cerda_id)
    if db_cerda is None:
        raise HTTPException(status_code=404, detail="Cerda no encontrada para eliminar")
    
    # Registrar movimiento automáticamente
    try:
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Eliminó cerda reproductora",
            modulo="Reproductoras",
            descripcion=f"Cerda eliminada: {cerda_info.codigo_id}, raza {cerda_info.raza}",
            tipo_movimiento="eliminar",
            entidad_tipo="cerda_reproductora",
            entidad_id=cerda_id
        )
    except Exception as e:
        print(f"Error registrando movimiento: {e}")
    
    return db_cerda