from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from database import get_db
from services.user_service import UserService
from schemas.user_schema import UserCreate, UserResponse, Token, LoginRequest
from utils.auth import (
    create_access_token, 
    get_current_user, 
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(
    prefix="/api/auth",
    tags=["authentication"]
)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Neuen User registrieren
    
    Args:
        user_data: User-Daten (email, username, password, full_name)
        db: Datenbank Session
    
    Returns:
        Erstellter User (ohne Passwort)
    
    Raises:
        HTTPException 400: Wenn E-Mail oder Username bereits existiert
    """
    service = UserService(db)
    
    # Prüfen ob E-Mail bereits existiert
    if service.check_email_exists(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-Mail-Adresse wird bereits verwendet"
        )
    
    # Prüfen ob Username bereits existiert
    if service.check_username_exists(user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Benutzername wird bereits verwendet"
        )
    
    # User erstellen
    new_user = service.create(user_data.model_dump())
    
    return new_user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    User einloggen (OAuth2 Standard)
    
    Args:
        form_data: OAuth2 Form mit username und password
        db: Datenbank Session
    
    Returns:
        Access Token
    
    Raises:
        HTTPException 401: Wenn Credentials falsch sind
    """
    service = UserService(db)
    
    # User authentifizieren
    user = service.authenticate(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Falscher Benutzername oder Passwort",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User ist deaktiviert"
        )
    
    # Access Token erstellen
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user.username,
            "user_id": user.userid,
            "email": user.email
        },
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/login-json", response_model=Token)
def login_json(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    User einloggen (JSON Format - für React)
    
    Args:
        login_data: Login-Daten als JSON
        db: Datenbank Session
    
    Returns:
        Access Token
    
    Raises:
        HTTPException 401: Wenn Credentials falsch sind
    """
    service = UserService(db)
    
    # User authentifizieren
    user = service.authenticate(login_data.username, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Falscher Benutzername oder Passwort",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User ist deaktiviert"
        )
    
    # Access Token erstellen
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user.username,
            "user_id": user.userid,
            "email": user.email
        },
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user = Depends(get_current_user)
):
    """
    Informationen über den aktuell eingeloggten User abrufen
    
    Args:
        current_user: Aktueller User (aus JWT Token)
    
    Returns:
        User-Informationen
    """
    return current_user


@router.post("/logout")
def logout():
    """
    User ausloggen
    
    Note: Bei JWT muss das Token clientseitig gelöscht werden.
    Dieser Endpoint ist hauptsächlich für Konsistenz und könnte
    für Token-Blacklisting erweitert werden.
    
    Returns:
        Success-Message
    """
    return {"message": "Erfolgreich abgemeldet"}

# NEU:
#
# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
#
# from db import get_db
# from schemas.auth import LoginRequest, TokenResponse, MeResponse
# from services.auth_service import AuthService
# from core.security import get_current_claims
#
# router = APIRouter(prefix="/auth", tags=["auth"])
#
# @router.post("/login", response_model=TokenResponse)
# def login(payload: LoginRequest, db: Session = Depends(get_db)):
#     svc = AuthService(db)
#     result = svc.login(payload.type, payload.email, payload.password)
#     return {
#         "access_token": result["access_token"],
#         "role": result["role"],
#         "user_id": result["user_id"],
#         "user_type": result["user_type"],
#         "token_type": "bearer",
#     }
#
# @router.get("/me", response_model=MeResponse)
# def me(claims = Depends(get_current_claims)):
#     return {
#         "user_id": int(claims["sub"]),
#         "user_type": claims["type"],
#         "role": claims["role"],
#         "email": claims.get("email", "")
#     }

