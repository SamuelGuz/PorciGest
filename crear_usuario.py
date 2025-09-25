#!/usr/bin/env python3

"""
Script para crear un usuario específico
"""

import sys
import os

# Agregar el directorio del proyecto al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app import models, schemas, crud

def crear_usuario():
    print("👤 Creando usuario personalizado...")
    
    db = SessionLocal()
    
    try:
        # Solicitar datos del usuario
        nombre = input("Nombre: ")
        apellido = input("Apellido: ")
        tipo_documento = input("Tipo de documento (CC, TI, CE, etc.): ")
        numero_documento = input("Número de documento: ")
        password = input("Contraseña: ")
        
        # Verificar si ya existe
        existing_user = db.query(models.User).filter(
            models.User.numero_documento == numero_documento
        ).first()
        
        if existing_user:
            print(f"❌ Ya existe un usuario con el documento {numero_documento}")
            return
        
        # Crear el usuario
        user_data = schemas.UserCreate(
            nombre=nombre,
            apellido=apellido,
            tipo_documento=tipo_documento,
            numero_documento=numero_documento,
            password=password
        )
        
        new_user = crud.create_user(db=db, user=user_data)
        print(f"✅ Usuario creado exitosamente:")
        print(f"   Nombre: {new_user.nombre} {new_user.apellido}")
        print(f"   Documento: {new_user.numero_documento}")
        print(f"   ID: {new_user.id}")
        
    except Exception as e:
        print(f"❌ Error creando usuario: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    crear_usuario()