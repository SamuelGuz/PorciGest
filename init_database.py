#!/usr/bin/env python3

"""
Script para inicializar la base de datos SQLite con datos de prueba
Ejecutar desde el directorio raíz del proyecto: python init_database.py
"""

import sys
import os

# Agregar el directorio del proyecto al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app import models, schemas, crud
from datetime import datetime

def main():
    print("🚀 Inicializando base de datos SQLite...")
    
    # Crear todas las tablas
    models.Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas")
    
    db = SessionLocal()
    
    try:
        # Crear usuario de prueba si no existe
        existing_user = db.query(models.User).filter(models.User.numero_documento == "12345678").first()
        if not existing_user:
            user_data = schemas.UserCreate(
                nombre="Admin",
                apellido="PorciGest", 
                tipo_documento="CC",
                numero_documento="12345678",
                password="admin123"
            )
            test_user = crud.create_user(db=db, user=user_data)
            print(f"✅ Usuario creado: {test_user.nombre} {test_user.apellido} (Doc: {test_user.numero_documento})")
        else:
            test_user = existing_user
            print(f"✅ Usuario existente: {test_user.nombre} {test_user.apellido} (Doc: {test_user.numero_documento})")
        
        # NO limpiar datos existentes - solo agregar si no existen
        # Contar reproductoras existentes
        existing_cerdas = db.query(models.CerdaReproductora).count()
        
        if existing_cerdas == 0:
            # Crear reproductoras de prueba solo si no hay ninguna
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
                print(f"✅ Reproductora creada: {cerda.codigo_id} (ID: {cerda.id})")
        else:
            print(f"ℹ️  Ya existen {existing_cerdas} reproductoras en la base de datos - no se crearon nuevas")
        
        # Contar sementales existentes
        existing_sementales = db.query(models.Semental).count()
        
        if existing_sementales == 0:
            # Crear sementales de prueba solo si no hay ninguno
            sementales_prueba = [
                {
                    "nombre": "Napoleón",
                    "raza": "Yorkshire",
                    "tasa_fertilidad": 85.5
                },
                {
                    "nombre": "Hércules", 
                    "raza": "Duroc",
                    "tasa_fertilidad": 92.0
                },
                {
                    "nombre": "Atlas",
                    "raza": "Hampshire",
                    "tasa_fertilidad": 87.8
                }
            ]
            
            for semental_data in sementales_prueba:
                semental_schema = schemas.SementalCreate(**semental_data)
                semental = crud.create_semental(db=db, semental=semental_schema, user_id=test_user.id)
                print(f"✅ Semental creado: {semental.nombre} (ID: {semental.id})")
        else:
            print(f"ℹ️  Ya existen {existing_sementales} sementales en la base de datos - no se crearon nuevos")
        
        print("🎉 Base de datos inicializada correctamente!")
        print("📍 Archivo de base de datos: porcigest_dev.db")
        print("👤 Usuario de prueba: Documento 12345678 / Contraseña: admin123")
        
    except Exception as e:
        print(f"❌ Error inicializando base de datos: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()