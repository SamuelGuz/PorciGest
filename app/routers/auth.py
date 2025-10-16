# app/routers/auth.py
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import crud, schemas, security
from ..config import settings

router = APIRouter(tags=["Autenticación"])

@router.post("/signup", response_model=schemas.User, status_code=201)
def signup(user: schemas.UserCreate, db: Session = Depends(security.get_db)):
    """
    Endpoint para el registro de un nuevo usuario.
    """
    db_user = crud.get_user_by_documento(db, numero_documento=user.numero_documento)
    if db_user:
        raise HTTPException(status_code=400, detail="El número de documento ya está registrado")
    return crud.create_user(db=db, user=user)

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(db: Session = Depends(security.get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Endpoint para el login de usuario.
    Recibe 'username' (que será el número de documento) y 'password'.
    Devuelve un token de acceso y datos del usuario.
    """
    user = crud.get_user_by_documento(db, numero_documento=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Número de documento o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = security.create_access_token(
        data={"sub": user.numero_documento}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "nombre": user.nombre,
        "apellido": user.apellido,
        "numero_documento": user.numero_documento,
        "tipo_documento": user.tipo_documento
    }