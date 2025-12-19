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
    """Überprüft ob das Passwort mit dem Hash übereinstimmt"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hasht ein Passwort"""
    return pwd_context.hash(password)


# ===== JWT TOKEN FUNKTIONEN =====
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Erstellt einen JWT Access Token
    
    Args:
        data: Dictionary mit Daten die im Token gespeichert werden sollen
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
        Dictionary mit den Token-Daten
    
    Raises:
        HTTPException: Wenn Token ungültig ist
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
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(None)  # Wird durch Dependency Injection ersetzt
):
    """
    Dependency um den aktuellen User aus dem JWT Token zu holen
    
    Args:
        token: JWT Token aus dem Authorization Header
        db: Datenbank Session
    
    Returns:
        User Model
    
    Raises:
        HTTPException: Wenn Token ungültig oder User nicht gefunden
    """
    from database import get_db
    from models.user import User
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Anmeldung fehlgeschlagen",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = decode_access_token(token)
        username: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        
        if username is None or user_id is None:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    # DB Session holen wenn nicht übergeben
    if db is None:
        db = next(get_db())
    
    # User aus Datenbank holen
    user = db.query(User).filter(User.userid == user_id).first()
    
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User ist deaktiviert"
        )
    
    return user


async def get_current_active_admin(
    current_user = Depends(get_current_user)
):
    """
    Dependency um sicherzustellen dass der User ein Admin ist
    
    Args:
        current_user: Aktueller User (aus get_current_user)
    
    Returns:
        User Model
    
    Raises:
        HTTPException: Wenn User kein Admin ist
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Keine Admin-Berechtigung"
        )
    return current_user
