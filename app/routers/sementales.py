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
    
    # Crear el semental
    new_semental = crud.create_semental(db=db, semental=semental, user_id=current_user.id)
    
    # Registrar movimiento automáticamente
    try:
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Registró nuevo semental",
            modulo="Sementales",
            descripcion=f"Agregó semental {new_semental.nombre}, raza {new_semental.raza}",
            tipo_movimiento="crear",
            entidad_tipo="semental",
            entidad_id=new_semental.id
        )
    except Exception as e:
        # No fallar la operación principal si falla el logging
        print(f"Error registrando movimiento: {e}")
    
    return new_semental

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
    # Obtener información antes de actualizar
    original_semental = crud.get_semental(db, semental_id=semental_id)
    if not original_semental:
        raise HTTPException(status_code=404, detail="Semental no encontrado para actualizar")
    
    db_semental = crud.update_semental(db, semental_id=semental_id, semental_update=semental)
    if db_semental is None:
        raise HTTPException(status_code=404, detail="Semental no encontrado para actualizar")
    
    # Registrar movimiento automáticamente
    try:
        cambios = []
        if semental.nombre and semental.nombre != original_semental.nombre:
            cambios.append(f"nombre: {original_semental.nombre} → {semental.nombre}")
        if semental.raza and semental.raza != original_semental.raza:
            cambios.append(f"raza: {original_semental.raza} → {semental.raza}")
        if semental.tasa_fertilidad is not None and semental.tasa_fertilidad != original_semental.tasa_fertilidad:
            cambios.append(f"fertilidad: {original_semental.tasa_fertilidad} → {semental.tasa_fertilidad}")
        
        descripcion = f"Actualizó semental {db_semental.nombre}"
        if cambios:
            descripcion += f": {', '.join(cambios)}"
        
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Actualizó información de semental",
            modulo="Sementales",
            descripcion=descripcion,
            tipo_movimiento="editar",
            entidad_tipo="semental",
            entidad_id=db_semental.id
        )
    except Exception as e:
        print(f"Error registrando movimiento: {e}")
    
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
    
    # Registrar movimiento automáticamente
    try:
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Eliminó semental",
            modulo="Sementales",
            descripcion=f"Eliminó semental {db_semental.nombre}, raza {db_semental.raza}",
            tipo_movimiento="eliminar",
            entidad_tipo="semental",
            entidad_id=db_semental.id
        )
    except Exception as e:
        print(f"Error registrando movimiento: {e}")
    
    return db_semental