# app/routers/lechones.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from .. import crud, models, schemas, security
from ..database import get_db

def serialize_camada(camada):
    """Serializar camada manualmente para evitar errores de Pydantic"""
    if not camada:
        return None
    
    try:
        return {
            "id": camada.id,
            "fecha_nacimiento": camada.fecha_nacimiento.isoformat() if camada.fecha_nacimiento else None,
            "numero_lechones": camada.numero_lechones,
            "peso_promedio_kg": camada.peso_promedio_kg,
            "madre_id": camada.madre_id,
            "padre_id": camada.padre_id,
            "madre": {
                "id": camada.madre.id,
                "codigo_id": camada.madre.codigo_id,
                "fecha_nacimiento": camada.madre.fecha_nacimiento.isoformat() if camada.madre.fecha_nacimiento else None,
                "raza": camada.madre.raza,
                "estado_reproductivo": camada.madre.estado_reproductivo,
                "propietario": {
                    "id": camada.madre.propietario.id,
                    "nombre": camada.madre.propietario.nombre,
                    "apellido": camada.madre.propietario.apellido
                } if camada.madre.propietario else None
            } if camada.madre else None,
            "padre": {
                "id": camada.padre.id,
                "nombre": camada.padre.nombre,
                "raza": camada.padre.raza,
                "tasa_fertilidad": camada.padre.tasa_fertilidad,
                "propietario": {
                    "id": camada.padre.propietario.id,
                    "nombre": camada.padre.propietario.nombre,
                    "apellido": camada.padre.propietario.apellido
                } if camada.padre.propietario else None
            } if camada.padre else None,
            "propietario": {
                "id": camada.propietario.id,
                "nombre": camada.propietario.nombre,
                "apellido": camada.propietario.apellido
            } if camada.propietario else None
        }
    except Exception as e:
        print(f"Error serializando camada {camada.id}: {e}")
        return None

router = APIRouter(
    prefix="/lechones",
    tags=["Lechones (Camadas)"]
)

@router.post("/", status_code=201)
def create_camada_de_lechones(
    camada: schemas.CamadaCreate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Registra una nueva camada de lechones y la asocia al usuario autenticado.
    """
    db_madre = crud.get_cerda(db, cerda_id=camada.madre_id)
    if not db_madre:
        raise HTTPException(status_code=404, detail=f"No se encontró la cerda madre con ID {camada.madre_id}")
    
    db_padre = crud.get_semental(db, semental_id=camada.padre_id)
    if not db_padre:
        raise HTTPException(status_code=404, detail=f"No se encontró el semental padre con ID {camada.padre_id}")

    # Crear la camada
    new_camada = crud.create_camada(db=db, camada=camada, user_id=current_user.id)
    
    # Registrar movimiento automáticamente
    try:
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Registró nueva camada de lechones",
            modulo="Lechones",
            descripcion=f"Camada de {new_camada.numero_lechones} lechones, madre: {db_madre.codigo_id}, padre: {db_padre.nombre}",
            tipo_movimiento="crear",
            entidad_tipo="camada_lechones",
            entidad_id=new_camada.id
        )
    except Exception as e:
        print(f"Error registrando movimiento: {e}")
    
    return serialize_camada(new_camada)

@router.get("/")
def read_camadas_de_lechones(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Obtiene una lista de todas las camadas de lechones registradas.
    """
    camadas = crud.get_camadas(db, skip=skip, limit=limit)
    # Filtrar camadas que tengan madre y padre válidos
    camadas_validas = []
    for camada in camadas:
        try:
            if camada.madre and camada.padre and camada.propietario:
                serialized = serialize_camada(camada)
                if serialized and serialized.get('madre') and serialized.get('padre'):
                    camadas_validas.append(serialized)
        except Exception as e:
            print(f"Error serializando camada {camada.id}: {e}")
            continue
    return camadas_validas

@router.get("/{camada_id}")
def read_camada_de_lechones(
    camada_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Obtiene la información de una camada específica por su ID.
    """
    db_camada = crud.get_camada(db, camada_id=camada_id)
    if db_camada is None:
        raise HTTPException(status_code=404, detail="Camada no encontrada")
    
    # Verificar que tenga relaciones válidas
    if not db_camada.madre or not db_camada.padre or not db_camada.propietario:
        raise HTTPException(status_code=422, detail="La camada tiene relaciones inválidas")
    
    return serialize_camada(db_camada)

@router.put("/{camada_id}")
def update_camada_de_lechones(
    camada_id: int, 
    camada: schemas.CamadaUpdate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Actualiza la información de una camada específica.
    """
    db_camada = crud.update_camada(db, camada_id=camada_id, camada_update=camada)
    if db_camada is None:
        raise HTTPException(status_code=404, detail="Camada no encontrada para actualizar")
    
    # Registrar movimiento automáticamente
    try:
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Actualizó camada de lechones",
            modulo="Lechones",
            descripcion=f"Camada ID {camada_id}: {db_camada.numero_lechones} lechones",
            tipo_movimiento="actualizar",
            entidad_tipo="camada_lechones",
            entidad_id=db_camada.id
        )
    except Exception as e:
        print(f"Error registrando movimiento: {e}")
    
    return serialize_camada(db_camada)

@router.delete("/{camada_id}")
def delete_camada_de_lechones(
    camada_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Elimina el registro de una camada específica.
    """
    # Obtener datos antes de eliminar para el registro
    camada_info = crud.get_camada(db, camada_id=camada_id)
    if camada_info is None:
        raise HTTPException(status_code=404, detail="Camada no encontrada para eliminar")
    
    db_camada = crud.delete_camada(db, camada_id=camada_id)
    if db_camada is None:
        raise HTTPException(status_code=404, detail="Camada no encontrada para eliminar")
    
    # Registrar movimiento automáticamente
    try:
        crud.registrar_movimiento_automatico(
            db=db,
            usuario_id=current_user.id,
            usuario_nombre=f"{current_user.nombre} {current_user.apellido}",
            accion="Eliminó camada de lechones",
            modulo="Lechones",
            descripcion=f"Camada eliminada con {camada_info.numero_lechones} lechones",
            tipo_movimiento="eliminar",
            entidad_tipo="camada_lechones",
            entidad_id=camada_id
        )
    except Exception as e:
        print(f"Error registrando movimiento: {e}")
    
    return serialize_camada(db_camada)