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
    """
    Registra una nueva intervención veterinaria y la asocia al usuario autenticado.
    Se debe proporcionar exactamente UNO de los siguientes:
    - `reproductora_id`
    - `semental_id`
    - `lote_engorde_id`
    """
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

    # Pasamos el ID del usuario actual a la función del CRUD
    new_tratamiento = crud.create_tratamiento(db=db, tratamiento=tratamiento, user_id=current_user.id)
    
    # Registrar movimiento automáticamente
    try:
        # Determinar el tipo de entidad tratada
        entidad_desc = ""
        if tratamiento.reproductora_id:
            entidad_desc = f"reproductora ID {tratamiento.reproductora_id}"
        elif tratamiento.semental_id:
            entidad_desc = f"semental ID {tratamiento.semental_id}"
        elif tratamiento.lote_engorde_id:
            entidad_desc = f"lote de engorde ID {tratamiento.lote_engorde_id}"
        
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Registró tratamiento veterinario",
            modulo="Veterinaria",
            descripcion=f"Tratamiento: {new_tratamiento.tipo_intervencion} en {entidad_desc}",
            tipo_movimiento="crear",
            entidad_tipo="tratamiento_veterinario",
            entidad_id=new_tratamiento.id
        )
    except Exception as e:
        print(f"Error registrando movimiento: {e}")
    
    return new_tratamiento


@router.get("/", response_model=List[schemas.Tratamiento])
def read_tratamientos_veterinarios(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Obtiene una lista de todas las intervenciones veterinarias.
    """
    tratamientos = crud.get_tratamientos(db, skip=skip, limit=limit)
    return tratamientos


@router.get("/{tratamiento_id}", response_model=schemas.Tratamiento)
def read_tratamiento_veterinario(
    tratamiento_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Obtiene la información de una intervención específica por su ID.
    """
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
    """
    Actualiza la información de una intervención veterinaria.
    """
    db_tratamiento = crud.update_tratamiento(db, tratamiento_id=tratamiento_id, tratamiento_update=tratamiento)
    if db_tratamiento is None:
        raise HTTPException(status_code=404, detail="Tratamiento no encontrado para actualizar")
    
    # Registrar movimiento automáticamente
    try:
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Actualizó tratamiento veterinario",
            modulo="Veterinaria",
            descripcion=f"Tratamiento ID {tratamiento_id}: {db_tratamiento.tipo_intervencion}",
            tipo_movimiento="actualizar",
            entidad_tipo="tratamiento_veterinario",
            entidad_id=db_tratamiento.id
        )
    except Exception as e:
        print(f"Error registrando movimiento: {e}")
    
    return db_tratamiento


@router.delete("/{tratamiento_id}", response_model=schemas.Tratamiento)
def delete_tratamiento_veterinario(
    tratamiento_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Elimina el registro de una intervención veterinaria.
    """
    # Obtener datos antes de eliminar para el registro
    tratamiento_info = crud.get_tratamiento(db, tratamiento_id=tratamiento_id)
    if tratamiento_info is None:
        raise HTTPException(status_code=404, detail="Tratamiento no encontrado para eliminar")
    
    db_tratamiento = crud.delete_tratamiento(db, tratamiento_id=tratamiento_id)
    if db_tratamiento is None:
        raise HTTPException(status_code=404, detail="Tratamiento no encontrado para eliminar")
    
    # Registrar movimiento automáticamente
    try:
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Eliminó tratamiento veterinario",
            modulo="Veterinaria",
            descripcion=f"Tratamiento eliminado: {tratamiento_info.tipo_intervencion}",
            tipo_movimiento="eliminar",
            entidad_tipo="tratamiento_veterinario",
            entidad_id=tratamiento_id
        )
    except Exception as e:
        print(f"Error registrando movimiento: {e}")
    
    return db_tratamiento