# app/routers/engorde.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from .. import crud, schemas, security
from ..database import get_db

def serialize_lote_engorde(lote):
    """Serializar lote de engorde manualmente para evitar errores de Pydantic"""
    if not lote:
        return None
    
    try:
        return {
            "id": lote.id,
            "lote_id_str": lote.lote_id_str,
            "fecha_inicio": lote.fecha_inicio.isoformat() if lote.fecha_inicio else None,
            "numero_cerdos": lote.numero_cerdos,
            "peso_inicial_promedio": lote.peso_inicial_promedio,
            "peso_actual_promedio": lote.peso_actual_promedio,
            "camada_origen_id": lote.camada_origen_id,
            "camada_origen": {
                "id": lote.camada_origen.id,
                "fecha_nacimiento": lote.camada_origen.fecha_nacimiento.isoformat() if lote.camada_origen.fecha_nacimiento else None,
                "numero_lechones": lote.camada_origen.numero_lechones,
                "peso_promedio_kg": lote.camada_origen.peso_promedio_kg,
                "madre_id": lote.camada_origen.madre_id,
                "padre_id": lote.camada_origen.padre_id,
                "madre": {
                    "id": lote.camada_origen.madre.id,
                    "codigo_id": lote.camada_origen.madre.codigo_id,
                    "fecha_nacimiento": lote.camada_origen.madre.fecha_nacimiento.isoformat() if lote.camada_origen.madre.fecha_nacimiento else None,
                    "raza": lote.camada_origen.madre.raza,
                    "estado_reproductivo": lote.camada_origen.madre.estado_reproductivo,
                    "propietario": {
                        "id": lote.camada_origen.madre.propietario.id,
                        "nombre": lote.camada_origen.madre.propietario.nombre,
                        "apellido": lote.camada_origen.madre.propietario.apellido
                    } if lote.camada_origen.madre.propietario else None
                } if lote.camada_origen.madre else None,
                "padre": {
                    "id": lote.camada_origen.padre.id,
                    "nombre": lote.camada_origen.padre.nombre,
                    "raza": lote.camada_origen.padre.raza,
                    "tasa_fertilidad": lote.camada_origen.padre.tasa_fertilidad,
                    "propietario": {
                        "id": lote.camada_origen.padre.propietario.id,
                        "nombre": lote.camada_origen.padre.propietario.nombre,
                        "apellido": lote.camada_origen.padre.propietario.apellido
                    } if lote.camada_origen.padre.propietario else None
                } if lote.camada_origen.padre else None,
                "propietario": {
                    "id": lote.camada_origen.propietario.id,
                    "nombre": lote.camada_origen.propietario.nombre,
                    "apellido": lote.camada_origen.propietario.apellido
                } if lote.camada_origen.propietario else None
            } if lote.camada_origen else None,
            "propietario": {
                "id": lote.propietario.id,
                "nombre": lote.propietario.nombre,
                "apellido": lote.propietario.apellido
            } if lote.propietario else None
        }
    except Exception as e:
        print(f"Error serializando lote {lote.id}: {e}")
        return None

router = APIRouter(
    prefix="/engorde",
    tags=["Engorde (Lotes)"]
)

@router.post("/", status_code=201)
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
    new_lote = crud.create_lote_engorde(db=db, lote=lote, user_id=current_user.id)
    
    # Registrar movimiento automáticamente
    try:
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Creó nuevo lote de engorde",
            modulo="Engorde",
            descripcion=f"Lote {new_lote.lote_id_str} con {new_lote.numero_cerdos} cerdos de camada {db_camada.id}",
            tipo_movimiento="crear",
            entidad_tipo="lote_engorde",
            entidad_id=new_lote.id
        )
    except Exception as e:
        print(f"Error registrando movimiento: {e}")
    
    return serialize_lote_engorde(new_lote)


@router.get("/")
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
    # Filtrar lotes que tengan camada de origen válida
    lotes_validos = []
    for lote in lotes:
        try:
            if lote.camada_origen and lote.propietario:
                # Verificar que la camada tenga madre y padre
                if lote.camada_origen.madre and lote.camada_origen.padre:
                    serialized = serialize_lote_engorde(lote)
                    if serialized and serialized.get('camada_origen'):
                        lotes_validos.append(serialized)
        except Exception as e:
            print(f"Error serializando lote {lote.id}: {e}")
            continue
    return lotes_validos


@router.get("/{lote_id}")
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
    
    # Verificar que tenga relaciones válidas
    if not db_lote.camada_origen or not db_lote.propietario:
        raise HTTPException(status_code=422, detail="El lote tiene relaciones inválidas")
    
    if not db_lote.camada_origen.madre or not db_lote.camada_origen.padre:
        raise HTTPException(status_code=422, detail="La camada de origen tiene relaciones inválidas")
    
    return serialize_lote_engorde(db_lote)


@router.put("/{lote_id}")
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
    
    # Registrar movimiento automáticamente
    try:
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Actualizó lote de engorde",
            modulo="Engorde",
            descripcion=f"Lote {db_lote.lote_id_str} con {db_lote.numero_cerdos} cerdos",
            tipo_movimiento="actualizar",
            entidad_tipo="lote_engorde",
            entidad_id=db_lote.id
        )
    except Exception as e:
        print(f"Error registrando movimiento: {e}")
    
    return serialize_lote_engorde(db_lote)


@router.delete("/{lote_id}")
def delete_lote_de_engorde(
    lote_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Elimina el registro de un lote de engorde.
    """
    # Obtener datos antes de eliminar para el registro
    lote_info = crud.get_lote_engorde(db, lote_id=lote_id)
    if lote_info is None:
        raise HTTPException(status_code=404, detail="Lote de engorde no encontrado para eliminar")
    
    db_lote = crud.delete_lote_engorde(db, lote_id=lote_id)
    if db_lote is None:
        raise HTTPException(status_code=404, detail="Lote de engorde no encontrado para eliminar")
    
    # Registrar movimiento automáticamente
    try:
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Eliminó lote de engorde",
            modulo="Engorde",
            descripcion=f"Lote eliminado: {lote_info.lote_id_str} con {lote_info.numero_cerdos} cerdos",
            tipo_movimiento="eliminar",
            entidad_tipo="lote_engorde",
            entidad_id=lote_id
        )
    except Exception as e:
        print(f"Error registrando movimiento: {e}")
    
    return serialize_lote_engorde(db_lote)