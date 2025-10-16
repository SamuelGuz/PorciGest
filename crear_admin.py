#!/usr/bin/env python3
"""
Script para crear un usuario administrador inicial de forma segura
"""
import sys
import os

# Agregar el directorio del proyecto al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app import models, schemas, crud

def main():
    print("🔧 Creando usuario administrador...")
    
    db = SessionLocal()
    
    try:
        # Verificar si ya existe un usuario admin
        existing_user = db.query(models.User).filter(models.User.numero_documento == "12345678").first()
        
        if existing_user:
            print(f"✅ Usuario administrador ya existe: {existing_user.nombre} {existing_user.apellido}")
            return
        
        # Crear usuario administrador
        user_data = schemas.UserCreate(
            nombre="Admin",
            apellido="Sistema", 
            tipo_documento="CC",
            numero_documento="12345678",
            password="admin123"  # Contraseña simple y corta
        )
        
        new_user = crud.create_user(db=db, user=user_data)
        print(f"✅ Usuario administrador creado: {new_user.nombre} {new_user.apellido}")
        print(f"📝 Documento: {new_user.numero_documento}")
        print(f"🔐 Contraseña: admin123")
        
    except Exception as e:
        print(f"❌ Error creando usuario: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()