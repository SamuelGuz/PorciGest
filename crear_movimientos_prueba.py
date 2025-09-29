#!/usr/bin/env python3
"""
Script para crear movimientos de prueba en la base de datos usando SQLAlchemy directamente
"""

from app.database import SessionLocal
from app import models
from datetime import datetime, timedelta
import random

def crear_movimientos_prueba():
    """Crear movimientos de prueba directamente en la base de datos"""
    db = SessionLocal()
    
    try:
        # Verificar que hay al menos un usuario
        usuario = db.query(models.User).first()
        if not usuario:
            print("❌ No hay usuarios en la base de datos. Crea al menos un usuario primero.")
            return
        
        print(f"✅ Usuario encontrado: {usuario.nombre} {usuario.apellido}")
        
        # Datos de movimientos de prueba
        movimientos_data = [
            {
                "usuario_id": usuario.id,
                "usuario_nombre": f"{usuario.nombre} {usuario.apellido}",
                "accion": "Registró nueva cerda reproductora",
                "modulo": "Reproductoras",
                "descripcion": "Agregó cerda REP-001, raza Yorkshire, 2 años",
                "tipo_movimiento": "crear",
                "entidad_tipo": "cerda_reproductora",
                "entidad_id": 1,
                "fecha_movimiento": datetime.utcnow() - timedelta(hours=2)
            },
            {
                "usuario_id": usuario.id,
                "usuario_nombre": f"{usuario.nombre} {usuario.apellido}",
                "accion": "Actualizó estado reproductivo",
                "modulo": "Reproductoras", 
                "descripcion": "Cambió estado de REP-003 de 'Vacía' a 'Gestante'",
                "tipo_movimiento": "editar",
                "entidad_tipo": "cerda_reproductora",
                "entidad_id": 3,
                "fecha_movimiento": datetime.utcnow() - timedelta(hours=3)
            },
            {
                "usuario_id": usuario.id,
                "usuario_nombre": f"{usuario.nombre} {usuario.apellido}",
                "accion": "Registró nuevo semental",
                "modulo": "Sementales",
                "descripcion": "Agregó semental SEM-005, raza Duroc, alta fertilidad",
                "tipo_movimiento": "crear",
                "entidad_tipo": "semental",
                "entidad_id": 5,
                "fecha_movimiento": datetime.utcnow() - timedelta(hours=5)
            },
            {
                "usuario_id": usuario.id,
                "usuario_nombre": f"{usuario.nombre} {usuario.apellido}",
                "accion": "Eliminó semental por enfermedad",
                "modulo": "Sementales",
                "descripcion": "Eliminó semental SEM-002 debido a problemas de salud",
                "tipo_movimiento": "eliminar",
                "entidad_tipo": "semental",
                "entidad_id": 2,
                "fecha_movimiento": datetime.utcnow() - timedelta(hours=8)
            },
            {
                "usuario_id": usuario.id,
                "usuario_nombre": f"{usuario.nombre} {usuario.apellido}",
                "accion": "Registró nueva camada",
                "modulo": "Lechones",
                "descripcion": "Camada de 8 lechones, madre REP-001, peso promedio 1.2kg",
                "tipo_movimiento": "crear",
                "entidad_tipo": "camada_lechones",
                "entidad_id": 10,
                "fecha_movimiento": datetime.utcnow() - timedelta(hours=12)
            },
            {
                "usuario_id": usuario.id,
                "usuario_nombre": f"{usuario.nombre} {usuario.apellido}",
                "accion": "Actualizó peso de camada",
                "modulo": "Lechones",
                "descripcion": "Camada CAM-008: peso promedio actualizado a 15kg",
                "tipo_movimiento": "editar",
                "entidad_tipo": "camada_lechones",
                "entidad_id": 8,
                "fecha_movimiento": datetime.utcnow() - timedelta(hours=15)
            },
            {
                "usuario_id": usuario.id,
                "usuario_nombre": f"{usuario.nombre} {usuario.apellido}",
                "accion": "Transfirió lote a engorde",
                "modulo": "Engorde",
                "descripcion": "Movió 12 lechones de CAM-005 a lote ENG-012",
                "tipo_movimiento": "crear",
                "entidad_tipo": "lote_engorde",
                "entidad_id": 12,
                "fecha_movimiento": datetime.utcnow() - timedelta(days=1)
            },
            {
                "usuario_id": usuario.id,
                "usuario_nombre": f"{usuario.nombre} {usuario.apellido}",
                "accion": "Actualizó peso de lote en engorde",
                "modulo": "Engorde",
                "descripcion": "Lote ENG-003: peso promedio actualizado a 65kg",
                "tipo_movimiento": "editar",
                "entidad_tipo": "lote_engorde",
                "entidad_id": 3,
                "fecha_movimiento": datetime.utcnow() - timedelta(days=1, hours=5)
            },
            {
                "usuario_id": usuario.id,
                "usuario_nombre": f"{usuario.nombre} {usuario.apellido}",
                "accion": "Aplicó vacunación masiva",
                "modulo": "Veterinaria",
                "descripcion": "Vacunación antirrábica a 25 animales del sector A",
                "tipo_movimiento": "crear",
                "entidad_tipo": "tratamiento_veterinario",
                "entidad_id": 15,
                "fecha_movimiento": datetime.utcnow() - timedelta(days=2)
            },
            {
                "usuario_id": usuario.id,
                "usuario_nombre": f"{usuario.nombre} {usuario.apellido}",
                "accion": "Registró tratamiento antibiótico",
                "modulo": "Veterinaria",
                "descripcion": "Tratamiento con penicilina a cerda REP-007 por infección",
                "tipo_movimiento": "crear",
                "entidad_tipo": "tratamiento_veterinario",
                "entidad_id": 16,
                "fecha_movimiento": datetime.utcnow() - timedelta(days=3)
            },
            {
                "usuario_id": usuario.id,
                "usuario_nombre": f"{usuario.nombre} {usuario.apellido}",
                "accion": "Eliminó lote de engorde",
                "modulo": "Engorde",
                "descripcion": "Eliminó lote ENG-001 - animales vendidos",
                "tipo_movimiento": "eliminar",
                "entidad_tipo": "lote_engorde", 
                "entidad_id": 1,
                "fecha_movimiento": datetime.utcnow() - timedelta(days=4)
            },
            {
                "usuario_id": usuario.id,
                "usuario_nombre": f"{usuario.nombre} {usuario.apellido}",
                "accion": "Actualizó información veterinaria",
                "modulo": "Veterinaria",
                "descripcion": "Modificó dosis de tratamiento TRT-005",
                "tipo_movimiento": "editar",
                "entidad_tipo": "tratamiento_veterinario",
                "entidad_id": 5,
                "fecha_movimiento": datetime.utcnow() - timedelta(days=5)
            }
        ]
        
        # Limpiar movimientos existentes (opcional)
        db.query(models.Movimiento).delete()
        
        # Crear nuevos movimientos
        exitosos = 0
        for movimiento_data in movimientos_data:
            try:
                movimiento = models.Movimiento(**movimiento_data)
                db.add(movimiento)
                exitosos += 1
            except Exception as e:
                print(f"❌ Error creando movimiento: {e}")
        
        # Confirmar cambios
        db.commit()
        
        print(f"\n🎉 ¡Éxito! Se crearon {exitosos} movimientos de prueba.")
        print(f"📊 Total de movimientos en la base de datos: {db.query(models.Movimiento).count()}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    print("🐷 Generador de Movimientos de Prueba - PorciGest Pro")
    print("=" * 50)
    
    crear_movimientos_prueba()
    
    print(f"\n� Puedes ver los movimientos en:")
    print(f"   Frontend: http://localhost:3000/dashboard/movimientos")
    print(f"   API: http://localhost:8000/movimientos/")

if __name__ == "__main__":
    main()