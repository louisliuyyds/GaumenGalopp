from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

# Konfiguration aus .env
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Password Hashing Context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 Schema
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ===== PASSWORD FUNKTIONEN =====

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Überprüft ob das Klartext-Passwort mit dem Hash übereinstimmt

    Args:
        plain_password: Klartext-Passwort vom User
        hashed_password: Gehashtes Passwort aus der Datenbank

    Returns:
        True wenn Passwort korrekt, False wenn falsch
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hasht ein Passwort mit bcrypt

    Args:
        password: Klartext-Passwort

    Returns:
        Gehashtes Passwort
    """
    return pwd_context.hash(password)


# ===== JWT TOKEN FUNKTIONEN =====

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Erstellt einen JWT Access Token

    Args:
        data: Dictionary mit Daten die im Token gespeichert werden sollen
              Sollte mindestens 'sub' (subject) enthalten
        expires_delta: Optionale Gültigkeitsdauer

    Returns:
        JWT Token als String
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """
    Dekodiert einen JWT Token

    Args:
        token: Der JWT Token

    Returns:
        Dictionary mit den Token-Daten (payload)

    Raises:
        HTTPException: Wenn Token ungültig oder abgelaufen ist
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token ist ungültig oder abgelaufen",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ===== DEPENDENCY FUNKTIONEN =====

async def get_current_kunde(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(None)
):
    """
    Dependency um den aktuellen Kunden aus dem JWT Token zu holen
    Wird in FastAPI Endpunkten als Dependency verwendet

    Args:
        token: JWT Token aus dem Authorization Header
        db: Datenbank Session (wird durch Dependency Injection ersetzt)

    Returns:
        Kunde-Objekt des eingeloggten Kunden

    Raises:
        HTTPException: Wenn Token ungültig oder Kunde nicht gefunden

    Example:
        @router.get("/protected")
        def protected_route(current_kunde = Depends(get_current_kunde)):
            return {"kunde": current_kunde.email}
    """
    from database import get_db
    from models.kunde import Kunde

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Anmeldung fehlgeschlagen",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Token dekodieren
        payload = decode_access_token(token)
        kundenid: int = payload.get("kundenid")
        email: str = payload.get("email")

        if kundenid is None or email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    # DB Session holen wenn nicht übergeben
    if db is None:
        db = next(get_db())

    # Kunde aus Datenbank holen
    kunde = db.query(Kunde).filter(Kunde.kundenid == kundenid).first()

    if kunde is None:
        raise credentials_exception

    # Prüfen ob Kunde aktiv ist
    if not kunde.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kunde ist deaktiviert"
        )

    return kunde


async def get_current_active_admin(
        current_kunde = Depends(get_current_kunde)
):
    """
    Dependency um sicherzustellen dass der Kunde ein Admin ist

    Args:
        current_kunde: Aktueller Kunde (aus get_current_kunde)

    Returns:
        Kunde-Objekt wenn Admin

    Raises:
        HTTPException: Wenn Kunde kein Admin ist

    Example:
        @router.delete("/admin/kunden/{id}")
        def delete_kunde(id: int, current_admin = Depends(get_current_active_admin)):
            # Nur Admins können diesen Endpoint nutzen
            ...
    """
    if not current_kunde.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Keine Admin-Berechtigung"
        )
    return current_kunde
