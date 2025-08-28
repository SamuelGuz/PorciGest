from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base

# Ejemplo para la tabla de Cerdas Reproductoras
class CerdaReproductora(Base):
    __tablename__ = "cerdas_reproductoras"

    id = Column(Integer, primary_key=True, index=True)
    codigo_id = Column(String, unique=True, index=True, nullable=False)
    fecha_nacimiento = Column(Date)
    raza = Column(String)
    estado_reproductivo = Column(String, default="Vacía") # Ej: Vacía, Gestante, Lactancia

# Ejemplo para la tabla de Sementales
class Semental(Base):
    __tablename__ = "sementales"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    raza = Column(String)
    tasa_fertilidad = Column(Float, default=0.0)

# ... Aquí definirías el resto de tus modelos: Lechones, Lotes de Engorde, etc.