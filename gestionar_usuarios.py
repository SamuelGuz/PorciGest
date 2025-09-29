#!/usr/bin/env python3

"""
Script para ver y gestionar usuarios
"""

import sys
import os

# Agregar el directorio del proyecto al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app import models

def listar_usuarios():
    print("👥 Listando usuarios en la base de datos...")
    
    db = SessionLocal()
    
    try:
        users = db.query(models.User).all()
        
        if not users:
            print("❌ No hay usuarios en la base de datos")
            return
        
        print(f"✅ Encontrados {len(users)} usuarios:")
        for user in users:
            print(f"   👤 ID: {user.id}")
            print(f"   📛 Nombre: {user.nombre} {user.apellido}")
            print(f"   📄 Documento: {user.tipo_documento} {user.numero_documento}")
            print(f"   🔒 Hash: {user.hashed_password[:50]}...")
            print("   ---")
            
    except Exception as e:
        print(f"❌ Error al listar usuarios: {e}")
    finally:
        db.close()

def eliminar_usuario(numero_documento):
    print(f"🗑️ Eliminando usuario con documento {numero_documento}...")
    
    db = SessionLocal()
    
    try:
        user = db.query(models.User).filter(
            models.User.numero_documento == numero_documento
        ).first()
        
        if not user:
            print(f"❌ Usuario con documento {numero_documento} no encontrado")
            return
        
        db.delete(user)
        db.commit()
        print(f"✅ Usuario {user.nombre} {user.apellido} eliminado exitosamente")
        
    except Exception as e:
        print(f"❌ Error al eliminar usuario: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "eliminar":
        if len(sys.argv) > 2:
            eliminar_usuario(sys.argv[2])
        else:
            print("❌ Uso: python gestionar_usuarios.py eliminar <numero_documento>")
    else:
        listar_usuarios()