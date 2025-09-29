# app/crud.py

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_, func
from datetime import datetime, date, timedelta
from . import models, schemas, security

# --- Operaciones CRUD para Cerdas Reproductoras ---

def get_cerda_by_codigo(db: Session, codigo_id: str):
    return db.query(models.CerdaReproductora).filter(models.CerdaReproductora.codigo_id == codigo_id).first()

def get_cerda(db: Session, cerda_id: int):
    return db.query(models.CerdaReproductora).options(joinedload(models.CerdaReproductora.propietario)).filter(models.CerdaReproductora.id == cerda_id).first()

def get_cerdas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CerdaReproductora).options(joinedload(models.CerdaReproductora.propietario)).offset(skip).limit(limit).all()

def create_cerda(db: Session, cerda: schemas.CerdaCreate, user_id: int):
    db_cerda = models.CerdaReproductora(**cerda.dict(), user_id=user_id)
    db.add(db_cerda)
    db.commit()
    db.refresh(db_cerda)
    return db_cerda

def update_cerda(db: Session, cerda_id: int, cerda_update: schemas.CerdaUpdate):
    db_cerda = db.query(models.CerdaReproductora).filter(models.CerdaReproductora.id == cerda_id).first()
    if not db_cerda: return None
    update_data = cerda_update.dict(exclude_unset=True)
    for key, value in update_data.items(): setattr(db_cerda, key, value)
    db.add(db_cerda)
    db.commit()
    db.refresh(db_cerda)
    return db_cerda

def delete_cerda(db: Session, cerda_id: int):
    # Cargamos la cerda con su relación propietario ANTES de eliminar
    db_cerda = db.query(models.CerdaReproductora).options(joinedload(models.CerdaReproductora.propietario)).filter(models.CerdaReproductora.id == cerda_id).first()
    if not db_cerda: 
        return None
    
    # Forzamos la carga de la relación para evitar lazy loading después del delete
    _ = db_cerda.propietario  # Esto carga la relación
    
    # Eliminamos el objeto de la base de datos
    db.delete(db_cerda)
    db.commit()
    
    return db_cerda

# --- OPERACIONES CRUD PARA SEMENTALES ---

def get_semental(db: Session, semental_id: int):
    return db.query(models.Semental).options(joinedload(models.Semental.propietario)).filter(models.Semental.id == semental_id).first()

def get_semental_by_nombre(db: Session, nombre: str):
    return db.query(models.Semental).filter(models.Semental.nombre == nombre).first()

def get_sementales(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Semental).options(joinedload(models.Semental.propietario)).offset(skip).limit(limit).all()

def create_semental(db: Session, semental: schemas.SementalCreate, user_id: int):
    db_semental = models.Semental(**semental.dict(), user_id=user_id)
    db.add(db_semental)
    db.commit()
    db.refresh(db_semental)
    return db_semental

def update_semental(db: Session, semental_id: int, semental_update: schemas.SementalUpdate):
    db_semental = db.query(models.Semental).filter(models.Semental.id == semental_id).first()
    if not db_semental: return None
    update_data = semental_update.dict(exclude_unset=True)
    for key, value in update_data.items(): setattr(db_semental, key, value)
    db.add(db_semental)
    db.commit()
    db.refresh(db_semental)
    return db_semental

def delete_semental(db: Session, semental_id: int):
    # Cargamos el semental con su relación propietario ANTES de eliminar
    db_semental = db.query(models.Semental).options(joinedload(models.Semental.propietario)).filter(models.Semental.id == semental_id).first()
    if not db_semental: 
        return None
    
    # Forzamos la carga de la relación para evitar lazy loading después del delete
    _ = db_semental.propietario  # Esto carga la relación
    
    # Eliminamos el objeto de la base de datos
    db.delete(db_semental)
    db.commit()
    
    return db_semental

# --- OPERACIONES CRUD PARA CAMADAS DE LECHONES ---

def create_camada(db: Session, camada: schemas.CamadaCreate, user_id: int):
    db_camada = models.CamadaLechones(**camada.dict(), user_id=user_id)
    db.add(db_camada)
    db.commit()
    db.refresh(db_camada)
    return get_camada(db, db_camada.id)

def get_camada(db: Session, camada_id: int):
    return db.query(models.CamadaLechones).options(joinedload(models.CamadaLechones.madre), joinedload(models.CamadaLechones.padre), joinedload(models.CamadaLechones.propietario)).filter(models.CamadaLechones.id == camada_id).first()

def get_camadas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CamadaLechones).options(joinedload(models.CamadaLechones.madre), joinedload(models.CamadaLechones.padre), joinedload(models.CamadaLechones.propietario)).offset(skip).limit(limit).all()

def update_camada(db: Session, camada_id: int, camada_update: schemas.CamadaUpdate):
    db_camada = db.query(models.CamadaLechones).filter(models.CamadaLechones.id == camada_id).first()
    if not db_camada: return None
    update_data = camada_update.dict(exclude_unset=True)
    for key, value in update_data.items(): setattr(db_camada, key, value)
    db.add(db_camada)
    db.commit()
    db.refresh(db_camada)
    return get_camada(db, db_camada.id)

def delete_camada(db: Session, camada_id: int):
    db_camada = get_camada(db, camada_id)
    if not db_camada: 
        return None
    
    # Forzamos la carga de las relaciones para evitar lazy loading después del delete
    _ = db_camada.propietario
    _ = db_camada.madre
    _ = db_camada.padre
    
    db.delete(db_camada)
    db.commit()
    return db_camada

# --- OPERACIONES CRUD PARA LOTES DE ENGORDE ---

def create_lote_engorde(db: Session, lote: schemas.LoteEngordeCreate, user_id: int):
    db_lote = models.LoteEngorde(**lote.dict(), user_id=user_id)
    db.add(db_lote)
    db.commit()
    db.refresh(db_lote)
    return get_lote_engorde(db, db_lote.id)

def get_lote_engorde(db: Session, lote_id: int):
    return db.query(models.LoteEngorde).options(joinedload(models.LoteEngorde.camada_origen).joinedload(models.CamadaLechones.madre), joinedload(models.LoteEngorde.camada_origen).joinedload(models.CamadaLechones.padre), joinedload(models.LoteEngorde.propietario)).filter(models.LoteEngorde.id == lote_id).first()

def get_lote_engorde_by_str_id(db: Session, lote_id_str: str):
    return db.query(models.LoteEngorde).filter(models.LoteEngorde.lote_id_str == lote_id_str).first()

def get_lotes_engorde(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.LoteEngorde).options(joinedload(models.LoteEngorde.camada_origen).joinedload(models.CamadaLechones.madre), joinedload(models.LoteEngorde.camada_origen).joinedload(models.CamadaLechones.padre), joinedload(models.LoteEngorde.propietario)).offset(skip).limit(limit).all()

def update_lote_engorde(db: Session, lote_id: int, lote_update: schemas.LoteEngordeUpdate):
    db_lote = db.query(models.LoteEngorde).filter(models.LoteEngorde.id == lote_id).first()
    if not db_lote: return None
    update_data = lote_update.dict(exclude_unset=True)
    for key, value in update_data.items(): setattr(db_lote, key, value)
    db.add(db_lote)
    db.commit()
    db.refresh(db_lote)
    return get_lote_engorde(db, db_lote.id)

def delete_lote_engorde(db: Session, lote_id: int):
    db_lote = get_lote_engorde(db, lote_id)
    if not db_lote: 
        return None
    
    # Forzamos la carga de las relaciones para evitar lazy loading después del delete
    _ = db_lote.propietario
    _ = db_lote.camada_origen
    
    db.delete(db_lote)
    db.commit()
    return db_lote

# --- OPERACIONES CRUD PARA TRATAMIENTOS VETERINARIOS ---

def create_tratamiento(db: Session, tratamiento: schemas.TratamientoCreate, user_id: int):
    db_tratamiento = models.TratamientoVeterinario(**tratamiento.dict(), user_id=user_id)
    db.add(db_tratamiento)
    db.commit()
    db.refresh(db_tratamiento)
    return get_tratamiento(db, db_tratamiento.id)

def get_tratamiento(db: Session, tratamiento_id: int):
    return db.query(models.TratamientoVeterinario).options(joinedload(models.TratamientoVeterinario.reproductora), joinedload(models.TratamientoVeterinario.semental), joinedload(models.TratamientoVeterinario.lote_engorde), joinedload(models.TratamientoVeterinario.propietario)).filter(models.TratamientoVeterinario.id == tratamiento_id).first()

def get_tratamientos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.TratamientoVeterinario).options(joinedload(models.TratamientoVeterinario.reproductora), joinedload(models.TratamientoVeterinario.semental), joinedload(models.TratamientoVeterinario.lote_engorde), joinedload(models.TratamientoVeterinario.propietario)).offset(skip).limit(limit).all()

def update_tratamiento(db: Session, tratamiento_id: int, tratamiento_update: schemas.TratamientoUpdate):
    db_tratamiento = db.query(models.TratamientoVeterinario).filter(models.TratamientoVeterinario.id == tratamiento_id).first()
    if not db_tratamiento: return None
    update_data = tratamiento_update.dict(exclude_unset=True)
    for key, value in update_data.items(): setattr(db_tratamiento, key, value)
    db.add(db_tratamiento)
    db.commit()
    db.refresh(db_tratamiento)
    return get_tratamiento(db, db_tratamiento.id)

def delete_tratamiento(db: Session, tratamiento_id: int):
    db_tratamiento = get_tratamiento(db, tratamiento_id)
    if not db_tratamiento: 
        return None
    
    # Forzamos la carga de las relaciones para evitar lazy loading después del delete
    _ = db_tratamiento.propietario
    _ = db_tratamiento.reproductora  # Puede ser None
    _ = db_tratamiento.semental      # Puede ser None  
    _ = db_tratamiento.lote_engorde  # Puede ser None
    
    db.delete(db_tratamiento)
    db.commit()
    return db_tratamiento

# --- OPERACIONES CRUD PARA USUARIOS ---

def get_user_by_documento(db: Session, numero_documento: str):
    return db.query(models.User).filter(models.User.numero_documento == numero_documento).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        nombre=user.nombre,
        apellido=user.apellido,
        tipo_documento=user.tipo_documento,
        numero_documento=user.numero_documento,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# --- OPERACIONES CRUD PARA MOVIMIENTOS ---

def create_movimiento(db: Session, movimiento: schemas.MovimientoCreate, user_id: int, usuario_nombre: str):
    """Crear un nuevo registro de movimiento"""
    db_movimiento = models.Movimiento(
        usuario_id=user_id,
        usuario_nombre=usuario_nombre,
        accion=movimiento.accion,
        modulo=movimiento.modulo,
        descripcion=movimiento.descripcion,
        entidad_tipo=movimiento.entidad_tipo,
        entidad_id=movimiento.entidad_id,
        tipo_movimiento=movimiento.tipo_movimiento,
        ip_address=movimiento.ip_address,
        user_agent=movimiento.user_agent,
        fecha_movimiento=datetime.utcnow()
    )
    db.add(db_movimiento)
    db.commit()
    db.refresh(db_movimiento)
    return db_movimiento

def get_movimientos(db: Session, filters: schemas.MovimientoFilters):
    """Obtener movimientos con filtros y paginación"""
    query = db.query(models.Movimiento)
    
    # Aplicar filtros
    if filters.search:
        search_term = f"%{filters.search}%"
        query = query.filter(
            or_(
                models.Movimiento.usuario_nombre.ilike(search_term),
                models.Movimiento.accion.ilike(search_term),
                models.Movimiento.descripcion.ilike(search_term)
            )
        )
    
    if filters.modulo:
        query = query.filter(models.Movimiento.modulo == filters.modulo)
    
    if filters.tipo_movimiento:
        query = query.filter(models.Movimiento.tipo_movimiento == filters.tipo_movimiento)
    
    if filters.usuario_id:
        query = query.filter(models.Movimiento.usuario_id == filters.usuario_id)
    
    if filters.fecha_inicio and filters.fecha_fin:
        fecha_inicio = datetime.combine(filters.fecha_inicio, datetime.min.time())
        fecha_fin = datetime.combine(filters.fecha_fin, datetime.max.time())
        query = query.filter(
            and_(
                models.Movimiento.fecha_movimiento >= fecha_inicio,
                models.Movimiento.fecha_movimiento <= fecha_fin
            )
        )
    
    # Ordenar por fecha más reciente
    query = query.order_by(models.Movimiento.fecha_movimiento.desc())
    
    # Contar total de registros (antes de la paginación)
    total = query.count()
    
    # Aplicar paginación
    offset = (filters.page - 1) * filters.size
    movimientos = query.offset(offset).limit(filters.size).all()
    
    return {
        "movimientos": movimientos,
        "total": total,
        "page": filters.page,
        "size": filters.size,
        "total_pages": (total + filters.size - 1) // filters.size
    }

def get_movimiento(db: Session, movimiento_id: int):
    """Obtener un movimiento específico"""
    return db.query(models.Movimiento).filter(models.Movimiento.id == movimiento_id).first()

def get_estadisticas_movimientos(db: Session, dias: int = 30):
    """Obtener estadísticas de movimientos de los últimos N días"""
    fecha_limite = datetime.utcnow() - timedelta(days=dias)
    
    # Total de movimientos
    total_movimientos = db.query(models.Movimiento).filter(
        models.Movimiento.fecha_movimiento >= fecha_limite
    ).count()
    
    # Movimientos por tipo
    movimientos_por_tipo = db.query(
        models.Movimiento.tipo_movimiento,
        func.count(models.Movimiento.id).label('count')
    ).filter(
        models.Movimiento.fecha_movimiento >= fecha_limite
    ).group_by(models.Movimiento.tipo_movimiento).all()
    
    # Movimientos por módulo
    movimientos_por_modulo = db.query(
        models.Movimiento.modulo,
        func.count(models.Movimiento.id).label('count')
    ).filter(
        models.Movimiento.fecha_movimiento >= fecha_limite
    ).group_by(models.Movimiento.modulo).all()
    
    # Usuarios más activos
    usuarios_activos = db.query(
        models.Movimiento.usuario_nombre,
        func.count(models.Movimiento.id).label('count')
    ).filter(
        models.Movimiento.fecha_movimiento >= fecha_limite
    ).group_by(models.Movimiento.usuario_nombre).order_by(
        func.count(models.Movimiento.id).desc()
    ).limit(5).all()
    
    return {
        "total_movimientos": total_movimientos,
        "movimientos_por_tipo": [{"tipo": item[0], "cantidad": item[1]} for item in movimientos_por_tipo],
        "movimientos_por_modulo": [{"modulo": item[0], "cantidad": item[1]} for item in movimientos_por_modulo],
        "usuarios_activos": [{"usuario": item[0], "cantidad": item[1]} for item in usuarios_activos],
        "periodo_dias": dias
    }

# Función auxiliar para registrar movimientos automáticamente
def registrar_movimiento_automatico(
    db: Session, 
    usuario_id: int, 
    usuario_nombre: str,
    accion: str,
    modulo: str,
    descripcion: str,
    tipo_movimiento: str,
    entidad_tipo: str = None,
    entidad_id: int = None,
    ip_address: str = None,
    user_agent: str = None
):
    """Función auxiliar para registrar movimientos automáticamente desde otros módulos"""
    movimiento_data = schemas.MovimientoCreate(
        accion=accion,
        modulo=modulo,
        descripcion=descripcion,
        entidad_tipo=entidad_tipo,
        entidad_id=entidad_id,
        tipo_movimiento=tipo_movimiento,
        ip_address=ip_address,
        user_agent=user_agent
    )
    return create_movimiento(db, movimiento_data, usuario_id, usuario_nombre)