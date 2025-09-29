# app/routers/movimientos.py

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from .. import crud, models, schemas
from ..database import get_db
from ..security import get_current_user

router = APIRouter(prefix="/movimientos", tags=["movimientos"])

@router.post("/", response_model=dict)
def create_movimiento(
    movimiento: schemas.MovimientoCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Crear un nuevo movimiento"""
    # Obtener información adicional de la request
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent", "")
    
    # Actualizar los datos del movimiento con la información de la request
    movimiento.ip_address = ip_address
    movimiento.user_agent = user_agent
    
    new_movimiento = crud.create_movimiento(
        db=db, 
        movimiento=movimiento, 
        user_id=current_user.id,
        usuario_nombre=f"{current_user.nombre} {current_user.apellido}"
    )
    
    return {
        "id": new_movimiento.id,
        "usuario_id": new_movimiento.usuario_id,
        "usuario_nombre": new_movimiento.usuario_nombre,
        "accion": new_movimiento.accion,
        "modulo": new_movimiento.modulo,
        "descripcion": new_movimiento.descripcion,
        "entidad_tipo": new_movimiento.entidad_tipo,
        "entidad_id": new_movimiento.entidad_id,
        "tipo_movimiento": new_movimiento.tipo_movimiento,
        "fecha_movimiento": new_movimiento.fecha_movimiento.isoformat() if new_movimiento.fecha_movimiento else None,
        "ip_address": new_movimiento.ip_address,
        "user_agent": new_movimiento.user_agent
    }

@router.get("/", response_model=dict)
def get_movimientos(
    search: Optional[str] = None,
    modulo: Optional[str] = None,
    tipo_movimiento: Optional[str] = None,
    fecha_inicio: Optional[date] = None,
    fecha_fin: Optional[date] = None,
    usuario_id: Optional[int] = None,
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Obtener movimientos con filtros y paginación"""
    
    # Validaciones
    if size > 100:
        raise HTTPException(status_code=400, detail="El tamaño máximo por página es 100")
    if page < 1:
        raise HTTPException(status_code=400, detail="La página debe ser mayor a 0")
    
    filters = schemas.MovimientoFilters(
        search=search,
        modulo=modulo,
        tipo_movimiento=tipo_movimiento,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        usuario_id=usuario_id,
        page=page,
        size=size
    )
    
    result = crud.get_movimientos(db=db, filters=filters)
    
    # Convertir los movimientos a schemas
    movimientos_schema = []
    for mov in result["movimientos"]:
        movimiento_dict = {
            "id": mov.id,
            "usuario_id": mov.usuario_id,
            "usuario_nombre": mov.usuario_nombre,
            "accion": mov.accion,
            "modulo": mov.modulo,
            "descripcion": mov.descripcion,
            "entidad_tipo": mov.entidad_tipo,
            "entidad_id": mov.entidad_id,
            "tipo_movimiento": mov.tipo_movimiento,
            "fecha_movimiento": mov.fecha_movimiento.isoformat() if mov.fecha_movimiento else None,
            "ip_address": mov.ip_address,
            "user_agent": mov.user_agent
        }
        movimientos_schema.append(movimiento_dict)
    
    return {
        "movimientos": movimientos_schema,
        "total": result["total"],
        "page": result["page"],
        "size": result["size"],
        "total_pages": result["total_pages"]
    }

@router.get("/estadisticas")
def get_estadisticas_movimientos(
    dias: int = 30,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Obtener estadísticas de movimientos"""
    if dias < 1 or dias > 365:
        raise HTTPException(status_code=400, detail="Los días deben estar entre 1 y 365")
    
    return crud.get_estadisticas_movimientos(db=db, dias=dias)

@router.get("/{movimiento_id}", response_model=dict)
def get_movimiento(
    movimiento_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Obtener un movimiento específico"""
    movimiento = crud.get_movimiento(db=db, movimiento_id=movimiento_id)
    if not movimiento:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado")
    
    return {
        "id": movimiento.id,
        "usuario_id": movimiento.usuario_id,
        "usuario_nombre": movimiento.usuario_nombre,
        "accion": movimiento.accion,
        "modulo": movimiento.modulo,
        "descripcion": movimiento.descripcion,
        "entidad_tipo": movimiento.entidad_tipo,
        "entidad_id": movimiento.entidad_id,
        "tipo_movimiento": movimiento.tipo_movimiento,
        "fecha_movimiento": movimiento.fecha_movimiento.isoformat() if movimiento.fecha_movimiento else None,
        "ip_address": movimiento.ip_address,
        "user_agent": movimiento.user_agent
    }

@router.get("/usuario/{usuario_id}")
def get_movimientos_usuario(
    usuario_id: int,
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Obtener movimientos de un usuario específico"""
    filters = schemas.MovimientoFilters(
        usuario_id=usuario_id,
        page=page,
        size=size
    )
    
    return crud.get_movimientos(db=db, filters=filters)

# Endpoint para obtener opciones de filtros
@router.get("/opciones/modulos")
def get_modulos_disponibles(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Obtener lista de módulos disponibles para filtrar"""
    return {
        "modulos": [
            "Reproductoras",
            "Sementales", 
            "Lechones",
            "Engorde",
            "Veterinaria"
        ]
    }

@router.get("/opciones/tipos")
def get_tipos_movimiento_disponibles(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Obtener lista de tipos de movimiento disponibles para filtrar"""
    return {
        "tipos": [
            "crear",
            "editar", 
            "eliminar"
        ]
    }