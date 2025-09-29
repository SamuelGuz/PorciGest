# app/models.py
from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    apellido = Column(String)
    tipo_documento = Column(String)
    numero_documento = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    # Relaciones inversas: Un usuario puede tener muchos registros
    cerdas_reproductoras = relationship("CerdaReproductora", back_populates="propietario")
    sementales = relationship("Semental", back_populates="propietario")
    camadas = relationship("CamadaLechones", back_populates="propietario")
    lotes_engorde = relationship("LoteEngorde", back_populates="propietario")
    tratamientos = relationship("TratamientoVeterinario", back_populates="propietario")
    movimientos = relationship("Movimiento", foreign_keys="Movimiento.usuario_id")


class CerdaReproductora(Base):
    __tablename__ = "cerdas_reproductoras"
    id = Column(Integer, primary_key=True, index=True)
    codigo_id = Column(String, unique=True, index=True, nullable=False)
    fecha_nacimiento = Column(Date)
    raza = Column(String)
    estado_reproductivo = Column(String, default="Vacía")
    user_id = Column(Integer, ForeignKey("users.id"))
    
    propietario = relationship("User", back_populates="cerdas_reproductoras")
    camadas = relationship("CamadaLechones", back_populates="madre")
    tratamientos = relationship("TratamientoVeterinario", back_populates="reproductora")


class Semental(Base):
    __tablename__ = "sementales"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    raza = Column(String)
    tasa_fertilidad = Column(Float, default=0.0)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    propietario = relationship("User", back_populates="sementales")
    camadas = relationship("CamadaLechones", back_populates="padre")
    tratamientos = relationship("TratamientoVeterinario", back_populates="semental")


class CamadaLechones(Base):
    __tablename__ = "camadas_lechones"
    id = Column(Integer, primary_key=True, index=True)
    fecha_nacimiento = Column(Date, nullable=False)
    numero_lechones = Column(Integer, nullable=False)
    peso_promedio_kg = Column(Float)
    madre_id = Column(Integer, ForeignKey("cerdas_reproductoras.id"))
    padre_id = Column(Integer, ForeignKey("sementales.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    propietario = relationship("User", back_populates="camadas")
    madre = relationship("CerdaReproductora", back_populates="camadas")
    padre = relationship("Semental", back_populates="camadas")
    lote_engorde = relationship("LoteEngorde", back_populates="camada_origen", uselist=False)


class LoteEngorde(Base):
    __tablename__ = "lotes_engorde"
    id = Column(Integer, primary_key=True, index=True)
    lote_id_str = Column(String, unique=True, index=True, nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    numero_cerdos = Column(Integer, nullable=False)
    peso_inicial_promedio = Column(Float)
    peso_actual_promedio = Column(Float)
    camada_origen_id = Column(Integer, ForeignKey("camadas_lechones.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    propietario = relationship("User", back_populates="lotes_engorde")
    camada_origen = relationship("CamadaLechones", back_populates="lote_engorde")
    tratamientos = relationship("TratamientoVeterinario", back_populates="lote_engorde")


class TratamientoVeterinario(Base):
    __tablename__ = "tratamientos_veterinarios"
    id = Column(Integer, primary_key=True, index=True)
    tipo_intervencion = Column(String, nullable=False)
    medicamento_producto = Column(String)
    dosis = Column(String)
    fecha = Column(Date, nullable=False)
    veterinario = Column(String)
    observaciones = Column(String)
    reproductora_id = Column(Integer, ForeignKey("cerdas_reproductoras.id"), nullable=True)
    semental_id = Column(Integer, ForeignKey("sementales.id"), nullable=True)
    lote_engorde_id = Column(Integer, ForeignKey("lotes_engorde.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    propietario = relationship("User", back_populates="tratamientos")
    reproductora = relationship("CerdaReproductora", back_populates="tratamientos")
    semental = relationship("Semental", back_populates="tratamientos")
    lote_engorde = relationship("LoteEngorde", back_populates="tratamientos")


class Movimiento(Base):
    __tablename__ = "movimientos"
    
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    usuario_nombre = Column(String, nullable=False)  # Para facilitar consultas
    accion = Column(String, nullable=False)
    modulo = Column(String, nullable=False)  # reproductoras, sementales, lechones, engorde, veterinaria
    descripcion = Column(String)
    entidad_tipo = Column(String)  # tipo de entidad afectada (cerda, semental, camada, etc.)
    entidad_id = Column(Integer)  # ID de la entidad afectada
    tipo_movimiento = Column(String, nullable=False)  # crear, editar, eliminar
    fecha_movimiento = Column(DateTime, default=datetime.utcnow, nullable=False)
    ip_address = Column(String)  # IP del usuario para auditoría
    user_agent = Column(String)  # Información del navegador
    
    # Relación con usuario
    usuario = relationship("User", foreign_keys=[usuario_id], overlaps="movimientos")