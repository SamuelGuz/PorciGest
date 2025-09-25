# app/init_db.py

from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import SessionLocal, engine
from datetime import date

def init_database():
    """Inicializar la base de datos con datos de prueba"""
    
    # Crear todas las tablas
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Crear usuario de prueba si no existe
        existing_user = db.query(models.User).filter(models.User.email == "admin@porcigest.com").first()
        if not existing_user:
            user_data = schemas.UserCreate(
                nombre="Admin",
                apellido="PorciGest", 
                email="admin@porcigest.com",
                password="admin123"
            )
            test_user = crud.create_user(db=db, user=user_data)
            print(f"✅ Usuario creado: {test_user.email}")
        else:
            test_user = existing_user
            print(f"✅ Usuario existente: {test_user.email}")
        
        # Crear reproductoras de prueba si no existen
        existing_cerdas = db.query(models.Cerda).count()
        if existing_cerdas == 0:
            reproductoras_prueba = [
                {
                    "codigo_id": "R001",
                    "fecha_nacimiento": "2021-03-15",
                    "raza": "Yorkshire",
                    "estado_reproductivo": "Gestante"
                },
                {
                    "codigo_id": "R002", 
                    "fecha_nacimiento": "2021-07-20",
                    "raza": "Landrace",
                    "estado_reproductivo": "Vacía"
                },
                {
                    "codigo_id": "R003",
                    "fecha_nacimiento": "2020-11-10", 
                    "raza": "Duroc",
                    "estado_reproductivo": "Lactando"
                },
                {
                    "codigo_id": "R004",
                    "fecha_nacimiento": "2021-02-28",
                    "raza": "Hampshire", 
                    "estado_reproductivo": "Vacía"
                },
                {
                    "codigo_id": "R005",
                    "fecha_nacimiento": "2020-09-05",
                    "raza": "Pietrain",
                    "estado_reproductivo": "Gestante"
                }
            ]
            
            for reproductora_data in reproductoras_prueba:
                reproductora_schema = schemas.CerdaCreate(**reproductora_data)
                cerda = crud.create_cerda(db=db, cerda=reproductora_schema, user_id=test_user.id)
                print(f"✅ Reproductora creada: {cerda.codigo_id}")
        else:
            print(f"✅ Ya existen {existing_cerdas} reproductoras en la base de datos")
        
        print("🎉 Base de datos inicializada correctamente!")
        
    except Exception as e:
        print(f"❌ Error inicializando base de datos: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_database()