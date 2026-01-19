"""
Core Security Module
Zentrale Funktionen für Authentifizierung, Password-Hashing und JWT-Tokens
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from database import get_db

load_dotenv()

# ===== KONFIGURATION =====
JWT_SECRET = os.getenv("SECRET_KEY", "CHANGE_ME_IN_PRODUCTION")
JWT_ALG = "HS256"
JWT_EXPIRE_MIN = 60 * 24  # 1 Tag

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer = HTTPBearer(auto_error=True)


# ===== PASSWORD FUNKTIONEN =====

def hash_password(password: str) -> str:
    """Hasht ein Passwort mit bcrypt"""
    return pwd_context.hash(password)


def get_password_hash(password: str) -> str:
    """Alias für hash_password - für Kompatibilität"""
    return hash_password(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Überprüft ob Passwort mit Hash übereinstimmt"""
    return pwd_context.verify(password, password_hash)


# ===== JWT TOKEN FUNKTIONEN =====

def create_access_token(claims: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Erstellt JWT Token

    Args:
        claims: Dictionary mit Daten (sollte 'sub', 'type', 'email' enthalten)
        expires_delta: Optional timedelta für Ablaufzeit

    Returns:
        JWT Token String
    """
    payload = claims.copy()

    if expires_delta:
        payload["exp"] = datetime.now(timezone.utc) + expires_delta
    else:
        payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MIN)

    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def decode_token(token: str) -> Dict[str, Any]:
    """
    Dekodiert JWT Token

    Args:
        token: JWT Token String

    Returns:
        Claims Dictionary

    Raises:
        HTTPException: Bei ungültigem Token
    """
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


def get_current_claims(creds: HTTPAuthorizationCredentials = Depends(bearer)) -> Dict[str, Any]:
    """FastAPI Dependency: Holt Claims aus Token"""
    return decode_token(creds.credentials)


# ===== USER DEPENDENCIES =====

async def get_current_user(
        creds: HTTPAuthorizationCredentials = Depends(bearer),
        db: Session = Depends(get_db)
):
    """
    FastAPI Dependency: Holt aktuellen User (Kunde oder Restaurant) aus Token

    Returns:
        User-Objekt (Kunde oder Restaurant) mit zusätzlichem Attribut 'user_type'
    """
    from models.kunde import Kunde
    from models.restaurant import Restaurant

    claims = decode_token(creds.credentials)
    user_type = claims.get("type")
    user_id = claims.get("sub")

    if not user_type or not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims"
        )

    # Je nach User-Typ den entsprechenden User holen
    if user_type == "kunde":
        user = db.query(Kunde).filter(Kunde.kundenid == int(user_id)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Kunde not found"
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Kunde ist deaktiviert"
            )
        # Füge user_type hinzu für später
        user.user_type = "kunde"
        return user

    elif user_type == "restaurant":
        user = db.query(Restaurant).filter(Restaurant.restaurantid == int(user_id)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Restaurant not found"
            )
        # Füge user_type hinzu für später
        user.user_type = "restaurant"
        return user

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unknown user type"
        )


async def get_current_kunde(
        creds: HTTPAuthorizationCredentials = Depends(bearer),
        db: Session = Depends(get_db)
):
    """
    FastAPI Dependency: Holt aktuellen Kunde aus Token
    Wirft Fehler wenn User kein Kunde ist
    """
    from models.kunde import Kunde

    claims = decode_token(creds.credentials)
    user_type = claims.get("type")

    if user_type != "kunde":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers allowed"
        )

    user_id = claims.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    kunde = db.query(Kunde).filter(Kunde.kundenid == int(user_id)).first()

    if not kunde:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kunde not found"
        )

    if not kunde.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kunde ist deaktiviert"
        )

    return kunde


async def get_current_restaurant(
        creds: HTTPAuthorizationCredentials = Depends(bearer),
        db: Session = Depends(get_db)
):
    """
    FastAPI Dependency: Holt aktuelles Restaurant aus Token
    Wirft Fehler wenn User kein Restaurant ist
    """
    from models.restaurant import Restaurant

    claims = decode_token(creds.credentials)
    user_type = claims.get("type")

    if user_type != "restaurant":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only restaurants allowed"
        )

    user_id = claims.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    restaurant = db.query(Restaurant).filter(Restaurant.restaurantid == int(user_id)).first()

    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Restaurant not found"
        )

    return restaurant


async def get_current_active_admin(current_kunde = Depends(get_current_kunde)):
    """
    FastAPI Dependency: Nur für Admin-Kunden
    """
    if not current_kunde.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Keine Admin-Berechtigung"
        )
    return current_kunde