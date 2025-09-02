# app/models.py

from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base


class CerdaReproductora(Base):
    __tablename__ = "cerdas_reproductoras"

    id = Column(Integer, primary_key=True, index=True)
    codigo_id = Column(String, unique=True, index=True, nullable=False)
    fecha_nacimiento = Column(Date)
    raza = Column(String)
    estado_reproductivo = Column(String, default="Vacía")

    # Relaciones
    camadas = relationship("CamadaLechones", back_populates="madre")
    tratamientos = relationship("TratamientoVeterinario", back_populates="reproductora")


class Semental(Base):
    __tablename__ = "sementales"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    raza = Column(String)
    tasa_fertilidad = Column(Float, default=0.0)

    # Relaciones
    camadas = relationship("CamadaLechones", back_populates="padre")
    tratamientos = relationship("TratamientoVeterinario", back_populates="semental")


class CamadaLechones(Base):
    __tablename__ = "camadas_lechones"

    id = Column(Integer, primary_key=True, index=True)
    fecha_nacimiento = Column(Date, nullable=False)
    numero_lechones = Column(Integer, nullable=False)
    peso_promedio_kg = Column(Float)
    
    # Claves foráneas
    madre_id = Column(Integer, ForeignKey("cerdas_reproductoras.id"))
    padre_id = Column(Integer, ForeignKey("sementales.id"))

    # Relaciones
    madre = relationship("CerdaReproductora", back_populates="camadas")
    padre = relationship("Semental", back_populates="camadas")
    lote_engorde = relationship("LoteEngorde", back_populates="camada_origen", uselist=False)


class LoteEngorde(Base):
    __tablename__ = "lotes_engorde"

    id = Column(Integer, primary_key=True, index=True)
    lote_id_str = Column(String, unique=True, index=True, nullable=False) # Ej: LOT-2024-08
    cantidad_animales = Column(Integer, nullable=False)
    edad_dias = Column(Integer)
    peso_promedio_kg = Column(Float)

    # Clave foránea
    camada_origen_id = Column(Integer, ForeignKey("camadas_lechones.id"))
    
    # Relaciones
    camada_origen = relationship("CamadaLechones", back_populates="lote_engorde")
    tratamientos = relationship("TratamientoVeterinario", back_populates="lote_engorde")


class TratamientoVeterinario(Base):
    __tablename__ = "tratamientos_veterinarios"

    id = Column(Integer, primary_key=True, index=True)
    tipo_intervencion = Column(String, nullable=False) # Ej: "Vacunación", "Tratamiento"
    medicamento_producto = Column(String)
    dosis = Column(String)
    fecha = Column(Date, nullable=False)
    veterinario = Column(String)
    observaciones = Column(String)

    # Claves foráneas opcionales: un tratamiento pertenece a UNO de estos
    reproductora_id = Column(Integer, ForeignKey("cerdas_reproductoras.id"), nullable=True)
    semental_id = Column(Integer, ForeignKey("sementales.id"), nullable=True)
    lote_engorde_id = Column(Integer, ForeignKey("lotes_engorde.id"), nullable=True)

    # Relaciones para acceder a los objetos completos
    reproductora = relationship("CerdaReproductora", back_populates="tratamientos")
    semental = relationship("Semental", back_populates="tratamientos")
    lote_engorde = relationship("LoteEngorde", back_populates="tratamientos")